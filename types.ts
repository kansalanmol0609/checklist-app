import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentType } from 'react';
import { ChecklistColorScheme } from './constants/checklistColorSchemes';

type Props =
  typeof MaterialCommunityIcons extends ComponentType<infer P> ? P : never;

export type IconName = Props['name'];

export interface ChecklistTemplateItem {
  id: string; // unique within the template
  text: string;
}

export interface ChecklistTemplate {
  id: string;
  title: string;
  icon: IconName; // e.g. 'briefcase', 'cake'
  colorScheme: (typeof ChecklistColorScheme)[keyof typeof ChecklistColorScheme]; // e.g. 'peach'
  items: ChecklistTemplateItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  templateId?: string; // optional link
  title: string;
  icon: IconName; // e.g. 'airplane', 'dumbbell'
  colorScheme: (typeof ChecklistColorScheme)[keyof typeof ChecklistColorScheme]; // e.g. 'peach'
  items: ChecklistItem[];
}
