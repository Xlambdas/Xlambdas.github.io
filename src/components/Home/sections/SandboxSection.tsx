// src/components/Home/sections/SandboxSection.tsx
import React from "react";
import { type AppTheme } from "../../../theme";
import { PrimaryButton } from "../../common";
import { HOME_TRANSLATIONS } from "../../../locales";

export const SandboxSection: React.FC<{ theme: AppTheme, t: typeof HOME_TRANSLATIONS['en'] }> = ({ t }) => {

    return (
        <div
            className="w-full h-full flex flex-col justify-center items-start pointer-events-none"
            style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 clamp(10px, 6vw, 80px)',
                gap: 'clamp(30px, 6vh, 100px)'
            }}
        >

            <h2
                style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: `clamp(calc(42px * var(--font-scale)), 8vw, calc(96px * var(--font-scale)))`,
                    fontStyle: "italic",
                    fontWeight: 500,
                    lineHeight: "1",
                    color: 'var(--color-primary)',
                    width: 'auto'
                }}
            >
                {t.sandboxTitle}
            </h2>

            <div
                className="flex flex-col justify-center items-center"
                style={{
                    gap: 'clamp(30px, 6vh, 100px)'
                }}
            >

                <p
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: `clamp(calc(16px * var(--font-scale)), 2.5vw, calc(32px * var(--font-scale)))`,
                        fontStyle: "italic",
                        fontWeight: 500,
                        lineHeight: "1.4",
                        color: 'var(--color-primary)',
                        maxWidth: 'clamp(260px, 60vw, 520px)',
                        textAlign: 'center'
                    }}
                >
                    {t.sandboxDescription}
                </p>

                <div className="pointer-events-auto">
                    <PrimaryButton variant="cta" disabled={true}>
                        {t.discoverMore}
                    </PrimaryButton>
                </div>

            </div>

        </div>
    );
};