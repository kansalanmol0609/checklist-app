import mongoose, { Schema, model, Document } from 'mongoose';

/**
 * Subdocument schema for individual checklist items.
 */
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Main Checklist document schema.
 */
interface IChecklist extends Document {
  templateId?: string; // optional link to a template
  title: string; // checklist title
  icon: string; // icon name (MaterialCommunityIcons)
  colorScheme: string; // e.g. 'peach', 'mint'
  items: ChecklistItem[]; // list of items
  createdAt: Date;
  updatedAt: Date;
}

// Schema for item subdocuments (no separate _id)
const ItemSchema = new Schema<ChecklistItem>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      index: true,
    },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

// Schema for Checklist
const ChecklistSchema = new Schema<IChecklist>(
  {
    templateId: { type: String, required: false, index: true },
    title: { type: String, required: true, index: true },
    icon: { type: String, required: true },
    colorScheme: { type: String, required: true },
    items: { type: [ItemSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IChecklist>('Checklist', ChecklistSchema);
