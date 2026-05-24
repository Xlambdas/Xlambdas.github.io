import React from "react";
import { useNavigate } from "react-router-dom";
import { BackIcon, SettingsIcon, Divider, NotificationIcon, SearchIcon, HomeIcon, StrengthenIcon, ProfileIcon,  } from "../../constants";

interface DockBtnProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    danger?: boolean;
}

export const DockBtn: React.FC<DockBtnProps> = ({
    icon,
    label,
    onClick,
    active,
    danger
}) => (
    <button
        onClick={onClick}
        title={label}
        style={{
            width: 40,
            height: 40,
            background: active
                ? danger ? "rgba(239,68,68,0.12)" : "rgba(165,180,252,0.12)"
                : "none",
            border: `1px solid ${active
                ? danger ? "rgba(239,68,68,0.3)" : "rgba(165,180,252,0.25)"
                : "transparent"}`,
            borderRadius: 10,
            color: active
                ? danger ? "#ef4444" : "#a5b4fc"
                : "#484f58",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            transition: "all 0.15s ease",
            flexShrink: 0,
        }}
        onMouseEnter={(e) => {
            if (!active) {
                e.currentTarget.style.background = "#21262d";
                e.currentTarget.style.borderColor = "#30363d";
            }
        }}
        onMouseLeave={(e) => {
            if (!active) {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.borderColor = "transparent";
            }
        }}
    >
        {icon}
    </button>
);



// Define all available button types
export type DockButtonType =
    | 'back'
    | 'profile'
    | 'strengthen'
    | 'settings'
    | 'home'
    | 'search'
    | 'notifications'
    | 'divider';

export interface DockItem {
    type: DockButtonType;
    onClick?: () => void;
    active?: boolean;
    danger?: boolean;
}

interface DockProps {
    items: DockItem[];
    className?: string;
}

// Registry of all available buttons with their default configs
const BUTTON_REGISTRY: Record<Exclude<DockButtonType, 'divider'>, {
    icon: React.ReactNode;
    label: string;
}> = {
    back: {
        icon: <BackIcon size={18} />,
        label: "Retour",
    },
    profile: {
        icon: <ProfileIcon size={18} />,
        label: "Profil",
    },
    strengthen: {
        icon: <StrengthenIcon size={18} />,
        label: "S'entraîner",
    },
    settings: {
        icon: <SettingsIcon size={18} />,
        label: "Paramètres",
    },
    home: {
        icon: <HomeIcon size={18} />,
        label: "Accueil",
    },
    search: {
        icon: <SearchIcon size={18} />,
        label: "Rechercher",
    },
    notifications: {
        icon: <NotificationIcon size={18} />,
        label: "Notifications",
    },
};

export const Dock: React.FC<DockProps> = ({ items, className = "" }) => {
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

    return (
        <div
            className={`hidden sm:flex flex-col items-center shrink-0 border-r border-[#21262d] bg-[#161b22] py-3 gap-1 ${className}`}
            style={{ width: 56 }}
        >
            {items.map((item, index) => {
                if (item.type === 'divider') {
                    return <Divider key={`divider-${index}`} />;
                }

                const config = BUTTON_REGISTRY[item.type];
                if (!config) {
                    console.warn(`Unknown dock button type: ${item.type}`);
                    return null;
                }

                return (
                    <DockBtn
                        key={`${item.type}-${index}`}
                        icon={config.icon}
                        label={config.label}
                        onClick={item.onClick || getDefaultOnClick(item.type) || (() => { })}
                        active={item.active}
                        danger={item.danger}
                    />
                );
            })}
        </div>
    );
};