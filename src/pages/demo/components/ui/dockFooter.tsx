import React from "react";
import { useNavigate } from "react-router-dom";
import {
    BackIcon,
    SettingsIcon,
    HomeIcon,
    ProfileIcon,
} from "../../constants";
import type { DockButtonType, DockItem } from "./dock";

interface DockFooterProps {
    items: DockItem[];
    exclude?: DockButtonType[]; // Items to exclude (because they're in header)
}

// Registry of all available buttons with their configs
const BUTTON_REGISTRY: Record<Exclude<DockButtonType, 'divider'>, {
    icon: React.ReactNode;
    label: string;
}> = {
    back: {
        icon: <BackIcon size={20} />,
        label: "Retour",
    },
    profile: {
        icon: <ProfileIcon size={20} />,
        label: "Profil",
    },
    strengthen: {
        icon: "💪",
        label: "S'entraîner",
    },
    settings: {
        icon: <SettingsIcon size={20} />,
        label: "Réglages",
    },
    home: {
        icon: <HomeIcon size={20} />,
        label: "Accueil",
    },
    search: {
        icon: "🔍",
        label: "Recherche",
    },
    notifications: {
        icon: "🔔",
        label: "Notifs",
    },
};

export const DockFooter: React.FC<DockFooterProps> = ({
    items,
    exclude = []
}) => {
    const navigate = useNavigate();

    // Default onClick handlers for common actions
    const getDefaultOnClick = (type: DockButtonType): (() => void) | undefined => {
        switch (type) {
            case 'back':
                return () => navigate(-1);
            case 'profile':
                return () => navigate("/demo/profile");
            case 'home':
                return () => navigate("/demoHome");
            default:
                return undefined;
        }
    };

    // Filter items (exclude items that are in the header + skip dividers)
    const mobileItems = items.filter(item =>
        item.type !== 'divider' && !exclude.includes(item.type)
    );

    if (mobileItems.length === 0) return null;

    return (
        <div
            className="flex sm:hidden fixed bottom-0 left-0 right-0 items-center justify-around border-t border-[#21262d] z-50"
            style={{
                height: 64,
                backdropFilter: "blur(8px)",
                background: "rgba(22,27,34,0.95)",
            }}
        >
            {mobileItems.map((item, index) => {
                const config = BUTTON_REGISTRY[item.type as Exclude<DockButtonType, 'divider'>];
                if (!config) {
                    console.warn(`Unknown footer button type: ${item.type}`);
                    return null;
                }

                return (
                    <button
                        key={`mobile-${item.type}-${index}`}
                        onClick={item.onClick || getDefaultOnClick(item.type) || (() => { })}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            padding: "8px 12px",
                            background: item.active ? "rgba(165,180,252,0.12)" : "transparent",
                            border: "none",
                            borderRadius: 8,
                            color: item.active ? "#a5b4fc" : "#8b949e",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            flex: 1,
                            maxWidth: 80,
                        }}
                    >
                        <div style={{ fontSize: 20 }}>
                            {config.icon}
                        </div>
                        <span style={{
                            fontSize: 10,
                            fontWeight: 500,
                            textAlign: "center",
                        }}>
                            {config.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};