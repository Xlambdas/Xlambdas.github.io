// src/locales/header.ts
import { type Language } from '../pages/settings';

export interface HeaderTranslations {
    animationsOn: string;
    animationsOff: string;
    settings: string;
}

export const HEADER_TRANSLATIONS: Record<Language, HeaderTranslations> = {
    en: {
        animationsOn: 'Animations enabled',
        animationsOff: 'Animations disabled',
        settings: 'Settings',
    },
    es: {
        animationsOn: 'Animaciones activadas',
        animationsOff: 'Animaciones desactivadas',
        settings: 'Configuración',
    },
    fr: {
        animationsOn: 'Animations activées',
        animationsOff: 'Animations désactivées',
        settings: 'Paramètres',
    },
    de: {
        animationsOn: 'Animationen aktiviert',
        animationsOff: 'Animationen deaktiviert',
        settings: 'Einstellungen',
    },
    it: {
        animationsOn: 'Animazioni attivate',
        animationsOff: 'Animazioni disattivate',
        settings: 'Impostazioni',
    },
};