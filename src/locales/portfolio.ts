import type { Language } from '../pages/settings';

export type EntryType = 'studies' | 'work' | 'personal' | 'project' | 'event' | 'education' | 'other';

export interface PortfolioTranslations {
    // Navigation
    navigation: {
        back: string;
        github: string;
    };

    // Page labels
    ariaLabel: string;

    // Sidebar Navigation
    sidebar: {
        labelCollapse: string;
        labelExpand: string;
        files: {
            [key: string]: {
                name: string;
                comment: string;
            };
        };
        folders: {
            [key: string]: {
                name: string;
                comment: string;
            };
        };
        footer: {
            copyright: string;
            githubLabel: string;
        };
    };

    // Hero Section
    hero: {
        title: string;
        subtitle: string;
        ariaLabel: string;
    };

    // About Section
    about: {
        title: string;
        description: string;
        ariaLabel: string;
    };

    // Skills Section
    skills: {
        title: string;
        description: string;
        ariaLabel: string;
        finalNote: string;
        categories: {
            gamedev: {
                title: string;
                description: string;
                subcategories: {
                    design: {
                        name: string;
                        skills: string[];
                    };
                    development: {
                        name: string;
                        skills: string[];
                    };
                    relatedSkills: {
                        name: string;
                        skills: string[];
                    };
                };
            };
            uiux: {
                title: string;
                description: string;
                subcategories: {
                    tools: {
                        name: string;
                        skills: string[];
                    };
                    principles: {
                        name: string;
                        skills: string[];
                    };
                    advanced: {
                        name: string;
                        skills: string[];
                    };
                };
            };
            webdev: {
                title: string;
                description: string;
                subcategories: {
                    frontend: {
                        name: string;
                        skills: string[];
                    };
                    tools: {
                        name: string;
                        skills: string[];
                    };
                    backend: {
                        name: string;
                        skills: string[];
                    };
                };
            };
            dataAlgorithms: {
                title: string;
                description: string;
                subcategories: {
                    algorithms: {
                        name: string;
                        skills: string[];
                    };
                    datascience: {
                        name: string;
                        skills: string[];
                    };
                    mathematics: {
                        name: string;
                        skills: string[];
                    };
                };
            };
            cognitivescience: {
                title: string;
                description: string;
                subcategories: {
                    cognitive: {
                        name: string;
                        skills: string[];
                    };
                    hci: {
                        name: string;
                        skills: string[];
                    };
                    learning: {
                        name: string;
                        skills: string[];
                    };
                };
            };
        };
    };

    // Timeline Section
    timeline?: {
        title: string;
        description: string;
        ariaLabel: string;
        entries?: {
            [key: number]: {
                startDate?: string;
                endDate: string;
                type: EntryType;
                title: string;
                description: string;
            };
        };
    };

    // Interests Section
    interests?: {
        title: string;
        description: string;
        ariaLabel: string;
        note?: string;
        entries?: {
            [key: number]: {
                name: string;
                description: string;
            };
        };
    };

    // Values Section
    values?: {
        title: string;
        description?: string;
        ariaLabel: string;
        entries: {
            [key: number]: {
                title: string;
                quote: string;        // short motto / italic pull-quote
                description: string;  // revealed on click
            };
        };
    };

    // Contact Section
    contact?: {
        title: string;
        description: string;
        ariaLabel: string;
        getInTouch: string;
        links: {
            [key: string]: {
                label: string;
                href: string;
            };
        };
    };
}

