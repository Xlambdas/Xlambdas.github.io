// src/pages/accessibility/components/LivePreview.tsx
import { type LivePreviewProps } from '../constants/types';

export const LivePreview: React.FC<LivePreviewProps> = ({ theme, t }) => {
    return (
        <div
            className="mt-4 p-8 sm:p-12 rounded-2xl border-4 transition-all"
            style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-secondary)',
            }}
        >
            <h2
                className="text-2xl sm:text-3xl font-light italic mb-8"
                style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-primary)',
                    letterSpacing: '-0.02em',
                }}
            >
                {t.livePreview}
            </h2>
            <div
                className="p-8 sm:p-12 rounded-xl text-center leading-relaxed min-h-50 flex flex-col items-center justify-center transition-colors"
                style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: 'calc(18px * var(--font-scale))',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-primary)',
                }}
            >
                <p className="mb-4">{t.previewText}</p>
                <code className="text-sm opacity-60" style={{ fontFamily: 'var(--font-secondary)' }}>
                    {theme.typography.primaryFontFamily} / {theme.typography.secondaryFontFamily}
                </code>
            </div>
        </div>
    );
};