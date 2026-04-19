// src/locales/home.ts
import { type Language } from '../pages/settings';

export interface HomeTranslations {
    // Welcome Section
    welcomeTitle: string;
    welcomeSubtitle: string;
    enterSystem: string;

    // About Section
    aboutTitle: string;
    aboutDescription: string;
    myProjects: string;
    myJourney: string;

    // Sandbox Section
    sandboxTitle: string;
    sandboxDescription: string;
    discoverMore: string;

    // Accessibility labels
    welcomeAriaLabel: string;
    aboutAriaLabel: string;
    sandboxAriaLabel: string;
}

export const HOME_TRANSLATIONS: Record<Language, HomeTranslations> = {
    en: {
        welcomeTitle: 'WELCOME',
        welcomeSubtitle: 'Explore cognitive science, quizzes, and projects',
        enterSystem: 'Enter the system',
        aboutTitle: 'FROM KNOWLEDGE TO SYSTEMS',
        aboutDescription: 'I design structured digital environments that transform complex knowledge into interactive tools. From cognitive science to UI systems, each project explores how humans think, learn, and interact.',
        myProjects: 'My Projects',
        myJourney: 'My Journey',
        sandboxTitle: 'THE SANDBOX',
        sandboxDescription: 'A controlled environment for experimentation, iteration, and structured exploration.',
        discoverMore: 'Discover more',
        welcomeAriaLabel: 'Welcome',
        aboutAriaLabel: 'About',
        sandboxAriaLabel: 'Sandbox',
    },
    es: {
        welcomeTitle: 'BIENVENIDO',
        welcomeSubtitle: 'Explora ciencia cognitiva, cuestionarios y proyectos',
        enterSystem: 'Entrar al sistema',
        aboutTitle: 'DEL CONOCIMIENTO A LOS SISTEMAS',
        aboutDescription: 'Diseño entornos digitales estructurados que transforman conocimientos complejos en herramientas interactivas. Desde la ciencia cognitiva hasta los sistemas de interfaz, cada proyecto explora cómo las personas piensan, aprenden e interactúan.',
        myProjects: 'Mis proyectos',
        myJourney: 'Mi trayectoria',
        sandboxTitle: 'EL SANDBOX',
        sandboxDescription: 'Un entorno controlado para la experimentación, la iteración y la exploración estructurada.',
        discoverMore: 'Descubrir más',
        welcomeAriaLabel: 'Bienvenido',
        aboutAriaLabel: 'Acerca de',
        sandboxAriaLabel: 'Sandbox',
    },
    fr: {
        welcomeTitle: 'BIENVENUE',
        welcomeSubtitle: 'Explorez les sciences cognitives avec des quiz et des projets',
        enterSystem: 'Entrer dans le système',
        aboutTitle: 'DU SAVOIR AUX SYSTÈMES',
        aboutDescription: 'Je conçois des environnements numériques structurés qui transforment des connaissances complexes en outils interactifs. Des sciences cognitives aux systèmes d’interface, chaque projet explore la manière dont les humains pensent, apprennent et interagissent.',
        myProjects: 'Mes projets',
        myJourney: 'Mon parcours',
        sandboxTitle: 'LE BAC À SABLE',
        sandboxDescription: 'Un environnement contrôlé dédié à l’expérimentation, à l’itération et à l’exploration structurée.',
        discoverMore: 'Découvrir plus',
        welcomeAriaLabel: 'Bienvenue',
        aboutAriaLabel: 'À propos',
        sandboxAriaLabel: 'Bac à sable',
    },
    de: {
        welcomeTitle: 'WILLKOMMEN',
        welcomeSubtitle: 'Entdecken Sie Kognitionswissenschaft, Quizze und Projekte',
        enterSystem: 'System betreten',
        aboutTitle: 'VOM WISSEN ZU SYSTEMEN',
        aboutDescription: 'Ich entwickle strukturierte digitale Umgebungen, die komplexes Wissen in interaktive Werkzeuge verwandeln. Von der Kognitionswissenschaft bis zu UI-Systemen untersucht jedes Projekt, wie Menschen denken, lernen und interagieren.',
        myProjects: 'Meine Projekte',
        myJourney: 'Meine Reise',
        sandboxTitle: 'DIE SANDBOX',
        sandboxDescription: 'Eine kontrollierte Umgebung für Experimente, Iteration und strukturierte Erkundung.',
        discoverMore: 'Mehr entdecken',
        welcomeAriaLabel: 'Willkommen',
        aboutAriaLabel: 'Über',
        sandboxAriaLabel: 'Sandbox',
    },
    it: {
        welcomeTitle: 'BENVENUTO',
        welcomeSubtitle: 'Esplora scienze cognitive, quiz e progetti',
        enterSystem: 'Entra nel sistema',
        aboutTitle: 'DALLA CONOSCENZA AI SISTEMI',
        aboutDescription: 'Progetto ambienti digitali strutturati che trasformano conoscenze complesse in strumenti interattivi. Dalle scienze cognitive ai sistemi UI, ogni progetto esplora come le persone pensano, apprendono e interagiscono.',
        myProjects: 'I miei progetti',
        myJourney: 'Il mio percorso',
        sandboxTitle: 'IL SANDBOX',
        sandboxDescription: 'Un ambiente controllato per sperimentazione, iterazione ed esplorazione strutturata.',
        discoverMore: 'Scopri di più',
        welcomeAriaLabel: 'Benvenuto',
        aboutAriaLabel: 'Informazioni',
        sandboxAriaLabel: 'Sandbox',
    },
};