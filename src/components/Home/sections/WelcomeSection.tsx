// src/components/Home/sections/WelcomeSection.tsx
import React from "react";
import { PrimaryButton } from "../../common";
import type { AppTheme } from "../../../theme";
import { HOME_TRANSLATIONS } from "../../../locales";

export const WelcomeSection: React.FC<{ theme: AppTheme, t: typeof HOME_TRANSLATIONS['en'] }> = ({ t }) => {

    return (
        <div
            className="flex flex-col justify-center items-end w-full h-screen min-h-full mx-auto pointer-events-none"
            style={{
                maxWidth: '1800px',
                padding: `0 clamp(20px, 4vw, 60px)`
            }}
        >

            <div className="flex flex-col justify-center items-center w-full"
                style={{
                    gap: `clamp(80px, 6vh, 120px)`
                }}
            >

                <div className="flex flex-col items-end w-full">
                    <h1
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: `clamp(calc(36px * var(--font-scale)), 8vw, calc(96px * var(--font-scale)))`,
                            fontStyle: "italic",
                            fontWeight: 500,
                            lineHeight: "normal",
                            color: 'var(--color-primary)',
                        }}
                    >
                        {t.welcomeTitle}
                    </h1>

                    <p
                        style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: `clamp(calc(16px * var(--font-scale)), 2.5vw, calc(32px * var(--font-scale)))`,
                            fontWeight: 500,
                            color: 'var(--color-primary)',
                            maxWidth: `clamp(260px, 50vw, 720px)`,
                            minWidth: `clamp(240px, 60vw, 450px)`,
                            textAlign: 'right'
                        }}
                    >
                        {t.welcomeSubtitle}
                    </p>
                </div>

                <div
                    className="flex justify-between items-center w-full"
                    style={{
                        height: '64px',
                        paddingLeft: `clamp(0px, 20vw, 320px)`
                    }}
                >
                    <div />

                    <div className="pointer-events-auto">
                        <PrimaryButton variant="cta" disabled={true}>
                            {t.enterSystem}
                        </PrimaryButton>
                    </div>

                    <div />
                </div>
            </div>
        </div>
    );
};