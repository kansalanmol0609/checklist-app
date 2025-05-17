import { Router, Request, Response } from 'express';
import RefreshToken from '../models/RefreshToken';

const router = Router();

// Revoke (delete) the refresh token
router.post('/', async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.clearCookie('refreshToken');
  }
  res.sendStatus(204);
});

export default router;
