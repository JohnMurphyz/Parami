import { Colors } from './Colors';

export const Typography = {
  // Display
  paramiName: {
    fontSize: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    lineHeight: 44,
    color: Colors.deepCharcoal,
  },
  englishName: {
    fontSize: 24,
    fontWeight: '400' as const,
    color: Colors.saffronGold,
    lineHeight: 30,
  },

  // Headings
  h1: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
    color: Colors.deepCharcoal,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: Colors.deepCharcoal,
  },
  h3: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'capitalize' as const,
    color: Colors.deepStone,
  },

  // Body
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 28,
    color: Colors.deepStone,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: Colors.deepStone,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    color: Colors.mediumStone,
  },

  // Special
  quote: {
    fontSize: 19,
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: 30,
    color: Colors.deepCharcoal,
  },

  // Journal/Organic styles
  journalEntry: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 26,
    color: Colors.inkBrown,
    letterSpacing: 0.2,
  },
  softEmphasis: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: Colors.mediumStone,
    fontStyle: 'italic' as const,
  },
};
