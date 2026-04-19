// src/locales/accessibility.ts
import { type Language } from '../pages/settings';

export interface SettingsTranslation {
    title: string;
    back: string;
    reset: string;
    colors: string;
    typography: string;
    sizes: string;
    language: string;
    motion: string;
    primary: string;
    secondary: string;
    background: string;
    primaryFont: string;
    secondaryFont: string;
    textSize: string;
    buttonSize: string;
    reduceMotion: string;
    highContrast: string;
    livePreview: string;
    previewText: string;
    colorPresetsTitle: string;
    customColorsTitle: string;
    presetPurpleNight: string;
    presetOceanBlue: string;
    presetSunset: string;
    presetForestGreen: string;
    presetLightMode: string;
}

export const SETTINGS_TRANSLATIONS: Record<Language, SettingsTranslation> = {
    en: {
        title: 'Settings',
        back: '← Back',
        reset: 'Reset All Settings',
        colors: 'Colors',
        typography: 'Typography',
        sizes: 'Sizes',
        language: 'Language',
        motion: 'Motion',
        primary: 'Primary Color',
        secondary: 'Secondary Color',
        background: 'Background Color',
        primaryFont: 'Primary Font (Headings)',
        secondaryFont: 'Secondary Font (Code/Text)',
        textSize: 'Text Size',
        buttonSize: 'Button Size',
        reduceMotion: 'Reduce Motion',
        highContrast: 'High Contrast Mode',
        livePreview: 'Live Preview',
        previewText: 'Your settings are applied instantly.',
        colorPresetsTitle: 'Presets',
        customColorsTitle: 'Custom Colors',
        presetPurpleNight: 'Purple Night',
        presetOceanBlue: 'Ocean Blue',
        presetSunset: 'Sunset',
        presetForestGreen: 'Forest Green',
        presetLightMode: 'Light Mode',
    },
    es: {
        title: 'Configuración',
        back: '← Volver',
        reset: 'Restablecer todos los ajustes',
        colors: 'Colores',
        typography: 'Tipografía',
        sizes: 'Tamaños',
        language: 'Idioma',
        motion: 'Animaciones',
        primary: 'Color principal',
        secondary: 'Color secundario',
        background: 'Color de fondo',
        primaryFont: 'Fuente principal (títulos)',
        secondaryFont: 'Fuente secundaria (código/texto)',
        textSize: 'Tamaño del texto',
        buttonSize: 'Tamaño de los botones',
        reduceMotion: 'Reducir animaciones',
        highContrast: 'Modo de alto contraste',
        livePreview: 'Vista previa en tiempo real',
        previewText: 'Los cambios se aplican al instante.',
        colorPresetsTitle: 'Preajustes',
        customColorsTitle: 'Colores personalizados',
        presetPurpleNight: 'Noche púrpura',
        presetOceanBlue: 'Azul océano',
        presetSunset: 'Atardecer',
        presetForestGreen: 'Verde bosque',
        presetLightMode: 'Modo claro',
    },
    fr: {
        title: 'Paramètres',
        back: '← Retour',
        reset: 'Réinitialiser tous les paramètres',
        colors: 'Couleurs',
        typography: 'Typographie',
        sizes: 'Tailles',
        language: 'Langue',
        motion: 'Animations',
        primary: 'Couleur principale',
        secondary: 'Couleur secondaire',
        background: 'Couleur d’arrière-plan',
        primaryFont: 'Police principale (titres)',
        secondaryFont: 'Police secondaire (code/texte)',
        textSize: 'Taille du texte',
        buttonSize: 'Taille des boutons',
        reduceMotion: 'Réduire les animations',
        highContrast: 'Mode à contraste élevé',
        livePreview: 'Aperçu en temps réel',
        previewText: 'Vos paramètres sont appliqués instantanément.',
        colorPresetsTitle: 'Préréglages',
        customColorsTitle: 'Couleurs personnalisées',
        presetPurpleNight: 'Nuit violette',
        presetOceanBlue: 'Bleu océan',
        presetSunset: 'Coucher de soleil',
        presetForestGreen: 'Vert forêt',
        presetLightMode: 'Mode clair',
    },
    de: {
        title: 'Einstellungen',
        back: '← Zurück',
        reset: 'Alle Einstellungen zurücksetzen',
        colors: 'Farben',
        typography: 'Typografie',
        sizes: 'Größen',
        language: 'Sprache',
        motion: 'Animationen',
        primary: 'Primärfarbe',
        secondary: 'Sekundärfarbe',
        background: 'Hintergrundfarbe',
        primaryFont: 'Primäre Schrift (Überschriften)',
        secondaryFont: 'Sekundäre Schrift (Code/Text)',
        textSize: 'Textgröße',
        buttonSize: 'Schaltflächengröße',
        reduceMotion: 'Animationen reduzieren',
        highContrast: 'Hoher Kontrast',
        livePreview: 'Live-Vorschau',
        previewText: 'Ihre Einstellungen werden sofort angewendet.',
        colorPresetsTitle: 'Voreinstellungen',
        customColorsTitle: 'Benutzerdefinierte Farben',
        presetPurpleNight: 'Lila Nacht',
        presetOceanBlue: 'Ozeanblau',
        presetSunset: 'Sonnenuntergang',
        presetForestGreen: 'Waldgrün',
        presetLightMode: 'Heller Modus',
    },
    it: {
        title: 'Impostazioni',
        back: '← Indietro',
        reset: 'Ripristina tutte le impostazioni',
        colors: 'Colori',
        typography: 'Tipografia',
        sizes: 'Dimensioni',
        language: 'Lingua',
        motion: 'Animazioni',
        primary: 'Colore principale',
        secondary: 'Colore secondario',
        background: 'Colore di sfondo',
        primaryFont: 'Font principale (titoli)',
        secondaryFont: 'Font secondario (codice/testo)',
        textSize: 'Dimensione del testo',
        buttonSize: 'Dimensione dei pulsanti',
        reduceMotion: 'Riduci animazioni',
        highContrast: 'Modalità ad alto contrasto',
        livePreview: 'Anteprima in tempo reale',
        previewText: 'Le modifiche vengono applicate immediatamente.',
        colorPresetsTitle: 'Predefiniti',
        customColorsTitle: 'Colori personalizzati',
        presetPurpleNight: 'Notte viola',
        presetOceanBlue: 'Blu oceano',
        presetSunset: 'Tramonto',
        presetForestGreen: 'Verde foresta',
        presetLightMode: 'Modalità chiara',
    },
};