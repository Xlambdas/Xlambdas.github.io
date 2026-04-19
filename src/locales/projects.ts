// src/locales/projects.ts
import { type Language } from '../pages/settings';

export interface ProjectsTranslations {
    // Page labels
    ariaLabel: string;
    title: string;
    backButton: string;
    viewMore: string;
    backAriaLabel: string;
    carouselAriaLabel: string;
    carouselAriaLive: string;

    // Project data
    projects: {
        [key: number]: {
            title: string;
            subtitle: string;
            description: string;
            statusLabel: string;
        };
    };

    // Status labels
    statusLabels: {
        'soon-release': string;
        'paused': string;
        'started': string;
        'not-started': string;
        'in-progress': string;
        'completed': string;
    };
}

export const PROJECTS_TRANSLATIONS: Record<Language, ProjectsTranslations> = {
    en: {
        ariaLabel: 'Projects page',
        title: 'My Projects',
        backButton: '← Back',
        viewMore: 'View more →',
        backAriaLabel: 'Return to home page',
        carouselAriaLabel: 'Projects carousel: use arrow keys or buttons to navigate',
        carouselAriaLive: 'Carousel region, use left and right arrow keys to navigate',
        projects: {
            1: {
                title: 'Game Of Life',
                subtitle: 'Obsidian Plugin',
                description: 'A modern web extension built with React and Node.js. Plugin for the © Obsidian application.\n\nTrack quests, earn levels, and gamify your experience within Obsidian.\nBuilt for those who seek mastery.',
                statusLabel: 'Coming soon',
            },
            2: {
                title: 'Cognitive Science DB',
                subtitle: 'Knowledge Exploration',
                description: 'Cognitive science database and learning environment.\n\nCognitive science explores thought, learning, and mental organization, drawing from psychology, neuroscience, artificial intelligence, philosophy, linguistics, and anthropology.\nIts goal is to understand how information is processed and represented in the mind and brain.',
                statusLabel: 'Paused',
            },
            3: {
                title: 'Upcoming Unity Project',
                subtitle: 'Unity Game',
                description: 'A complete Unity project. No spoilers — more details coming soon.',
                statusLabel: 'In progress',
            },
            4: {
                title: 'Upcoming Project',
                subtitle: 'TBA',
                description: 'Currently in development. Please stay tuned.',
                statusLabel: 'Not started',
            },
        },
        statusLabels: {
            'soon-release': 'Coming soon',
            'paused': 'Paused',
            'started': 'In progress',
            'not-started': 'Not started',
            'in-progress': 'In progress',
            'completed': 'Completed',
        },
    },
    es: {
        ariaLabel: 'Página de proyectos',
        title: 'Mis proyectos',
        backButton: '← Volver',
        viewMore: 'Ver más →',
        backAriaLabel: 'Volver a la página de inicio',
        carouselAriaLabel: 'Carrusel de proyectos: usa las flechas o botones para navegar',
        carouselAriaLive: 'Región del carrusel, usa las flechas izquierda y derecha para navegar',
        projects: {
            1: {
                title: 'Game Of Life',
                subtitle: 'Plugin de Obsidian',
                description: 'Una extensión web moderna desarrollada con React y Node.js. Plugin para la aplicación © Obsidian.\n\nSigue misiones, gana niveles y gamifica tu experiencia en Obsidian.\nDiseñado para quienes buscan la excelencia.',
                statusLabel: 'Próximamente',
            },
            2: {
                title: 'Base de datos de ciencia cognitiva',
                subtitle: 'Exploración del conocimiento',
                description: 'Base de datos de ciencia cognitiva y entorno de aprendizaje.\n\nLa ciencia cognitiva estudia el pensamiento, el aprendizaje y la organización mental, integrando psicología, neurociencia, inteligencia artificial, filosofía, lingüística y antropología.\nSu objetivo es comprender cómo se procesa y representa la información en la mente y el cerebro.',
                statusLabel: 'Pausado',
            },
            3: {
                title: 'Próximo proyecto Unity',
                subtitle: 'Juego en Unity',
                description: 'Un proyecto completo en Unity. Sin spoilers: más información próximamente.',
                statusLabel: 'En progreso',
            },
            4: {
                title: 'Próximo proyecto',
                subtitle: 'Por definir',
                description: 'Actualmente en desarrollo. Mantente atento.',
                statusLabel: 'No iniciado',
            },
        },
        statusLabels: {
            'soon-release': 'Próximamente',
            'paused': 'Pausado',
            'started': 'En progreso',
            'not-started': 'No iniciado',
            'in-progress': 'En progreso',
            'completed': 'Completado',
        },
    },
    fr: {
        ariaLabel: 'Page des projets',
        title: 'Mes projets',
        backButton: '← Retour',
        viewMore: 'Voir plus →',
        backAriaLabel: 'Retour à la page d’accueil',
        carouselAriaLabel: 'Carrousel de projets : utilisez les flèches ou les boutons pour naviguer',
        carouselAriaLive: 'Région du carrousel, utilisez les flèches gauche et droite pour naviguer',
        projects: {
            1: {
                title: 'Game Of Life',
                subtitle: 'Plugin Obsidian',
                description: 'Une extension web moderne développée avec React et Node.js. Plugin pour l’application © Obsidian.\n\nSuivez des quêtes, gagnez des niveaux et gamifiez votre expérience dans Obsidian.\nConçu pour ceux qui visent la maîtrise.',
                statusLabel: 'Bientôt disponible',
            },
            2: {
                title: 'Base de données en sciences cognitives',
                subtitle: 'Exploration des connaissances',
                description: 'Base de données en sciences cognitives et environnement d’apprentissage.\n\nLes sciences cognitives étudient la pensée, l’apprentissage et l’organisation mentale, en mobilisant la psychologie, les neurosciences, l’intelligence artificielle, la philosophie, la linguistique et l’anthropologie.\nL’objectif est de comprendre comment l’information est traitée et représentée dans le cerveau et l’esprit.',
                statusLabel: 'En pause',
            },
            3: {
                title: 'Prochain projet Unity',
                subtitle: 'Jeu Unity',
                description: 'Un projet complet sur Unity. Pas de spoilers : plus d’informations à venir.',
                statusLabel: 'En cours',
            },
            4: {
                title: 'Prochain projet',
                subtitle: 'À définir',
                description: 'Actuellement en développement. Merci de votre patience.',
                statusLabel: 'Non commencé',
            },
        },
        statusLabels: {
            'soon-release': 'Bientôt disponible',
            'paused': 'En pause',
            'started': 'En cours',
            'not-started': 'Non commencé',
            'in-progress': 'En cours',
            'completed': 'Terminé',
        },
    },
    de: {
        ariaLabel: 'Projektseite',
        title: 'Meine Projekte',
        backButton: '← Zurück',
        viewMore: 'Mehr anzeigen →',
        backAriaLabel: 'Zurück zur Startseite',
        carouselAriaLabel: 'Projektkarussell: mit Pfeiltasten oder Buttons navigieren',
        carouselAriaLive: 'Karussellbereich, mit linker und rechter Pfeiltaste navigieren',
        projects: {
            1: {
                title: 'Game Of Life',
                subtitle: 'Obsidian-Plugin',
                description: 'Eine moderne Web-Erweiterung mit React und Node.js. Plugin für die Anwendung © Obsidian.\n\nVerfolgen Sie Quests, steigen Sie im Level auf und gamifizieren Sie Ihre Nutzung von Obsidian.\nEntwickelt für alle, die nach Exzellenz streben.',
                statusLabel: 'Demnächst verfügbar',
            },
            2: {
                title: 'Datenbank der Kognitionswissenschaft',
                subtitle: 'Wissenserschließung',
                description: 'Datenbank der Kognitionswissenschaft und Lernumgebung.\n\nDie Kognitionswissenschaft untersucht Denken, Lernen und mentale Organisation und verbindet Psychologie, Neurowissenschaften, künstliche Intelligenz, Philosophie, Linguistik und Anthropologie.\nZiel ist es zu verstehen, wie Informationen im Gehirn verarbeitet und repräsentiert werden.',
                statusLabel: 'Pausiert',
            },
            3: {
                title: 'Kommendes Unity-Projekt',
                subtitle: 'Unity-Spiel',
                description: 'Ein vollständiges Unity-Projekt. Keine Spoiler – weitere Details folgen bald.',
                statusLabel: 'In Entwicklung',
            },
            4: {
                title: 'Kommendes Projekt',
                subtitle: 'Noch offen',
                description: 'Aktuell in Entwicklung. Bitte haben Sie noch etwas Geduld.',
                statusLabel: 'Nicht gestartet',
            },
        },
        statusLabels: {
            'soon-release': 'Demnächst verfügbar',
            'paused': 'Pausiert',
            'started': 'In Entwicklung',
            'not-started': 'Nicht gestartet',
            'in-progress': 'In Entwicklung',
            'completed': 'Abgeschlossen',
        },
    },
    it: {
        ariaLabel: 'Pagina dei progetti',
        title: 'I miei progetti',
        backButton: '← Indietro',
        viewMore: 'Scopri di più →',
        backAriaLabel: 'Torna alla home page',
        carouselAriaLabel: 'Carosello progetti: usa le frecce o i pulsanti per navigare',
        carouselAriaLive: 'Area carosello, usa le frecce sinistra e destra per navigare',
        projects: {
            1: {
                title: 'Game Of Life',
                subtitle: 'Plugin Obsidian',
                description: 'Una moderna estensione web sviluppata con React e Node.js. Plugin per l’applicazione © Obsidian.\n\nTieni traccia delle missioni, sali di livello e gamifica la tua esperienza in Obsidian.\nPensato per chi punta alla padronanza.',
                statusLabel: 'In arrivo',
            },
            2: {
                title: 'Database di scienze cognitive',
                subtitle: 'Esplorazione della conoscenza',
                description: 'Database di scienze cognitive e ambiente di apprendimento.\n\nLe scienze cognitive studiano il pensiero, l’apprendimento e l’organizzazione mentale, integrando psicologia, neuroscienze, intelligenza artificiale, filosofia, linguistica e antropologia.\nL’obiettivo è comprendere come le informazioni vengono elaborate e rappresentate nella mente e nel cervello.',
                statusLabel: 'In pausa',
            },
            3: {
                title: 'Prossimo progetto Unity',
                subtitle: 'Gioco Unity',
                description: 'Un progetto completo in Unity. Nessuno spoiler: maggiori dettagli in arrivo.',
                statusLabel: 'In corso',
            },
            4: {
                title: 'Prossimo progetto',
                subtitle: 'Da definire',
                description: 'Attualmente in sviluppo. Resta sintonizzato.',
                statusLabel: 'Non iniziato',
            },
        },
        statusLabels: {
            'soon-release': 'In arrivo',
            'paused': 'In pausa',
            'started': 'In corso',
            'not-started': 'Non iniziato',
            'in-progress': 'In corso',
            'completed': 'Completato',
        },
    },
};