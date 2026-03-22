import { createTheme, rem } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

const primaryBlue: MantineColorsTuple = [
  '#eef4ff',
  '#d6e4ff',
  '#a8c8ff',
  '#78acff',
  '#4d8fee',
  '#2268D1', // [5] — brand primary
  '#1c54aa',
  '#154085',
  '#0e2c5e',
  '#07183a',
];

export const theme = createTheme({
  colors: {
    primary: primaryBlue,
  },
  primaryColor: 'primary',
  primaryShade: 5,
  fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  headings: {
    fontFamily: "'Albert Sans', sans-serif",
    sizes: {
      h1: { fontSize: rem(32), lineHeight: '1.25', fontWeight: '500' },
      h2: { fontSize: rem(20), lineHeight: '1.3',  fontWeight: '600' },
    },
  },
  defaultRadius: 0,
  components: {
    Card: {
      styles: {
        root: {
          backgroundColor: '#FCFCFC',
          borderRadius: 0,
          // Flat by default — hover lift handled in WidgetCard
          boxShadow: '0 1px 2px rgba(18,19,26,0.05), 0 1px 4px rgba(18,19,26,0.04)',
        },
      },
    },
    Text: {
      styles: {
        root: { color: '#12131A' },
      },
    },
    Tooltip: {
      styles: {
        tooltip: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: rem(12),
          backgroundColor: '#1A1C24',
          color: '#F0F1F3',
        },
      },
    },
    Badge: {
      styles: {
        root: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
        },
      },
    },
  },
});
