// src/components/Home/sections/AboutSection.tsx
import React from "react";
import { PrimaryButton } from "../../common";
import { type AppTheme } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { HOME_TRANSLATIONS } from "../../../locales";

export const AboutSection: React.FC<{ theme: AppTheme, t: typeof HOME_TRANSLATIONS['en'] }> = ({ t }) => {
    const navigate = useNavigate();

    return (
        <div
            className="w-full h-full flex flex-col items-start justify-center"
            style={{
                padding: '0 clamp(20px, 4vw, 60px)',
                boxSizing: 'border-box',
                gap: 'clamp(15px, 6vh, 100px)'
            }}
        >

            <h2
                style={{
                    fontSize: `clamp(calc(10px * var(--font-scale)), 6vw, calc(60px * var(--font-scale)))`,
                    fontFamily: 'var(--font-primary)',
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: 'var(--color-primary)',
                    width: '75vw'
                }}
            >
                {t.aboutTitle}
            </h2>

            <div
                className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between"
                style={{
                    gap: 'clamp(15px, 8vh, 100px)',
                    padding: '0 clamp(10px, 4vw, 40px)',
                    flexWrap: 'wrap'
                }}
            >

                <div className="flex-1 flex lg:flex-none justify-center lg:justify-start">

                    <p
                        style={{
                            fontSize: `clamp(calc(18px * var(--font-scale)), 2vw, calc(36px * var(--font-scale)))`,
                            fontFamily: 'var(--font-secondary)',
                            color: 'var(--color-primary)',
                            width: 'clamp(300px, 50vw, 550px)',
                            textAlign: 'justify',
                            hyphens: 'auto'
                        }}
                    >
                        {t.aboutDescription}
                    </p>
                </div>

                <div
                    className="flex flex-col items-end pointer-events-auto mt-auto"
                    style={{
                        width: 'clamp(320px, 40vw, 569px)',
                        gap: 'clamp(10px, 2vh, 20px)'
                    }}
                >

                    <PrimaryButton variant="small" onClick={() => navigate('/projects')}>
                        {t.myProjects}
                    </PrimaryButton>

                    <PrimaryButton variant="large" disabled={false} onClick={() => navigate('/portfolio')}>
                        {t.myJourney}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};