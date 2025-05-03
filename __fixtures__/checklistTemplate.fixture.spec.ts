import { ChecklistTemplate } from '@/types';

export const MOCK_CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'daily-routine',
    title: 'Daily Routine',
    icon: 'white-balance-sunny',
    colorScheme: 'sky',
    items: [
      { id: 'wake-up', text: 'Wake up by 7 AM' },
      { id: 'meditation', text: 'Morning meditation' },
      { id: 'emails', text: 'Check emails' },
      { id: 'stand-up', text: 'Daily stand-up meeting' },
      { id: 'lunch', text: 'Lunch break' },
      { id: 'gym', text: 'Evening workout' },
      { id: 'plan-tom', text: 'Plan tomorrow’s tasks' },
    ],
  },
  {
    id: 'moving-house',
    title: 'Move House Checklist',
    icon: 'home',
    colorScheme: 'mint',
    items: [
      { id: 'pack-kitchen', text: 'Pack kitchen essentials' },
      { id: 'utilities', text: 'Arrange utilities transfer' },
      { id: 'address-upd', text: 'Update address' },
      { id: 'clean-old', text: 'Clean old place' },
      { id: 'deep-clean', text: 'Deep clean new place' },
      { id: 'unpack-basics', text: 'Unpack basic items' },
    ],
  },
  {
    id: 'event-planning',
    title: 'Event Planning',
    icon: 'calendar',
    colorScheme: 'peach',
    items: [
      { id: 'venue', text: 'Book venue' },
      { id: 'catering', text: 'Confirm catering' },
      { id: 'invitations', text: 'Send invitations' },
      { id: 'a-v', text: 'Arrange A/V setup' },
      { id: 'decor', text: 'Order decorations' },
      { id: 'follow-up', text: 'Follow up with vendors' },
    ],
  },
];
