import { Router, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';

const router = Router();

// Issue a new access token using the refresh token
router.post('/', async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) return res.sendStatus(403);

  try {
    // Optionally verify the token is within its expiry
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_ACCESS_SECRET as string
    );
    const userId = (payload as any).userId;

    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY } as SignOptions
    );

    res.json({ accessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
});

export default router;
