import React, { useState } from 'react';

export const MenuIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
        onClick?.();
    };

    return (
        <button
            onClick={handleClick}
            className="hidden menu-icon"
            data-open={isOpen}
            style={{
                background: 'transparent',
                border: 'none',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
        >
            {/* Hamburger Menu */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="40"
                viewBox="0 0 88 79"
                fill="none"
                className="menu-hamburger"
            >
                <line x1="17" y1="11" x2="71" y2="11" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="11" y1="40" x2="77" y2="40" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="17" y1="68" x2="71" y2="68" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
            </svg>

            {/* X Cross */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="40"
                viewBox="0 0 88 79"
                fill="none"
                className="menu-close"
            >
                <line x1="21" y1="63.3213" x2="67.3215" y2="16.9998" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="20.2426" y1="17" x2="66.9117" y2="63.669" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
            </svg>
        </button>
    );
};