import { Router, Request, Response } from 'express';
import Checklist from '../models/Checklist';

const router = Router();

// GET all checklists
router.get('/', async (req: Request, res: Response) => {
  try {
    const lists = await Checklist.find().sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST create new checklist
router.post('/', async (req: Request, res: Response) => {
  try {
    const newList = new Checklist(req.body);
    const saved = await newList.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// PATCH update checklist
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Checklist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// DELETE checklist
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Checklist.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
