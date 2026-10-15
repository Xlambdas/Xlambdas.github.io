import type { Content } from './types'
import { BASE, IMAGES, LINKS } from './shared'
import { workFr } from './work.fr'

export const fr: Content = {
    lang: 'fr',
    ui: {
        skip: 'Aller au contenu',
        nav: { about: 'À propos', projects: 'Projets', work: 'Travaux', path: 'Parcours', skills: 'Compétences', contact: 'Contact' },
        switchLabel: 'English version',
        footer: 'Nouvelle-Aquitaine, France',
        univ: 'Université de Bordeaux',
        programme: 'Master TECH · Ergonomie & IHM',
        backHome: 'Retour au portfolio',
    },

    home: {
        meta: {
            title: 'Corentin Gassien — Ergonomie & IHM, Master TECH Bordeaux',
            description:
                "Portfolio de Corentin Gassien, étudiant en Master TECH (Technologie, Ergonomie, Cognition et Handicap) à l'Université de Bordeaux. Recherche un stage de M1 à partir d'avril 2027.",
        },
        eyebrow: 'Ergonomie & interaction humain-machine',
        lead:
            "Étudiant en Master TECH (Technologie, Ergonomie, Cognition et Handicap) à l'Université de Bordeaux. Je viens du développement, et ce qui m'intéresse le plus, ce sont les personnes qui utilisent ce qu'on construit.",
        status: {
            label: 'En recherche',
            title: "Stage de M1 à partir d'avril 2027",
            text: "Dans tout domaine lié à mon master : ergonomie, UX, accessibilité, sciences cognitives, handicap. Prêt à bouger n'importe où.",
        },
        ctaContact: 'Me contacter',
        ctaCv: 'Télécharger mon CV (PDF)',
        cvHref: `${BASE}cv/CV_Corentin_Gassien_FR.pdf`,

        about: {
            title: 'À propos',
            paragraphs: [
                "Je suis curieux d'à peu près tout. J'ai envie de comprendre comment les choses marchent, et surtout comment les gens les vivent au quotidien.",
                "Plus jeune, je passais beaucoup de temps dans ma tête. Aujourd'hui, j'ai appris à aller vers les autres, à échanger et à assumer mes idées. C'est un peu comme ça que je vois l'ergonomie : d'abord observer et écouter, ensuite proposer, et en parler.",
                "Avant le master, j'ai fait une licence MIASHS (maths, informatique et sciences humaines) puis je suis parti cinq mois dans une petite startup de jeux vidéo en Croatie : un stage hors cursus, que j'ai organisé moi-même en terminant mes cours de licence en avance. C'est là que j'ai compris que ce qui me plaît le plus, ce n'est pas seulement le code : c'est ce que vit la personne de l'autre côté de l'écran.",
            ],
            facts: [
                "1 800 km à vélo en autonomie, d'Arcachon à Aix en longeant les Pyrénées",
                'Formé aux Premiers Secours en Santé Mentale (PSSM)',
                'Anglais C1 · Allemand B1 · Italien A2',
            ],
        },

        projects: {
            title: 'Projets',
            featured: {
                tag: 'Stage · 2026 · Croatie',
                title: 'Big Small Games : 5 mois de game dev',
                text: "Des puzzles pour rendre les maths concrètes, des concepts de jeux testés en équipe, un moteur de recherche pour un jeu d'enquête, et une proposition de refonte du site du studio.",
                cta: "Lire l'étude de cas",
                shot: { ...IMAGES.roadLight, alt: 'Prototype Road Light : des piétons traversent une route gérée par des feux de circulation' },
            },
            others: [
                {
                    tag: 'Projet perso · en cours',
                    title: 'Game Of Life, plugin Obsidian',
                    text: "Transformer sa vie en RPG dans l'application de notes Obsidian : quêtes, niveaux, récompenses et suivi de progression.",
                },
                {
                    tag: 'Site perso',
                    title: 'xls-studio',
                    text: 'Mon terrain de jeu : petites applis, outils et prototypes que je construis pour apprendre.',
                    link: { label: 'Voir xls-studio.com', href: LINKS.xls },
                },
            ],
        },

        path: {
            title: 'Parcours',
            educationTitle: 'Formation',
            education: [
                {
                    period: 'Depuis 2026',
                    title: 'Master TECH : Technologie, Ergonomie, Cognition et Handicap',
                    place: 'Université de Bordeaux',
                },
                {
                    period: '2022 – 2025',
                    title: 'Licence MIASHS',
                    place: 'Maths et informatique appliquées aux sciences humaines et sociales · Université de Bordeaux',
                },
            ],
            workTitle: 'Expériences',
            work: [
                {
                    period: 'Févr. – juin 2026',
                    title: 'Développeur de jeux vidéo (stage volontaire, hors cursus)',
                    place: 'Big Small Games · Osijek, Croatie',
                },
                {
                    period: 'Depuis 2023',
                    title: 'Veilleur, accueil et support technique',
                    place: 'CREMI, bâtiment informatique · Université de Bordeaux, Talence',
                },
                {
                    period: 'Depuis 2023',
                    title: "Surveillant d'examens",
                    place: 'Université de Bordeaux, Talence',
                },
                {
                    period: '2022 – 2025',
                    title: 'Trésorier et animateur (bénévole)',
                    place: 'Free-Rider Club VTT · Saint-Sulpice-et-Cameyrac',
                },
            ],
        },

        skills: {
            title: 'Compétences',
            groups: [
                {
                    title: 'Ergonomie & UX',
                    items: ["Analyse de l'activité", 'Conception IHM / UX', 'Prototypage basse et haute fidélité', 'Tests utilisateurs', 'Accessibilité'],
                },
                { title: 'Outils', items: ['Figma', 'Unity 6', 'Git / GitHub', 'LaTeX', 'Markdown', 'Obsidian'] },
                {
                    title: 'Programmation',
                    items: ['C#', 'TypeScript / JavaScript', 'React', 'HTML / CSS', 'Python', 'R', 'Matlab', 'SQL / PHP', 'C++ / Arduino'],
                },
                { title: 'Langues', items: ['Français (natif)', 'Anglais C1', 'Allemand B1', 'Italien A2'] },
            ],
        },

        contact: {
            title: 'Contact',
            text: "Une offre de stage, une question, ou juste envie d'échanger ? Écrivez-moi, je réponds vite.",
            links: [
                { label: LINKS.email, href: `mailto:${LINKS.email}` },
                { label: 'LinkedIn', href: LINKS.linkedin },
                { label: 'GitHub', href: LINKS.github },
            ],
        },
    },

    work: workFr,

    caseStudy: {
        meta: {
            title: 'Big Small Games, 5 mois de game dev en Croatie — Corentin Gassien',
            description:
                "Étude de cas : le stage de Corentin Gassien chez Big Small Games (Croatie). Prototypes de puzzles éducatifs, concepts de jeux testés en équipe, moteur de recherche booléen et refonte web.",
        },
        tag: 'Étude de cas · Stage',
        title: 'Big Small Games : 5 mois de développement de jeux en Croatie',
        facts: [
            { label: 'Rôle', value: 'Développeur de jeux (stagiaire)' },
            { label: 'Période', value: 'Février – juin 2026' },
            { label: 'Cadre', value: 'Stage volontaire, hors cursus' },
            { label: 'Lieu', value: 'Osijek, Croatie' },
            { label: 'Équipe', value: '8 personnes, équipe internationale' },
            { label: 'Outils', value: 'Unity 6, C#, Git, Figma' },
        ],
        intro: [
            "Ce stage ne faisait pas partie de ma licence. J'ai obtenu de mes enseignants de terminer mes cours en avance, en décembre 2025, pour avoir le temps de partir cinq mois en Croatie, de février à fin juin 2026.",
            "Big Small Games est un petit studio indépendant qui fait des jeux 2D pour PC. Une équipe minuscule : le fondateur, une artiste, et une promo de stagiaires (trois développeurs, une concept artist, une chargée de marketing et une vidéaste). On travaillait tous en anglais.",
            "En partant, je voulais savoir si coder à plein temps me plaisait vraiment. La réponse : oui, mais ce qui m'a le plus accroché, c'est tout ce qui touche à l'expérience du joueur.",
        ],
        method: {
            title: 'Ma façon de travailler',
            text: "Les attentes changeaient souvent, ce qui est normal dans une startup qui cherche encore sa direction. Plutôt que de foncer tête baissée, je suivais toujours la même boucle :",
            steps: [
                { title: 'Esquisser', text: "Des croquis rapides pour vérifier que j'avais bien compris la demande, avant d'écrire une ligne de code." },
                { title: 'Prototyper', text: "Une version jouable au plus vite, pour que l'équipe puisse tester et réagir." },
                { title: 'Peaufiner', text: "Seulement ensuite : retours visuels, lisibilité, finitions." },
            ],
        },
        phases: [
            {
                period: 'Févr. – mars',
                title: 'Des puzzles pour rendre les maths concrètes',
                intro:
                    "Le studio prépare un jeu éducatif STEM pour montrer aux collégiens et lycéens que les maths, la physique ou l'informatique peuvent être ludiques. Chaque dev avait un domaine ; moi, les maths. Le défi : faire manipuler des concepts mathématiques sans que le joueur ait l'impression de « faire des maths ».",
                blocks: [
                    {
                        title: 'Math Slider Puzzle',
                        text: ["Régler des curseurs dont les valeurs s'additionnent à travers des nœuds, jusqu'à atteindre une cible. Chaque nœud impose son propre maximum : des contraintes locales pour un total global."],
                        shot: { ...IMAGES.mathSlider, alt: 'Math Slider Puzzle : curseurs reliés à des nœuds affichant des valeurs et une cible à atteindre' },
                    },
                    {
                        title: 'Liquid Pipe Puzzle',
                        text: ["Réordonner des segments de tuyaux par glisser-déposer pour relier l'entrée à la sortie. Les niveaux sont générés procéduralement."],
                        shot: { ...IMAGES.liquidPipe, alt: 'Liquid Pipe Puzzle : segments de tuyaux à réordonner entre une entrée et une sortie' },
                    },
                    {
                        title: 'Tube Puzzle',
                        text: ["Transvaser des liquides d'un tube à l'autre pour atteindre des niveaux précis. Ça fait travailler la conservation des quantités, sans jamais le dire."],
                        shot: { ...IMAGES.tubePuzzle, alt: 'Tube Puzzle : quatre tubes avec des niveaux de liquide et des seuils à atteindre' },
                    },
                ],
                note: "Ces prototypes servaient à tester des mécaniques et leur lisibilité, pas à sortir un jeu fini. Côté technique : niveaux décrits en ScriptableObjects (logique et contenu séparés), scènes assemblées au lancement, et retours visuels pour le joueur (voyants, écran de victoire, niveaux colorés selon la difficulté).",
            },
            {
                period: 'Mars – avril',
                title: 'Carte blanche',
                intro:
                    "Deux sessions de deux semaines, une seule contrainte : des jeux 2D fun qui demandent peu de graphismes. Chaque dev portait son propre concept et présentait des versions intermédiaires, testées par toute l'équipe.",
                blocks: [
                    {
                        title: 'Go Deeper',
                        text: [
                            "Un puzzle-platformer où la caméra ne bouge pas : c'est la profondeur qui change. Un mur sur une couche peut être un passage sur une autre, un levier sur la couche 2 agit sur la couche 1. Le décor devient le puzzle.",
                            "J'ai porté le concept de bout en bout : croquis papier, règles, level design, puis prototype jouable. Les tests avec l'équipe ont montré que le principe était bien compris, et pointé ce qu'il fallait améliorer : le retour visuel pendant les changements de couche.",
                        ],
                        shot: { ...IMAGES.goDeeper, alt: 'Go Deeper : niveau en 2D avec plusieurs couches de profondeur et un personnage' },
                    },
                    {
                        title: 'Road Light',
                        text: [
                            "Un jeu de gestion où l'on contrôle les feux d'une ville pour protéger les piétons. Sauf que certains traversent au rouge, et certains conducteurs grillent les feux.",
                            "Le plus dur : des piétons crédibles. Au début, ils s'agglutinaient, se bloquaient entre eux ou restaient figés aux feux. J'ai simplifié le modèle de déplacement et ajusté les collisions : un peu moins réaliste, mais jouable.",
                        ],
                        shot: { ...IMAGES.roadLight, alt: 'Road Light : vue de dessus de routes, passages piétons, feux et piétons' },
                    },
                ],
            },
            {
                period: 'Avril – juin',
                title: 'Chercher le prochain jeu du studio',
                intro: "Une phase d'exploration collective : plusieurs pistes en parallèle, entre prototypes techniques et réflexion de game design.",
                blocks: [
                    {
                        title: "Jeu d'enquête : une boîte mail",
                        text: [
                            "Une boîte mail fictive avec un vrai moteur de recherche : requêtes booléennes (AND, OR, NOT, parenthèses, \"expressions exactes\"), résultats triés par pertinence, termes surlignés dans le mail.",
                            "En cours de route, le fondateur a voulu masquer le sujet, la date et l'expéditeur. Le joueur doit donc enquêter uniquement à partir du contenu des mails. J'ai adapté l'outil à cette nouvelle contrainte.",
                        ],
                        shot: { ...IMAGES.emailClient, alt: 'Email Client : barre de recherche avec une requête booléenne, liste de mails et termes surlignés' },
                    },
                    {
                        title: 'Lumière et chats',
                        text: ["Recherche de game design et d'interface autour de la lumière : chaque chat a besoin d'une certaine intensité pour être bien. Premières esquisses de niveaux et d'UI."],
                        shot: { ...IMAGES.lightCats, alt: 'Esquisse du jeu de lumière et de chats : une pièce vue de dessus avec des lampes et des chats' },
                    },
                    {
                        title: 'Animations sans assets',
                        text: ["Pour un concept autour du café : des shaders pour animer un liquide qui monte dans une tasse, sans aucun dessin dédié."],
                    },
                ],
            },
        ],
        initiative: {
            title: 'Une initiative : refaire le site du studio',
            text: [
                "De moi-même, j'ai proposé de refaire le site web du studio. Au début, le fondateur ne voyait pas l'intérêt : ce n'était pas la priorité.",
                "J'ai donc préparé des arguments (crédibilité auprès des partenaires, recrutement, presse) et je les ai présentés à l'équipe. J'ai eu le feu vert, puis j'ai conçu seul un prototype haute fidélité sous Figma, avec une nouvelle identité visuelle.",
            ],
        },
        hard: {
            title: 'Ce qui a été difficile',
            items: [
                {
                    title: 'Des attentes qui bougent',
                    text: "Il n'était pas toujours simple de savoir ce que le fondateur attendait exactement. Les croquis rapides et les prototypes m'ont permis de vérifier vite, plutôt que de deviner.",
                },
                {
                    title: 'Monter en compétence vite',
                    text: "J'arrivais avec peu d'expérience en game dev. J'ai beaucoup travaillé en dehors des heures, avant et pendant le stage, pour être utile rapidement.",
                },
                {
                    title: 'Voir du travail mis de côté',
                    text: "Dans un studio qui explore, beaucoup de prototypes ne sont pas retenus. C'est frustrant, mais c'est le jeu de la recherche.",
                },
            ],
        },
        takeaway: {
            title: "Ce que j'en retiens",
            text: [
                "Ce stage a été un révélateur. Les moments que j'ai préférés n'étaient pas les plus techniques : rendre une mécanique lisible, adapter l'outil mail après les retours, dessiner le prototype du site.",
                "C'est ce qui m'a amené au Master TECH : continuer à construire, mais en partant des gens.",
            ],
            skillsTitle: 'Compétences développées',
            skills: ['Prototypage rapide', 'Tests avec utilisateurs', 'Level design', 'Unity 6 & C#', 'Shaders', 'Figma haute fidélité', 'Travail en équipe internationale', 'Argumenter une idée'],
        },
        cta: { text: 'Ce parcours vous parle ? Je cherche un stage de M1 à partir d\'avril 2027.', button: 'Me contacter' },
    },
}
