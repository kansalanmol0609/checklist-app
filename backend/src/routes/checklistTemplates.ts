// src/routes/checklistTemplates.ts

import { Router, Request, Response } from 'express';
import ChecklistTemplate from '../models/ChecklistTemplate';

const router = Router();

/**
 * GET /api/templates
 * Fetch all checklist templates
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const templates = await ChecklistTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /api/templates
 * Create a new checklist template
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const newTemplate = new ChecklistTemplate(req.body);
    const saved = await newTemplate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

/**
 * PATCH /api/templates/:id
 * Update an existing checklist template
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await ChecklistTemplate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Template not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

/**
 * DELETE /api/templates/:id
 * Remove a checklist template
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await ChecklistTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Template not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
