import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth';
import refreshRoutes from './routes/refresh';
import logoutRoutes from './routes/logout';
import checklistRoutes from './routes/checklists';
import templateRoutes from './routes/checklistTemplates';
import authenticateToken from './middleware/auth';

dotenv.config();

const app: Application = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(authenticateToken);

const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Public auth endpoints
app.use('/api/auth', authRoutes);
app.use('/api/refresh', refreshRoutes);
app.use('/api/logout', logoutRoutes);

// Protected checklist and template endpoints
app.use('/api/checklists', checklistRoutes);
app.use('/api/templates', templateRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
