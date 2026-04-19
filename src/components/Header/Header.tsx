// src/components/Header/Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { type HeaderProps } from "./types";
import { useTheme } from "../../context/themeContext";
import { HEADER_TRANSLATIONS } from "../../locales";
import { MenuIcon } from "./MenuIcon";

export const Header: React.FC<HeaderProps> = ({
    type = "default",
    animationsEnabled,
    setAnimationsEnabled,
}) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const t = HEADER_TRANSLATIONS[theme.language];

    return (
        <header
            className="fixed top-0 left-0 right-0 z-10 flex items-center"
            style={{
                height: 'clamp(60px, 6vh, 70px)',
                background: 'var(--color-secondary)'
            }}
        >
            <div
                className="flex items-center justify-between w-full gap-4"
                style={{
                    padding: '0 clamp(16px, 4vw, 40px)',
                    maxWidth: '1800px',
                    margin: '0 auto'
                }}
            >
                <a
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}
                    className="transition-opacity hover:opacity-70"
                    style={{
                        flex: 1,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                        fontStyle: 'italic',
                        fontWeight: 300,
                        color: 'var(--color-primary)',
                        cursor: 'pointer'
                    }}
                >
                    XLS.studio
                </a>

                {type === "main" && setAnimationsEnabled && (
                    <button
                        onClick={() => setAnimationsEnabled(prev => !prev)}
                        className={`header-toggle transition-opacity hover:opacity-70 hide-below-600 ${animationsEnabled ? "active" : ""}`}
                        style={{
                            fontFamily: 'var(--font-secondary)',
                            color: animationsEnabled ? 'var(--color-secondary)' : 'var(--color-primary)',
                            borderColor: 'var(--color-primary)',
                            background: animationsEnabled ? 'var(--color-primary)' : 'transparent'
                        }}
                    >
                        {animationsEnabled ? t.animationsOn : t.animationsOff}
                    </button>
                )}

                <button
                    onClick={() => navigate("/settings")}
                    className="header-button transition-opacity hover:opacity-70"
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                    }}
                >
                    {t.settings}
                </button>

                {/* <button
                    className="header-color-toggle"
                    style={{
                        background: 'var(--color-primary)'
                    }}
                /> */}
                <div
                    className="hidden"
                >
                    <MenuIcon />
                </div>
            </div>
        </header>
    );
};