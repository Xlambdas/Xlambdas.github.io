// src/components/common/Button/Button.tsx
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useTheme } from "../../../context/themeContext";
import { COMPONENT_TRANSLATIONS } from "../../../locales";
import { type PrimaryButtonProps } from "../types";

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    onClick,
    ariaLabel,
    disabled = false,
    className,
    variant = "default",
}) => {
    return (
        <button
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "primary-button",
                `primary-button--${variant}`,
                className
            )}
        >
            {children}
        </button>
    );
};


export const UpArrowButton = React.memo(({ onClick }: { onClick: () => void }) => {
    const { theme } = useTheme();
    const t = COMPONENT_TRANSLATIONS[theme.language];

    return (
        <button
            onClick={onClick}
            aria-label={t.previousSection}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-40 p-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg hover:opacity-70 hover:scale-110 active:scale-75"
            style={{ color: 'var(--color-primary)' }}
        >
            <ChevronUp size={32} />
        </button>
    );
});

export const DownArrowButton = React.memo(({ onClick }: { onClick: () => void }) => {
    const { theme } = useTheme();
    const t = COMPONENT_TRANSLATIONS[theme.language];

    return (
        <button
            onClick={onClick}
            aria-label={t.nextSection}
            className="absolute bottom-6 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 p-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg hover:opacity-70 hover:scale-90 active:scale-75"
            style={{ color: 'var(--color-primary)' }}
        >
            <ChevronDown size={32} />
        </button>
    );
});