export const PORTFOLIO_TRANSLATIONS: Record<Language, PortfolioTranslations> = {
    en: {
        navigation: {
            back: '← Back',
            github: 'github',
        },

        // Page labels
        ariaLabel: 'Portfolio page',

        // Sidebar Navigation
        sidebar: {
            labelCollapse: 'Collapse sidebar',
            labelExpand: 'Expand sidebar',
            files: {
                about: {
                    name: 'AboutMe',
                    comment: '# About section',
                },
                skills: {
                    name: 'Skills',
                    comment: '# Skills & expertise',
                },
                timeline: {
                    name: 'Timeline',
                    comment: '# My Timeline',
                },
                interests: {
                    name: 'Interests',
                    comment: '# My Interests',
                },
                values: {
                    name: 'Values',
                    comment: '# Personal values',
                },
                contact: {
                    name: 'Contact',
                    comment: '# Contact section',
                },
            },
            folders: {
                portfolio: {
                    name: 'portfolio',
                    comment: '',
                },
                aboutme: {
                    name: 'details',
                    comment: '# About me subfolder',
                },
            },
            footer: {
                copyright: '©',
                githubLabel: 'github',
            },
        },

        // Hero Section
        hero: {
            title: 'Designer & Developer',
            subtitle: 'Crafting intuitive experiences at the intersection of design, code, and cognitive science',
            ariaLabel: 'Portfolio introduction',
        },

        // About Section
        about: {
            title: 'About me',
            description: 'I\'m a designer and developer passionate about creating human-centered digital experiences. With a background in cognitive science and expertise spanning game development, UI/UX design, and web technologies, I approach every project with clarity and intentionality.',
            ariaLabel: 'About me section',
        },

        // Skills Section
        skills: {
            title: 'Skills',
            description: 'A comprehensive overview of my expertise across game development, design, web technologies, and cognitive science.',
            ariaLabel: 'Skills section',
            finalNote: 'I continuously explore emerging technologies and methodologies. Always learning, always building.',
            categories: {
                gamedev: {
                    title: 'Game Development & Design',
                    description: 'Interactive systems and game mechanics',
                    subcategories: {
                        design: {
                            name: 'Game Design',
                            skills: ['Game Mechanics', 'Level Design', 'Player Psychology', 'System Design'],
                        },
                        development: {
                            name: 'Game Development',
                            skills: ['Unity', 'C#', 'Physics Systems', 'UI/UX for Games'],
                        },
                        relatedSkills: {
                            name: 'Related Skills',
                            skills: ['Prototyping', 'Playtesting', 'Game Narrative', '3D Modeling basics'],
                        },
                    },
                },
                uiux: {
                    title: 'UI/UX Design',
                    description: 'Digital product design and user experience',
                    subcategories: {
                        tools: {
                            name: 'Design Tools & Methods',
                            skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems'],
                        },
                        principles: {
                            name: 'Design Principles',
                            skills: ['User Research', 'Usability Testing', 'Information Architecture', 'Responsive Design'],
                        },
                        advanced: {
                            name: 'Advanced Design',
                            skills: ['Adaptive Design', 'Interaction Design', 'Accessibility (A11y)', 'User Testing'],
                        },
                    },
                },
                webdev: {
                    title: 'Web Development',
                    description: 'Frontend and full-stack web technologies',
                    subcategories: {
                        frontend: {
                            name: 'Frontend',
                            skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
                        },
                        tools: {
                            name: 'Frontend Tools & Build',
                            skills: ['Vite', 'Node.js', 'npm/yarn', 'Git & GitHub', 'Terminal/CLI'],
                        },
                        backend: {
                            name: 'Backend & APIs',
                            skills: ['Node.js', 'PHP', 'REST APIs', 'Database Design'],
                        },
                    },
                },
                dataAlgorithms: {
                    title: 'Data & Algorithms',
                    description: 'Computational thinking and data science',
                    subcategories: {
                        algorithms: {
                            name: 'Algorithms & Problem Solving',
                            skills: ['Algorithm Design', 'Data Structures', 'Computational Thinking', 'Code Optimization'],
                        },
                        datascience: {
                            name: 'Data Science',
                            skills: ['Python', 'Data Analysis', 'Statistical Thinking', 'Data Visualization'],
                        },
                        mathematics: {
                            name: 'Mathematical Thinking',
                            skills: ['Linear Algebra', 'Discrete Math', 'Probability', 'Pattern Recognition'],
                        },
                    },
                },
                cognitivescience: {
                    title: 'Cognitive Science & Human-Centered Design',
                    description: 'Understanding human behavior and interaction',
                    subcategories: {
                        cognitive: {
                            name: 'Cognitive Science',
                            skills: ['Cognitive Psychology', 'Learning Systems', 'Memory & Attention', 'Decision Making'],
                        },
                        hci: {
                            name: 'Human-Computer Interaction',
                            skills: ['User Interaction Design', 'Usability Research', 'Accessibility', 'User Behavior Analysis'],
                        },
                        learning: {
                            name: 'Learning & Behavior',
                            skills: ['Learning Design', 'Gamification', 'User Engagement', 'Behavioral Psychology'],
                        },
                    },
                },
            },
        },

        timeline: {
            title: "Timeline",
            description: "A path through design, code, and research.",
            ariaLabel: "Timeline section",
            entries: {
                0: { startDate: "2026-02-02", endDate: "2026-06-30", title: "Game dev internship", type: "education", description: "Developed a game concept and prototype using Unity and C#." },
                1: { startDate: "2021-09", endDate: "2026-01", title: "Bachelor MIASHS", type: "education", description: "At the University of Bordeaux, focusing on cognitive science and human-computer interaction." },
                2: { endDate: "2021-06", title: "French baccalauréat", type: "education", description: "Completed high school education with a focus on science and mathematics." },
                3: { startDate: "2026-02", endDate: "2026-03", title: "Portfolio Launch", type: "work", description: "Launching this portfolio to showcase my work and journey." },
                4: { startDate: "2025-05", endDate: "2026-01", title: "Plugin GOL", type: "project", description: "Developed a plugin for the note taking application (Obsidian)." },
                5: { startDate: "2026-03", endDate: "2026-05", title: "Small Tools", type: "project", description: "Built a series of exploratory projects to deepen my skills across different domains of software development, including CLI tools (px-cli), an email automation manager, and a hand gesture interaction system. Upcoming experiments include a voice-based assistant (Jarvi-like), a smart meal suggestion tool based on budget and seasonal/local food availability, and an improved hand gesture control system." },
            }
        },

        // Interests Section (placeholder for future implementation)
        interests: {
            title: 'Interests',
            description: 'Areas I explore and continue learning about',
            ariaLabel: 'Interests section',
            note: 'These interests deeply influence my design and development approaches. I believe that understanding human behavior, learning, and interaction is fundamental to creating meaningful digital experiences.',
            entries: {
                0: {
                    name: 'Cognitive Science',
                    description: 'Understanding how humans learn, perceive, and interact with systems',
                },
                1: {
                    name: 'Human-Computer Interaction',
                    description: 'Designing interfaces that feel natural and intuitive for users',
                },
                2: {
                    name: 'Game Design',
                    description: 'Exploring interactive systems, player psychology, and emerging game mechanics',
                },
                3: {
                    name: 'Learning Systems',
                    description: 'Creating engaging educational experiences and knowledge transfer',
                },
                4: {
                    name: 'AI & Machine Learning',
                    description: 'Exploring how AI can enhance user experience and design processes',
                },
                5: {
                    name: 'Design Systems',
                    description: 'Building scalable, maintainable design frameworks for large-scale products',
                },
            },
        },

        // Values Section
        values: {
            title: 'Values',
            description: 'Principles that guide my work',
            ariaLabel: 'Values section',
            entries: {
                0: {
                    title: "Clarity",
                    quote: "If you can't explain it simply, you don't understand it well enough.",
                    description: "I believe good design and good thinking share the same root — precision. Complexity is easy; clarity takes work.",
                },
                1: {
                    title: "Depth",
                    quote: "Surface is where amateurs stop. Depth is where craft begins.",
                    description: "I push past the obvious solution. Every layer of understanding — technical, cognitive, human — makes the work more honest and more durable.",
                },
                2: {
                    title: "Intention",
                    quote: "Every decision is a statement. Make them deliberately.",
                    description: "I don't add features, colors, or interactions without reason. Design is the sum of its decisions — and each one either serves the person using it or it doesn't.",
                },
            },
        },

        // Contact Section (placeholder for future implementation)
        contact: {
            title: 'Get in Touch',
            description: 'Let\'s connect and explore opportunities together.',
            ariaLabel: 'Contact section',
            getInTouch: 'Contact Me',
            links: {
                email: {
                    label: 'Email',
                    href: 'mailto:cogassien@hotmail.com',
                },
                linkedin: {
                    label: 'LinkedIn',
                    href: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261',
                },
                github: {
                    label: 'GitHub',
                    href: 'https://github.com/Xlambdas',
                },
            },
        },
    },
    es: {
        navigation: {
            back: '← Volver',
            github: 'github',
        },

        ariaLabel: 'Página de portafolio',

        sidebar: {
            labelCollapse: 'Contraer barra lateral',
            labelExpand: 'Expandir barra lateral',
            files: {
                about: {
                    name: 'SobreMí',
                    comment: '# Sección sobre mí',
                },
                skills: {
                    name: 'Habilidades',
                    comment: '# Habilidades y experiencia',
                },
                timeline: {
                    name: 'Cronología',
                    comment: '# Mi cronología',
                },
                interests: {
                    name: 'Intereses',
                    comment: '# Mis intereses',
                },
                values: {
                    name: 'Valores',
                    comment: '# Valores personales',
                },
                contact: {
                    name: 'Contacto',
                    comment: '# Sección de contacto',
                },
            },
            folders: {
                portfolio: {
                    name: 'portafolio',
                    comment: '',
                },
                aboutme: {
                    name: 'detalles',
                    comment: '# Subcarpeta sobre mí',
                },
            },
            footer: {
                copyright: '©',
                githubLabel: 'github',
            },
        },

        hero: {
            title: 'Diseñador & Desarrollador',
            subtitle: 'Creando experiencias intuitivas en la intersección del diseño, el código y las ciencias cognitivas',
            ariaLabel: 'Introducción del portafolio',
        },

        about: {
            title: 'Sobre mí',
            description: 'Soy diseñador y desarrollador apasionado por crear experiencias digitales centradas en el ser humano. Con una base en ciencias cognitivas y experiencia en desarrollo de videojuegos, diseño UI/UX y tecnologías web, abordo cada proyecto con claridad e intención.',
            ariaLabel: 'Sección sobre mí',
        },

        skills: {
            title: 'Habilidades',
            description: 'Una visión completa de mi experiencia en desarrollo de videojuegos, diseño, tecnologías web y ciencias cognitivas.',
            ariaLabel: 'Sección de habilidades',
            finalNote: 'Exploro continuamente nuevas tecnologías y metodologías. Siempre aprendiendo, siempre construyendo.',
            categories: {
                gamedev: {
                    title: 'Desarrollo y Diseño de Videojuegos',
                    description: 'Sistemas interactivos y mecánicas de juego',
                    subcategories: {
                        design: {
                            name: 'Diseño de Juegos',
                            skills: ['Mecánicas de Juego', 'Diseño de Niveles', 'Psicología del Jugador', 'Diseño de Sistemas'],
                        },
                        development: {
                            name: 'Desarrollo de Juegos',
                            skills: ['Unity', 'C#', 'Sistemas de Física', 'UI/UX para Juegos'],
                        },
                        relatedSkills: {
                            name: 'Habilidades Relacionadas',
                            skills: ['Prototipado', 'Pruebas de Juego', 'Narrativa de Juego', 'Modelado 3D básico'],
                        },
                    },
                },
                uiux: {
                    title: 'Diseño UI/UX',
                    description: 'Diseño de productos digitales y experiencia de usuario',
                    subcategories: {
                        tools: {
                            name: 'Herramientas y Métodos de Diseño',
                            skills: ['Figma', 'Wireframing', 'Prototipado', 'Sistemas de Diseño'],
                        },
                        principles: {
                            name: 'Principios de Diseño',
                            skills: ['Investigación de Usuarios', 'Pruebas de Usabilidad', 'Arquitectura de la Información', 'Diseño Responsivo'],
                        },
                        advanced: {
                            name: 'Diseño Avanzado',
                            skills: ['Diseño Adaptativo', 'Diseño de Interacción', 'Accesibilidad (A11y)', 'Pruebas con Usuarios'],
                        },
                    },
                },
                webdev: {
                    title: 'Desarrollo Web',
                    description: 'Tecnologías web frontend y full-stack',
                    subcategories: {
                        frontend: {
                            name: 'Frontend',
                            skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
                        },
                        tools: {
                            name: 'Herramientas Frontend y Build',
                            skills: ['Vite', 'Node.js', 'npm/yarn', 'Git & GitHub', 'Terminal/CLI'],
                        },
                        backend: {
                            name: 'Backend y APIs',
                            skills: ['Node.js', 'PHP', 'REST APIs', 'Diseño de Bases de Datos'],
                        },
                    },
                },
                dataAlgorithms: {
                    title: 'Datos y Algoritmos',
                    description: 'Pensamiento computacional y ciencia de datos',
                    subcategories: {
                        algorithms: {
                            name: 'Algoritmos y Resolución de Problemas',
                            skills: ['Diseño de Algoritmos', 'Estructuras de Datos', 'Pensamiento Computacional', 'Optimización de Código'],
                        },
                        datascience: {
                            name: 'Ciencia de Datos',
                            skills: ['Python', 'Análisis de Datos', 'Pensamiento Estadístico', 'Visualización de Datos'],
                        },
                        mathematics: {
                            name: 'Pensamiento Matemático',
                            skills: ['Álgebra Lineal', 'Matemática Discreta', 'Probabilidad', 'Reconocimiento de Patrones'],
                        },
                    },
                },
                cognitivescience: {
                    title: 'Ciencias Cognitivas y Diseño Centrado en el Humano',
                    description: 'Comprensión del comportamiento humano e interacción',
                    subcategories: {
                        cognitive: {
                            name: 'Ciencias Cognitivas',
                            skills: ['Psicología Cognitiva', 'Sistemas de Aprendizaje', 'Memoria y Atención', 'Toma de Decisiones'],
                        },
                        hci: {
                            name: 'Interacción Humano-Computadora',
                            skills: ['Diseño de Interacción', 'Investigación de Usabilidad', 'Accesibilidad', 'Análisis del Comportamiento del Usuario'],
                        },
                        learning: {
                            name: 'Aprendizaje y Comportamiento',
                            skills: ['Diseño del Aprendizaje', 'Gamificación', 'Participación del Usuario', 'Psicología del Comportamiento'],
                        },
                    },
                },
            },
        },

        timeline: {
            title: 'Cronología',
            description: 'Un recorrido por el diseño, el código y la investigación.',
            ariaLabel: 'Sección de cronología',
            entries: {
                0: { startDate: '2026-02-02', endDate: '2026-06-30', title: 'Prácticas en desarrollo de videojuegos', type: 'education', description: 'Desarrollé un concepto y prototipo de juego usando Unity y C#.' },
                1: { startDate: '2021-09', endDate: '2026-01', title: 'Grado MIASHS', type: 'education', description: 'En la Universidad de Burdeos, con especialización en ciencias cognitivas e interacción humano-computadora.' },
                2: { endDate: '2021-06', title: 'Bachillerato francés', type: 'education', description: 'Educación secundaria completada con orientación en ciencias y matemáticas.' },
                3: { startDate: '2026-02', endDate: '2026-03', title: 'Lanzamiento del portafolio', type: 'work', description: 'Lanzamiento de este portafolio para mostrar mi trabajo y trayectoria.' },
                4: { startDate: '2025-05', endDate: '2026-01', title: 'Plugin GOL', type: 'project', description: 'Desarrollo de un plugin para la aplicación de toma de notas (Obsidian).' },
            },
        },

        interests: {
            title: 'Intereses',
            description: 'Áreas que exploro y sigo aprendiendo',
            ariaLabel: 'Sección de intereses',
            note: 'Estos intereses influyen profundamente en mi enfoque del diseño y el desarrollo. Creo que entender el comportamiento humano, el aprendizaje y la interacción es fundamental para crear experiencias digitales con sentido.',
            entries: {
                0: {
                    name: 'Ciencias Cognitivas',
                    description: 'Comprender cómo los humanos aprenden, perciben e interactúan con los sistemas',
                },
                1: {
                    name: 'Interacción Humano-Computadora',
                    description: 'Diseñar interfaces que resulten naturales e intuitivas para los usuarios',
                },
                2: {
                    name: 'Diseño de Videojuegos',
                    description: 'Explorar sistemas interactivos, psicología del jugador y mecánicas emergentes',
                },
                3: {
                    name: 'Sistemas de Aprendizaje',
                    description: 'Crear experiencias educativas atractivas y transferencia de conocimiento',
                },
                4: {
                    name: 'IA y Aprendizaje Automático',
                    description: 'Explorar cómo la IA puede mejorar la experiencia de usuario y los procesos de diseño',
                },
                5: {
                    name: 'Sistemas de Diseño',
                    description: 'Construir marcos de diseño escalables y mantenibles para productos a gran escala',
                },
            },
        },

        values: {
            title: 'Valores',
            description: 'Principios que guían mi trabajo',
            ariaLabel: 'Sección de valores',
            entries: {
                0: {
                    title: 'Claridad',
                    quote: 'Si no puedes explicarlo de forma sencilla, es que no lo entiendes suficientemente bien.',
                    description: 'Creo que el buen diseño y el buen pensamiento comparten la misma raíz: la precisión. La complejidad es fácil; la claridad requiere esfuerzo.',
                },
                1: {
                    title: 'Profundidad',
                    quote: 'La superficie es donde se detienen los aficionados. La profundidad es donde empieza el oficio.',
                    description: 'Voy más allá de la solución obvia. Cada capa de comprensión — técnica, cognitiva, humana — hace el trabajo más honesto y más duradero.',
                },
                2: {
                    title: 'Intención',
                    quote: 'Cada decisión es una declaración. Tómalas de forma deliberada.',
                    description: 'No añado funcionalidades, colores ni interacciones sin razón. El diseño es la suma de sus decisiones — y cada una sirve a la persona que lo usa, o no.',
                },
            },
        },

        contact: {
            title: 'Contacto',
            description: 'Conectemos y exploremos oportunidades juntos.',
            ariaLabel: 'Sección de contacto',
            getInTouch: 'Contáctame',
            links: {
                email: {
                    label: 'Correo electrónico',
                    href: 'mailto:cogassien@hotmail.com',
                },
                linkedin: {
                    label: 'LinkedIn',
                    href: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261',
                },
                github: {
                    label: 'GitHub',
                    href: 'https://github.com/Xlambdas',
                },
            },
        },
    },

    fr: {
        navigation: {
            back: '← Retour',
            github: 'github',
        },

        ariaLabel: 'Page de portfolio',

        sidebar: {
            labelCollapse: 'Réduire la barre latérale',
            labelExpand: 'Développer la barre latérale',
            files: {
                about: {
                    name: 'ÀProposDeMoi',
                    comment: '# Section à propos',
                },
                skills: {
                    name: 'Compétences',
                    comment: '# Compétences et expertise',
                },
                timeline: {
                    name: 'Chronologie',
                    comment: '# Ma chronologie',
                },
                interests: {
                    name: 'Intérêts',
                    comment: '# Mes intérêts',
                },
                values: {
                    name: 'Valeurs',
                    comment: '# Valeurs personnelles',
                },
                contact: {
                    name: 'Contact',
                    comment: '# Section contact',
                },
            },
            folders: {
                portfolio: {
                    name: 'portfolio',
                    comment: '',
                },
                aboutme: {
                    name: 'détails',
                    comment: '# Sous-dossier à propos',
                },
            },
            footer: {
                copyright: '©',
                githubLabel: 'github',
            },
        },

        hero: {
            title: 'Designer & Développeur',
            subtitle: 'Créer des expériences intuitives à l\'intersection du design, du code et des sciences cognitives',
            ariaLabel: 'Introduction du portfolio',
        },

        about: {
            title: 'À propos de moi',
            description: 'Je suis designer et développeur passionné par la création d\'expériences numériques centrées sur l\'humain. Avec une formation en sciences cognitives et une expertise couvrant le développement de jeux, le design UI/UX et les technologies web, j\'aborde chaque projet avec clarté et intention.',
            ariaLabel: 'Section à propos de moi',
        },

        skills: {
            title: 'Compétences',
            description: 'Une vue d\'ensemble de mon expertise en développement de jeux, design, technologies web et sciences cognitives.',
            ariaLabel: 'Section compétences',
            finalNote: 'J\'explore continuellement de nouvelles technologies et méthodologies. Toujours en apprentissage, toujours en construction.',
            categories: {
                gamedev: {
                    title: 'Développement et Design de Jeux',
                    description: 'Systèmes interactifs et méchaniques de jeu',
                    subcategories: {
                        design: {
                            name: 'Game Design',
                            skills: ['Mécaniques de Jeu', 'Level Design', 'Psychologie du Joueur', 'Design de Systèmes'],
                        },
                        development: {
                            name: 'Développement de Jeux',
                            skills: ['Unity', 'C#', 'Systèmes Physiques', 'UI/UX pour Jeux'],
                        },
                        relatedSkills: {
                            name: 'Compétences Associées',
                            skills: ['Prototypage', 'Playtesting', 'Narration de Jeu', 'Modélisation 3D basique'],
                        },
                    },
                },
                uiux: {
                    title: 'Design UI/UX',
                    description: 'Design de produits numériques et expérience utilisateur',
                    subcategories: {
                        tools: {
                            name: 'Outils et Méthodes de Design',
                            skills: ['Figma', 'Wireframing', 'Prototypage', 'Systèmes de Design'],
                        },
                        principles: {
                            name: 'Principes de Design',
                            skills: ['Recherche Utilisateur', 'Tests d\'Utilisabilité', 'Architecture de l\'Information', 'Design Responsif'],
                        },
                        advanced: {
                            name: 'Design Avancé',
                            skills: ['Design Adaptatif', 'Design d\'Interaction', 'Accessibilité (A11y)', 'Tests Utilisateurs'],
                        },
                    },
                },
                webdev: {
                    title: 'Développement Web',
                    description: 'Technologies web frontend et full-stack',
                    subcategories: {
                        frontend: {
                            name: 'Frontend',
                            skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
                        },
                        tools: {
                            name: 'Outils Frontend et Build',
                            skills: ['Vite', 'Node.js', 'npm/yarn', 'Git & GitHub', 'Terminal/CLI'],
                        },
                        backend: {
                            name: 'Backend et APIs',
                            skills: ['Node.js', 'PHP', 'REST APIs', 'Conception de Bases de Données'],
                        },
                    },
                },
                dataAlgorithms: {
                    title: 'Données et Algorithmes',
                    description: 'Pensée computationnelle et science des données',
                    subcategories: {
                        algorithms: {
                            name: 'Algorithmes et Résolution de Problèmes',
                            skills: ['Conception d\'Algorithmes', 'Structures de Données', 'Pensée Computationnelle', 'Optimisation de Code'],
                        },
                        datascience: {
                            name: 'Science des Données',
                            skills: ['Python', 'Analyse de Données', 'Pensée Statistique', 'Visualisation de Données'],
                        },
                        mathematics: {
                            name: 'Pensée Mathématique',
                            skills: ['Algèbre Linéaire', 'Mathématiques Discrètes', 'Probabilités', 'Reconnaissance de Motifs'],
                        },
                    },
                },
                cognitivescience: {
                    title: 'Sciences Cognitives et Design Centré sur l\'Humain',
                    description: 'Compréhension du comportement humain et de l\'interaction',
                    subcategories: {
                        cognitive: {
                            name: 'Sciences Cognitives',
                            skills: ['Psychologie Cognitive', 'Systèmes d\'Apprentissage', 'Mémoire et Attention', 'Prise de Décision'],
                        },
                        hci: {
                            name: 'Interaction Humain-Machine',
                            skills: ['Design d\'Interaction', 'Recherche en Utilisabilité', 'Accessibilité', 'Analyse du Comportement Utilisateur'],
                        },
                        learning: {
                            name: 'Apprentissage et Comportement',
                            skills: ['Ingénierie Pédagogique', 'Gamification', 'Engagement Utilisateur', 'Psychologie Comportementale'],
                        },
                    },
                },
            },
        },

        timeline: {
            title: 'Chronologie',
            description: 'Un parcours à travers le design, le code et la recherche.',
            ariaLabel: 'Section chronologie',
            entries: {
                0: { startDate: '2026-02-02', endDate: '2026-06-30', title: 'Stage en développement de jeux', type: 'education', description: 'Développement d\'un concept et d\'un prototype de jeu avec Unity et C#.' },
                1: { startDate: '2021-09', endDate: '2026-01', title: 'Licence MIASHS', type: 'education', description: 'À l\'Université de Bordeaux, spécialisation en sciences cognitives et interaction humain-machine.' },
                2: { endDate: '2021-06', title: 'Baccalauréat français', type: 'education', description: 'Diplôme de fin d\'études secondaires avec spécialisation en sciences et mathématiques.' },
                3: { startDate: '2026-02', endDate: '2026-03', title: 'Lancement du portfolio', type: 'work', description: 'Mise en ligne de ce portfolio pour présenter mon travail et mon parcours.' },
                4: { startDate: '2025-05', endDate: '2026-01', title: 'Plugin GOL', type: 'project', description: 'Développement d\'un plugin pour l\'application de prise de notes Obsidian.' },
            },
        },

        interests: {
            title: 'Intérêts',
            description: 'Des domaines que j\'explore et que je continue d\'apprendre',
            ariaLabel: 'Section intérêts',
            note: 'Ces intérêts influencent profondément mes approches du design et du développement. Je crois que comprendre le comportement humain, l\'apprentissage et l\'interaction est fondamental pour créer des expériences numériques porteuses de sens.',
            entries: {
                0: {
                    name: 'Sciences Cognitives',
                    description: 'Comprendre comment les humains apprennent, perçoivent et interagissent avec les systèmes',
                },
                1: {
                    name: 'Interaction Humain-Machine',
                    description: 'Concevoir des interfaces qui semblent naturelles et intuitives pour les utilisateurs',
                },
                2: {
                    name: 'Game Design',
                    description: 'Explorer les systèmes interactifs, la psychologie du joueur et les mécaniques émergentes',
                },
                3: {
                    name: 'Systèmes d\'Apprentissage',
                    description: 'Créer des expériences éducatives engageantes et favoriser le transfert de connaissances',
                },
                4: {
                    name: 'IA et Apprentissage Automatique',
                    description: 'Explorer comment l\'IA peut améliorer l\'expérience utilisateur et les processus de design',
                },
                5: {
                    name: 'Systèmes de Design',
                    description: 'Construire des référentiels de design évolutifs et maintenables pour des produits à grande échelle',
                },
            },
        },

        values: {
            title: 'Valeurs',
            description: 'Les principes qui guident mon travail',
            ariaLabel: 'Section valeurs',
            entries: {
                0: {
                    title: 'Clarté',
                    quote: 'Si tu ne peux pas l\'expliquer simplement, c\'est que tu ne le comprends pas assez bien.',
                    description: 'Je crois que le bon design et la bonne pensée partagent la même racine — la précision. La complexité est facile ; la clarté demande du travail.',
                },
                1: {
                    title: 'Profondeur',
                    quote: 'La surface, c\'est là que s\'arrêtent les amateurs. La profondeur, c\'est là que commence le métier.',
                    description: 'Je vais au-delà de la solution évidente. Chaque couche de compréhension — technique, cognitive, humaine — rend le travail plus honnête et plus durable.',
                },
                2: {
                    title: 'Intention',
                    quote: 'Chaque décision est une affirmation. Prenez-les délibérément.',
                    description: 'Je n\'ajoute pas de fonctionnalités, de couleurs ou d\'interactions sans raison. Le design est la somme de ses décisions — et chacune sert la personne qui l\'utilise, ou pas.',
                },
            },
        },

        contact: {
            title: 'Me Contacter',
            description: 'Connectons-nous et explorons des opportunités ensemble.',
            ariaLabel: 'Section contact',
            getInTouch: 'Prendre contact',
            links: {
                email: {
                    label: 'E-mail',
                    href: 'mailto:cogassien@hotmail.com',
                },
                linkedin: {
                    label: 'LinkedIn',
                    href: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261',
                },
                github: {
                    label: 'GitHub',
                    href: 'https://github.com/Xlambdas',
                },
            },
        },
    },


    de: {
        navigation: {
            back: '← Zurück',
            github: 'github',
        },

        ariaLabel: 'Portfolio-Seite',

        sidebar: {
            labelCollapse: 'Seitenleiste einklappen',
            labelExpand: 'Seitenleiste ausklappen',
            files: {
                about: {
                    name: 'ÜberMich',
                    comment: '# Über-mich-Bereich',
                },
                skills: {
                    name: 'Fähigkeiten',
                    comment: '# Fähigkeiten und Expertise',
                },
                timeline: {
                    name: 'Zeitstrahl',
                    comment: '# Mein Zeitstrahl',
                },
                interests: {
                    name: 'Interessen',
                    comment: '# Meine Interessen',
                },
                values: {
                    name: 'Werte',
                    comment: '# Persönliche Werte',
                },
                contact: {
                    name: 'Kontakt',
                    comment: '# Kontaktbereich',
                },
            },
            folders: {
                portfolio: {
                    name: 'portfolio',
                    comment: '',
                },
                aboutme: {
                    name: 'details',
                    comment: '# Über-mich-Unterordner',
                },
            },
            footer: {
                copyright: '©',
                githubLabel: 'github',
            },
        },

        hero: {
            title: 'Designer & Entwickler',
            subtitle: 'Intuitive Erlebnisse an der Schnittstelle von Design, Code und Kognitionswissenschaft',
            ariaLabel: 'Portfolio-Einleitung',
        },

        about: {
            title: 'Über mich',
            description: 'Ich bin Designer und Entwickler mit einer Leidenschaft für die Gestaltung menschenzentrierter digitaler Erlebnisse. Mit einem Hintergrund in der Kognitionswissenschaft und Expertise in Spieleentwicklung, UI/UX-Design und Webtechnologien gehe ich jedes Projekt mit Klarheit und Absicht an.',
            ariaLabel: 'Über-mich-Bereich',
        },

        skills: {
            title: 'Fähigkeiten',
            description: 'Ein umfassender Überblick über meine Expertise in Spieleentwicklung, Design, Webtechnologien und Kognitionswissenschaft.',
            ariaLabel: 'Fähigkeitenbereich',
            finalNote: 'Ich erkunde kontinuierlich neue Technologien und Methoden. Immer am Lernen, immer am Bauen.',
            categories: {
                gamedev: {
                    title: 'Spieleentwicklung und -design',
                    description: 'Interaktive Systeme und Spielmechaniken',
                    subcategories: {
                        design: {
                            name: 'Spieldesign',
                            skills: ['Spielmechaniken', 'Level-Design', 'Spielerpsychologie', 'Systemdesign'],
                        },
                        development: {
                            name: 'Spieleentwicklung',
                            skills: ['Unity', 'C#', 'Physiksysteme', 'UI/UX für Spiele'],
                        },
                        relatedSkills: {
                            name: 'Verwandte Fähigkeiten',
                            skills: ['Prototyping', 'Spieltests', 'Spielnarrative', '3D-Modellierung Grundlagen'],
                        },
                    },
                },
                uiux: {
                    title: 'UI/UX-Design',
                    description: 'Digitales Produktdesign und Nutzererfahrung',
                    subcategories: {
                        tools: {
                            name: 'Design-Werkzeuge und Methoden',
                            skills: ['Figma', 'Wireframing', 'Prototyping', 'Design-Systeme'],
                        },
                        principles: {
                            name: 'Designprinzipien',
                            skills: ['Nutzerforschung', 'Usability-Tests', 'Informationsarchitektur', 'Responsives Design'],
                        },
                        advanced: {
                            name: 'Fortgeschrittenes Design',
                            skills: ['Adaptives Design', 'Interaktionsdesign', 'Barrierefreiheit (A11y)', 'Nutzertests'],
                        },
                    },
                },
                webdev: {
                    title: 'Webentwicklung',
                    description: 'Frontend- und Full-Stack-Webtechnologien',
                    subcategories: {
                        frontend: {
                            name: 'Frontend',
                            skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
                        },
                        tools: {
                            name: 'Frontend-Werkzeuge und Build',
                            skills: ['Vite', 'Node.js', 'npm/yarn', 'Git & GitHub', 'Terminal/CLI'],
                        },
                        backend: {
                            name: 'Backend und APIs',
                            skills: ['Node.js', 'PHP', 'REST-APIs', 'Datenbankdesign'],
                        },
                    },
                },
                dataAlgorithms: {
                    title: 'Daten und Algorithmen',
                    description: 'Algorithmisches Denken und Datenwissenschaft',
                    subcategories: {
                        algorithms: {
                            name: 'Algorithmen und Problemlösung',
                            skills: ['Algorithmendesign', 'Datenstrukturen', 'Algorithmisches Denken', 'Code-Optimierung'],
                        },
                        datascience: {
                            name: 'Datenwissenschaft',
                            skills: ['Python', 'Datenanalyse', 'Statistisches Denken', 'Datenvisualisierung'],
                        },
                        mathematics: {
                            name: 'Mathematisches Denken',
                            skills: ['Lineare Algebra', 'Diskrete Mathematik', 'Wahrscheinlichkeitsrechnung', 'Mustererkennung'],
                        },
                    },
                },
                cognitivescience: {
                    title: 'Kognitionswissenschaft und menschenzentriertes Design',
                    description: 'Verständnis menschlichen Verhaltens und Interaktion',
                    subcategories: {
                        cognitive: {
                            name: 'Kognitionswissenschaft',
                            skills: ['Kognitive Psychologie', 'Lernsysteme', 'Gedächtnis und Aufmerksamkeit', 'Entscheidungsfindung'],
                        },
                        hci: {
                            name: 'Mensch-Computer-Interaktion',
                            skills: ['Interaktionsdesign', 'Usability-Forschung', 'Barrierefreiheit', 'Nutzerverhaltenanalyse'],
                        },
                        learning: {
                            name: 'Lernen und Verhalten',
                            skills: ['Lerndesign', 'Gamifizierung', 'Nutzerengagement', 'Verhaltenspsychologie'],
                        },
                    },
                },
            },
        },

        timeline: {
            title: 'Zeitstrahl',
            description: 'Ein Weg durch Design, Code und Forschung.',
            ariaLabel: 'Zeitstrahlbereich',
            entries: {
                0: { startDate: '2026-02-02', endDate: '2026-06-30', title: 'Praktikum Spieleentwicklung', type: 'education', description: 'Entwicklung eines Spielkonzepts und Prototyps mit Unity und C#.' },
                1: { startDate: '2021-09', endDate: '2026-01', title: 'Bachelor MIASHS', type: 'education', description: 'An der Universität Bordeaux mit Schwerpunkt Kognitionswissenschaft und Mensch-Computer-Interaktion.' },
                2: { endDate: '2021-06', title: 'Französisches Abitur', type: 'education', description: 'Abschluss der Sekundarschule mit Schwerpunkt Naturwissenschaften und Mathematik.' },
                3: { startDate: '2026-02', endDate: '2026-03', title: 'Portfolio-Launch', type: 'work', description: 'Veröffentlichung dieses Portfolios zur Präsentation meiner Arbeit und meines Werdegangs.' },
                4: { startDate: '2025-05', endDate: '2026-01', title: 'Plugin GOL', type: 'project', description: 'Entwicklung eines Plugins für die Notiz-Anwendung Obsidian.' },
            },
        },

        interests: {
            title: 'Interessen',
            description: 'Bereiche, die ich erkunde und weiter erforsche',
            ariaLabel: 'Interessenbereich',
            note: 'Diese Interessen beeinflussen meine Design- und Entwicklungsansätze nachhaltig. Ich glaube, dass das Verständnis menschlichen Verhaltens, Lernens und Interagierens grundlegend dafür ist, bedeutungsvolle digitale Erlebnisse zu schaffen.',
            entries: {
                0: {
                    name: 'Kognitionswissenschaft',
                    description: 'Verstehen, wie Menschen lernen, wahrnehmen und mit Systemen interagieren',
                },
                1: {
                    name: 'Mensch-Computer-Interaktion',
                    description: 'Gestaltung von Oberflächen, die sich für Nutzer natürlich und intuitiv anfühlen',
                },
                2: {
                    name: 'Spieldesign',
                    description: 'Erkundung interaktiver Systeme, Spielerpsychologie und emergenter Spielmechaniken',
                },
                3: {
                    name: 'Lernsysteme',
                    description: 'Entwicklung ansprechender Lernerfahrungen und Wissenstransfer',
                },
                4: {
                    name: 'KI und Maschinelles Lernen',
                    description: 'Erkundung, wie KI die Nutzererfahrung und Designprozesse verbessern kann',
                },
                5: {
                    name: 'Design-Systeme',
                    description: 'Aufbau skalierbarer und wartbarer Design-Frameworks für große Produkte',
                },
            },
        },

        values: {
            title: 'Werte',
            description: 'Grundsätze, die meine Arbeit leiten',
            ariaLabel: 'Wertebereich',
            entries: {
                0: {
                    title: 'Klarheit',
                    quote: 'Wenn du es nicht einfach erklären kannst, hast du es nicht gut genug verstanden.',
                    description: 'Ich glaube, dass gutes Design und gutes Denken dieselbe Wurzel haben — Präzision. Komplexität ist einfach; Klarheit erfordert Arbeit.',
                },
                1: {
                    title: 'Tiefe',
                    quote: 'An der Oberfläche hören Amateure auf. In der Tiefe beginnt das Handwerk.',
                    description: 'Ich gehe über die naheliegende Lösung hinaus. Jede Verständnisschicht — technisch, kognitiv, menschlich — macht die Arbeit ehrlicher und beständiger.',
                },
                2: {
                    title: 'Absicht',
                    quote: 'Jede Entscheidung ist eine Aussage. Triff sie bewusst.',
                    description: 'Ich füge keine Funktionen, Farben oder Interaktionen ohne Grund hinzu. Design ist die Summe seiner Entscheidungen — und jede dient der Person, die es nutzt, oder eben nicht.',
                },
            },
        },

        contact: {
            title: 'Kontakt aufnehmen',
            description: 'Lass uns vernetzen und gemeinsam Möglichkeiten erkunden.',
            ariaLabel: 'Kontaktbereich',
            getInTouch: 'Kontaktiere mich',
            links: {
                email: {
                    label: 'E-Mail',
                    href: 'mailto:cogassien@hotmail.com',
                },
                linkedin: {
                    label: 'LinkedIn',
                    href: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261',
                },
                github: {
                    label: 'GitHub',
                    href: 'https://github.com/Xlambdas',
                },
            },
        },
    },

    it: {
        navigation: {
            back: '← Indietro',
            github: 'github',
        },

        ariaLabel: 'Pagina del portfolio',

        sidebar: {
            labelCollapse: 'Comprimi la barra laterale',
            labelExpand: 'Espandi la barra laterale',
            files: {
                about: {
                    name: 'DiMe',
                    comment: '# Sezione su di me',
                },
                skills: {
                    name: 'Competenze',
                    comment: '# Competenze ed esperienza',
                },
                timeline: {
                    name: 'Cronologia',
                    comment: '# La mia cronologia',
                },
                interests: {
                    name: 'Interessi',
                    comment: '# I miei interessi',
                },
                values: {
                    name: 'Valori',
                    comment: '# Valori personali',
                },
                contact: {
                    name: 'Contatti',
                    comment: '# Sezione contatti',
                },
            },
            folders: {
                portfolio: {
                    name: 'portfolio',
                    comment: '',
                },
                aboutme: {
                    name: 'dettagli',
                    comment: '# Sottocartella su di me',
                },
            },
            footer: {
                copyright: '©',
                githubLabel: 'github',
            },
        },

        hero: {
            title: 'Designer & Sviluppatore',
            subtitle: 'Creare esperienze intuitive all\'intersezione tra design, codice e scienze cognitive',
            ariaLabel: 'Introduzione del portfolio',
        },

        about: {
            title: 'Chi sono',
            description: 'Sono un designer e sviluppatore appassionato dalla creazione di esperienze digitali centrate sull\'essere umano. Con una formazione nelle scienze cognitive e competenze che spaziano dallo sviluppo di videogiochi al design UI/UX fino alle tecnologie web, affronto ogni progetto con chiarezza e intenzionalità.',
            ariaLabel: 'Sezione chi sono',
        },

        skills: {
            title: 'Competenze',
            description: 'Una panoramica completa della mia esperienza nello sviluppo di videogiochi, nel design, nelle tecnologie web e nelle scienze cognitive.',
            ariaLabel: 'Sezione competenze',
            finalNote: 'Esploro continuamente nuove tecnologie e metodologie. Sempre in apprendimento, sempre in costruzione.',
            categories: {
                gamedev: {
                    title: 'Sviluppo e Design di Videogiochi',
                    description: 'Sistemi interattivi e meccaniche di gioco',
                    subcategories: {
                        design: {
                            name: 'Game Design',
                            skills: ['Meccaniche di Gioco', 'Level Design', 'Psicologia del Giocatore', 'Design dei Sistemi'],
                        },
                        development: {
                            name: 'Sviluppo di Videogiochi',
                            skills: ['Unity', 'C#', 'Sistemi Fisici', 'UI/UX per Giochi'],
                        },
                        relatedSkills: {
                            name: 'Competenze Correlate',
                            skills: ['Prototipazione', 'Playtest', 'Narrativa di Gioco', 'Modellazione 3D base'],
                        },
                    },
                },
                uiux: {
                    title: 'Design UI/UX',
                    description: 'Design di prodotti digitali ed esperienza utente',
                    subcategories: {
                        tools: {
                            name: 'Strumenti e Metodi di Design',
                            skills: ['Figma', 'Wireframing', 'Prototipazione', 'Sistemi di Design'],
                        },
                        principles: {
                            name: 'Principi di Design',
                            skills: ['Ricerca Utente', 'Test di Usabilità', 'Architettura dell\'Informazione', 'Design Responsivo'],
                        },
                        advanced: {
                            name: 'Design Avanzato',
                            skills: ['Design Adattivo', 'Design dell\'Interazione', 'Accessibilità (A11y)', 'Test con Utenti'],
                        },
                    },
                },
                webdev: {
                    title: 'Sviluppo Web',
                    description: 'Tecnologie web frontend e full-stack',
                    subcategories: {
                        frontend: {
                            name: 'Frontend',
                            skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
                        },
                        tools: {
                            name: 'Strumenti Frontend e Build',
                            skills: ['Vite', 'Node.js', 'npm/yarn', 'Git & GitHub', 'Terminale/CLI'],
                        },
                        backend: {
                            name: 'Backend e API',
                            skills: ['Node.js', 'PHP', 'REST API', 'Progettazione di Database'],
                        },
                    },
                },
                dataAlgorithms: {
                    title: 'Dati e Algoritmi',
                    description: 'Pensiero computazionale e scienza dei dati',
                    subcategories: {
                        algorithms: {
                            name: 'Algoritmi e Risoluzione dei Problemi',
                            skills: ['Progettazione di Algoritmi', 'Strutture Dati', 'Pensiero Computazionale', 'Ottimizzazione del Codice'],
                        },
                        datascience: {
                            name: 'Scienza dei Dati',
                            skills: ['Python', 'Analisi dei Dati', 'Pensiero Statistico', 'Visualizzazione dei Dati'],
                        },
                        mathematics: {
                            name: 'Pensiero Matematico',
                            skills: ['Algebra Lineare', 'Matematica Discreta', 'Probabilità', 'Riconoscimento di Pattern'],
                        },
                    },
                },
                cognitivescience: {
                    title: 'Scienze Cognitive e Design Centrato sull\'Umano',
                    description: 'Comprensione del comportamento umano e dell\'interazione',
                    subcategories: {
                        cognitive: {
                            name: 'Scienze Cognitive',
                            skills: ['Psicologia Cognitiva', 'Sistemi di Apprendimento', 'Memoria e Attenzione', 'Processo Decisionale'],
                        },
                        hci: {
                            name: 'Interazione Uomo-Macchina',
                            skills: ['Design dell\'Interazione', 'Ricerca sull\'Usabilità', 'Accessibilità', 'Analisi del Comportamento Utente'],
                        },
                        learning: {
                            name: 'Apprendimento e Comportamento',
                            skills: ['Progettazione Didattica', 'Gamification', 'Coinvolgimento dell\'Utente', 'Psicologia Comportamentale'],
                        },
                    },
                },
            },
        },

        timeline: {
            title: 'Cronologia',
            description: 'Un percorso attraverso il design, il codice e la ricerca.',
            ariaLabel: 'Sezione cronologia',
            entries: {
                0: { startDate: '2026-02-02', endDate: '2026-06-30', title: 'Stage in sviluppo di videogiochi', type: 'education', description: 'Sviluppo di un concept e prototipo di gioco con Unity e C#.' },
                1: { startDate: '2021-09', endDate: '2026-01', title: 'Laurea triennale MIASHS', type: 'education', description: 'All\'Università di Bordeaux, con specializzazione in scienze cognitive e interazione uomo-macchina.' },
                2: { endDate: '2021-06', title: 'Baccalauréat francese', type: 'education', description: 'Diploma di scuola superiore con orientamento in scienze e matematica.' },
                3: { startDate: '2026-02', endDate: '2026-03', title: 'Lancio del portfolio', type: 'work', description: 'Pubblicazione di questo portfolio per presentare il mio lavoro e il mio percorso.' },
                4: { startDate: '2025-05', endDate: '2026-01', title: 'Plugin GOL', type: 'project', description: 'Sviluppo di un plugin per l\'applicazione di presa di appunti Obsidian.' },
            },
        },

        interests: {
            title: 'Interessi',
            description: 'Aree che esploro e continuo ad approfondire',
            ariaLabel: 'Sezione interessi',
            note: 'Questi interessi influenzano profondamente il mio approccio al design e allo sviluppo. Credo che comprendere il comportamento umano, l\'apprendimento e l\'interazione sia fondamentale per creare esperienze digitali significative.',
            entries: {
                0: {
                    name: 'Scienze Cognitive',
                    description: 'Capire come gli esseri umani apprendono, percepiscono e interagiscono con i sistemi',
                },
                1: {
                    name: 'Interazione Uomo-Macchina',
                    description: 'Progettare interfacce che risultino naturali e intuitive per gli utenti',
                },
                2: {
                    name: 'Game Design',
                    description: 'Esplorare sistemi interattivi, psicologia del giocatore e meccaniche emergenti',
                },
                3: {
                    name: 'Sistemi di Apprendimento',
                    description: 'Creare esperienze educative coinvolgenti e favorire il trasferimento di conoscenze',
                },
                4: {
                    name: 'IA e Apprendimento Automatico',
                    description: 'Esplorare come l\'IA può migliorare l\'esperienza utente e i processi di design',
                },
                5: {
                    name: 'Sistemi di Design',
                    description: 'Costruire framework di design scalabili e manutenibili per prodotti di grande scala',
                },
            },
        },

        values: {
            title: 'Valori',
            description: 'I principi che guidano il mio lavoro',
            ariaLabel: 'Sezione valori',
            entries: {
                0: {
                    title: 'Chiarezza',
                    quote: 'Se non riesci a spiegarlo in modo semplice, non lo hai capito abbastanza bene.',
                    description: 'Credo che il buon design e il buon pensiero condividano la stessa radice — la precisione. La complessità è facile; la chiarezza richiede lavoro.',
                },
                1: {
                    title: 'Profondità',
                    quote: 'La superficie è dove si fermano i dilettanti. La profondità è dove inizia il mestiere.',
                    description: 'Vado oltre la soluzione ovvia. Ogni strato di comprensione — tecnico, cognitivo, umano — rende il lavoro più onesto e più duraturo.',
                },
                2: {
                    title: 'Intenzione',
                    quote: 'Ogni decisione è un\'affermazione. Prendile deliberatamente.',
                    description: 'Non aggiungo funzionalità, colori o interazioni senza una ragione. Il design è la somma delle sue decisioni — e ognuna serve la persona che lo utilizza, o non lo fa.',
                },
            },
        },

        contact: {
            title: 'Contattami',
            description: 'Connettiamoci ed esploriamo opportunità insieme.',
            ariaLabel: 'Sezione contatti',
            getInTouch: 'Scrivimi',
            links: {
                email: {
                    label: 'Email',
                    href: 'mailto:cogassien@hotmail.com',
                },
                linkedin: {
                    label: 'LinkedIn',
                    href: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261',
                },
                github: {
                    label: 'GitHub',
                    href: 'https://github.com/Xlambdas',
                },
            },
        },
    },
};
