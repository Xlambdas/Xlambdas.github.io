// src/styles/tokens.ts

export const FONTS = {
    montserrat: 'Montserrat',
    jetbrains: 'JetBrains Mono',
    inter: 'Inter',
    arial: 'Arial',
} as const;

/**
 * Responsive horizontal / vertical padding, unaffected by theme but
 * exported here so all layout constants live in one file.
 */
export const PADDING = {
    horizontal: 'clamp(10px,6vw,80px)',
    verticalSection: '70px',
} as const;