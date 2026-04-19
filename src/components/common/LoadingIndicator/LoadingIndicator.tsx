// src/components/common/LoadingIndicator/LoadingIndicator.tsx
import React from "react";
import { type LoadingIndicatorProps } from "../types";
import { useTheme } from "../../../context/themeContext";
import { COMPONENT_TRANSLATIONS } from "../../../locales";

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    message,
}) => {
    const { theme } = useTheme();
    const t = COMPONENT_TRANSLATIONS[theme.language];
    const displayMessage = message ?? t.loadingMessage;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={displayMessage}
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4"
            style={{
                background: 'var(--color-background)',
                fontFamily: 'var(--font-secondary)',
                fontSize: 'calc(1rem * var(--font-scale))',
            }}
            data-reduced-motion={theme.reducedMotion}
        >
            <div
                aria-hidden="true"
                className="loading-spinner"
                style={{
                    borderColor: 'var(--color-primary-transparent)',
                    borderTopColor: 'var(--color-primary)',
                }}
            />
            <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)', fontSize: 'calc(1rem * var(--font-scale))' }}>
                {displayMessage}
            </span>
        </div>
    );
};