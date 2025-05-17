import type { Checklist, ChecklistTemplate } from '@/types';

export function instantiateTemplate(tmpl: ChecklistTemplate): Checklist {
  return {
    id: `chk-${tmpl.id}-${Date.now()}`,
    templateId: tmpl.id,
    title: tmpl.title,
    icon: tmpl.icon,
    colorScheme: tmpl.colorScheme,
    items: tmpl.items.map((item) => ({
      id: `${tmpl.id}-${item.id}-${Date.now()}`,
      text: item.text,
      completed: false,
    })),
  };
}
