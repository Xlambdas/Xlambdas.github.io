// src/components/Header/types.ts

export interface HeaderProps {
    type: 'main' | 'minimal';
    animationsEnabled: boolean;
    setAnimationsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
