import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import { googleAuthClient } from '../services/googleAuthClient';

const router = Router();

// Helper to parse duration strings like '7d', '15m'
function parseDuration(str: string): number {
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

async function createTokens(userId: string, userAgent?: string) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY } as SignOptions
  );

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(
    Date.now() + parseDuration(process.env.JWT_REFRESH_EXPIRY || '7d')
  );

  await RefreshToken.create({
    user: userId,
    token: refreshToken,
    userAgent,
    expiresAt,
  });

  return { accessToken, refreshToken };
}

// Google OAuth login
router.post('/google', async (req: Request, res: Response) => {
  const client = googleAuthClient.getInstance();

  const { code, codeVerifier, redirectUri, clientId } = req.body;

  if (!code || !codeVerifier) {
    return res.status(400).json({ error: 'Missing Google auth code' });
  }

  // Exchange code for tokens
  const tokenResponse = await client.getToken({
    code,
    codeVerifier,
    redirect_uri: redirectUri,
    client_id: clientId,
  });

  const idToken = tokenResponse.tokens.id_token;
  if (!idToken) {
    return res
      .status(400)
      .json({ error: 'Failed to obtain id_token from Google' });
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  if (!payload) return res.status(400).json({ error: 'Invalid Google token' });

  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ googleId });

  // Let's create a new user if it doesn't exist
  if (!user) {
    user = new User({ googleId, email, name });
    await user.save();
  }

  const { accessToken, refreshToken } = await createTokens(
    user._id.toString(),
    req.headers['user-agent']
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseDuration(process.env.JWT_REFRESH_EXPIRY || '7d'),
  });

  res.json({ accessToken });
});

// Fetch current user profile (protected route)
router.get('/me', async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
