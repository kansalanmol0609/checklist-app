import mongoose, { Schema, model, Document } from 'mongoose';

/**
 * Subdocument schema for checklist template items.
 */
interface ChecklistTemplateItem {
  id: string;
  text: string;
}

/**
 * Main ChecklistTemplate document schema.
 */
interface IChecklistTemplate extends Document {
  title: string;
  icon: string;
  colorScheme: string;
  items: ChecklistTemplateItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for template item subdocuments (no separate _id)
const TemplateItemSchema = new Schema<ChecklistTemplateItem>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      index: true,
    },
    text: { type: String, required: true },
  },
  { _id: false }
);

// Schema for ChecklistTemplate
const ChecklistTemplateSchema = new Schema<IChecklistTemplate>(
  {
    title: { type: String, required: true, index: true },
    icon: { type: String, required: true },
    colorScheme: { type: String, required: true },
    items: { type: [TemplateItemSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IChecklistTemplate>(
  'ChecklistTemplate',
  ChecklistTemplateSchema
);
