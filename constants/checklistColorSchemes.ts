export const ChecklistColorScheme = {
  lemon: 'lemon',
  peach: 'peach',
  mint: 'mint',
  sky: 'sky',
  lavender: 'lavender',
  blush: 'blush',
} as const;

export const CHECKLIST_COLOR_SCHEMES = {
  lemon: {
    id: ChecklistColorScheme.lemon,
    background: '#FFFDE7', // pale yellow
    text: '#212121', // dark slate
    icon: '#F9A825', // vibrant mustard
  },
  peach: {
    id: ChecklistColorScheme.peach,
    background: '#FFF3E0', // light peach
    text: '#212121',
    icon: '#FB8C00', // deep orange
  },
  mint: {
    id: ChecklistColorScheme.mint,
    background: '#E8F5E9', // mint cream
    text: '#212121',
    icon: '#43A047', // rich green
  },
  sky: {
    id: ChecklistColorScheme.sky,
    background: '#E3F2FD', // sky blue
    text: '#212121',
    icon: '#1E88E5', // bold blue
  },
  lavender: {
    id: ChecklistColorScheme.lavender,
    background: '#F3E5F5', // soft lavender
    text: '#212121',
    icon: '#8E24AA', // vivid purple
  },
  blush: {
    id: ChecklistColorScheme.blush,
    background: '#FCE4EC', // light pink
    text: '#212121',
    icon: '#D81B60', // deep rose
  },
} as const;

export const DEFAULT_CHECKLIST_COLOR_SCHEME = ChecklistColorScheme.lemon;
