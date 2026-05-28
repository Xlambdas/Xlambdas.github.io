import type { NodeType } from "../../types";

export const LongTermMemoryNode: NodeType = {
    id: "memoire_long_terme",
    title: "Mémoire à Long Terme",
    type: "concept",
    links: [], // ["memoire_episodique", "memoire_semantique", "memoire_procedurale", "consolidation"],
    isUnlocked: false,
    prerequisites: ["memoire"],
    branchColor: "#3b82f6",
    hook: "Certaines informations disparaissent en quelques secondes, d'autres restent pendant des années, parfois toute une vie. La mémoire à long terme correspond à cette capacité de conserver durablement des connaissances, des événements vécus et des savoir-faire. [web:35][web:56][web:59]",
    shortDescription:
        "Le système de mémoire durable qui conserve faits, souvenirs personnels et savoir-faire.",
    badge: {
        id: "badge_memoire_long_terme",
        nodeId: "memoire_long_terme",
        icon: "📚",
        name: "Gardien des Traces",
        description: "Maîtrise des fondements de la mémoire à long terme",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "memoire_lt_intro_q1",
            lessonId: "memoire_lt_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire à long terme se caractérise surtout par :",
                choices: [
                    "Un stockage très bref et instable",
                    "Une conservation durable de l'information",
                    "Une utilisation exclusive pour les images mentales",
                    "Une capacité limitée à quelques éléments seulement",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire à long terme est le système de rétention durable de l'information, pouvant conserver des traces sur des périodes très longues. [web:35][web:59]",
            },
        },
        {
            id: "memoire_lt_intro_q2",
            lessonId: "memoire_lt_intro",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La mémoire à long terme est généralement considérée comme un système unique et homogène.",
                correct: false,
                explanation:
                    "Faux. Les sources distinguent plusieurs types de mémoire à long terme, notamment explicite et implicite, ainsi que mémoire épisodique, sémantique et procédurale. [web:35][web:56][web:29]",
            },
        },

        {
            id: "memoire_lt_duree_q1",
            lessonId: "memoire_lt_duree",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quelle affirmation décrit le mieux la durée de la mémoire à long terme ?",
                choices: [
                    "Elle ne dépasse jamais quelques secondes",
                    "Elle peut durer de quelques minutes à toute une vie",
                    "Elle dure uniquement pendant le sommeil",
                    "Elle est toujours identique pour toutes les informations",
                ],
                correctIndex: 1,
                explanation:
                    "Les sources indiquent que la durée de la mémoire à long terme peut aller de quelques minutes à toute une vie. [web:35]",
            },
        },
        {
            id: "memoire_lt_duree_q2",
            lessonId: "memoire_lt_duree",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Le principal problème de la mémoire à long terme n'est pas toujours la disparition de l'information, mais parfois son accessibilité.",
                correct: true,
                explanation:
                    "Oui. Certaines descriptions soulignent que la contrainte principale peut être l'accessibilité du souvenir plutôt que sa disponibilité brute. [web:35][web:59]",
            },
        },

        {
            id: "memoire_lt_types_q1",
            lessonId: "memoire_lt_types",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque grand type de mémoire à long terme à sa description :",
                pairs: [
                    { left: "Mémoire explicite", right: "Souvenirs accessibles consciemment" },
                    { left: "Mémoire implicite", right: "Connaissances ou traces peu conscientes" },
                    { left: "Mémoire procédurale", right: "Savoir-faire et habiletés" },
                ],
                explanation:
                    "La mémoire à long terme comprend des formes explicites, conscientes, et implicites, moins accessibles à la conscience. [web:56][web:35][web:61]",
            },
        },
        {
            id: "memoire_lt_types_q2",
            lessonId: "memoire_lt_types",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Laquelle de ces distinctions est la plus classique pour organiser la mémoire à long terme ?",
                choices: [
                    "Explicite vs implicite",
                    "Visuelle vs musicale",
                    "Rapide vs lente",
                    "Faible vs forte",
                ],
                correctIndex: 0,
                explanation:
                    "Une distinction majeure oppose mémoire explicite et mémoire implicite. [web:56][web:61][web:35]",
            },
        },

        {
            id: "memoire_lt_epi_q1",
            lessonId: "memoire_lt_episodique",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire épisodique concerne surtout :",
                choices: [
                    "Les habiletés motrices",
                    "Les événements personnellement vécus",
                    "Les règles grammaticales uniquement",
                    "Les réflexes conditionnés",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire épisodique concerne les événements vécus personnellement, avec leur contexte. [web:35][web:32][web:29]",
            },
        },
        {
            id: "memoire_lt_epi_q2",
            lessonId: "memoire_lt_episodique",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "La mémoire épisodique est généralement associée à un contexte personnel et temporel.",
                correct: true,
                explanation:
                    "Oui. Les souvenirs épisodiques portent sur des épisodes de vie, souvent liés à un contexte personnel et temporel. [web:32][web:35]",
            },
        },

        {
            id: "memoire_lt_sem_q1",
            lessonId: "memoire_lt_semantique",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire sémantique porte surtout sur :",
                choices: [
                    "Les compétences motrices",
                    "Les faits, concepts et connaissances générales",
                    "Les souvenirs datés de l'enfance uniquement",
                    "Les émotions du moment",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire sémantique stocke les connaissances générales, les concepts et la signification du monde. [web:35][web:32][web:29]",
            },
        },
        {
            id: "memoire_lt_sem_q2",
            lessonId: "memoire_lt_semantique",
            blockIndex: 3,
            question: {
                type: "word_bank",
                question: "Complète la phrase :",
                sentence:
                    "Savoir que Rome est la capitale de l'Italie relève surtout de la mémoire ___.",
                bank: ["sémantique", "épisodique", "procédurale", "iconique"],
                correctWords: ["sémantique"],
                explanation:
                    "Les faits généraux et connaissances du monde relèvent de la mémoire sémantique. [web:35][web:29]",
            },
        },

        {
            id: "memoire_lt_proc_q1",
            lessonId: "memoire_lt_procedurale",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire procédurale correspond surtout à :",
                choices: [
                    "La mémoire des savoir-faire",
                    "La mémoire des dates historiques",
                    "La mémoire des souvenirs personnels détaillés",
                    "La mémoire des définitions de mots",
                ],
                correctIndex: 0,
                explanation:
                    "La mémoire procédurale correspond au 'savoir comment', comme faire du vélo ou taper au clavier. [web:35][web:56][web:32]",
            },
        },
        {
            id: "memoire_lt_proc_q2",
            lessonId: "memoire_lt_procedurale",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "La mémoire procédurale nécessite généralement moins de rappel conscient que la mémoire épisodique.",
                correct: true,
                explanation:
                    "Oui. La mémoire procédurale est souvent plus implicite et moins consciemment verbalisable que la mémoire épisodique. [web:56][web:35][web:29]",
            },
        },

        {
            id: "memoire_lt_explicite_q1",
            lessonId: "memoire_lt_explicite_implicite",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque type à sa bonne caractéristique :",
                pairs: [
                    { left: "Explicite", right: "Rappel conscient de faits ou d'événements" },
                    { left: "Implicite", right: "Influence du passé sans rappel conscient direct" },
                    { left: "Procédurale", right: "Habiletés automatisées" },
                ],
                explanation:
                    "La distinction explicite / implicite structure une grande partie de l'étude de la mémoire à long terme. [web:56][web:61][web:35]",
            },
        },
        {
            id: "memoire_lt_explicite_q2",
            lessonId: "memoire_lt_explicite_implicite",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces exemples correspond le mieux à une mémoire implicite ?",
                choices: [
                    "Se rappeler son dernier anniversaire",
                    "Réciter une date historique",
                    "Faire du vélo sans réfléchir aux mouvements précis",
                    "Donner la définition d'un mot",
                ],
                correctIndex: 2,
                explanation:
                    "Les habiletés comme faire du vélo relèvent d'une mémoire implicite, en particulier procédurale. [web:56][web:61][web:35]",
            },
        },

        {
            id: "memoire_lt_consolidation_q1",
            lessonId: "memoire_lt_consolidation",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La consolidation de la mémoire correspond surtout à :",
                choices: [
                    "L'effacement d'un souvenir ancien",
                    "La stabilisation progressive d'une trace mnésique récente",
                    "La division automatique d'un souvenir en plusieurs parties",
                    "Le passage direct d'une perception à une habileté motrice",
                ],
                correctIndex: 1,
                explanation:
                    "La consolidation désigne le processus par lequel une information récemment acquise devient plus stable et durable. [web:59][web:62]",
            },
        },
        {
            id: "memoire_lt_consolidation_q2",
            lessonId: "memoire_lt_consolidation",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Le sommeil est souvent présenté comme important pour la consolidation mnésique.",
                correct: true,
                explanation:
                    "Oui. Les sources indiquent que le sommeil, notamment le sommeil profond, joue un rôle important dans la consolidation. [web:59][web:62]",
            },
        },

        {
            id: "memoire_lt_recup_q1",
            lessonId: "memoire_lt_recuperation",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "Récupérer un souvenir revient toujours à lire une copie parfaitement intacte du passé.",
                correct: false,
                explanation:
                    "Faux. Les descriptions contemporaines soulignent le caractère reconstructif de la récupération mnésique. [web:59][web:57]",
            },
        },
        {
            id: "memoire_lt_recup_q2",
            lessonId: "memoire_lt_recuperation",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Pourquoi parle-t-on souvent d'une mémoire reconstructive ?",
                choices: [
                    "Parce qu'un souvenir est reconstruit à partir de traces, d'indices et du contexte actuel",
                    "Parce qu'un souvenir est toujours faux",
                    "Parce qu'aucune mémoire ancienne n'existe réellement",
                    "Parce que seule la mémoire procédurale est concernée",
                ],
                correctIndex: 0,
                explanation:
                    "La récupération fait intervenir des indices, des attentes et des reconstructions, ce qui rend la mémoire flexible mais aussi faillible. [web:59][web:57]",
            },
        },

        {
            id: "memoire_lt_oubli_q1",
            lessonId: "memoire_lt_oubli",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Dans la mémoire à long terme, l'oubli peut venir :",
                choices: [
                    "Uniquement d'une disparition totale de la trace",
                    "D'un problème d'accès ou de récupération",
                    "Uniquement d'un manque de sommeil",
                    "Uniquement d'un déficit moteur",
                ],
                correctIndex: 1,
                explanation:
                    "L'oubli dans la mémoire à long terme peut être lié à l'accessibilité du souvenir et aux conditions de récupération. [web:35][web:59]",
            },
        },
        {
            id: "memoire_lt_oubli_q2",
            lessonId: "memoire_lt_oubli",
            blockIndex: 3,
            question: {
                type: "word_bank",
                question: "Complète la phrase :",
                sentence:
                    "Le rappel d'un souvenir dépend souvent d'indices de ___ adaptés.",
                bank: ["récupération", "respiration", "digestion", "rotation"],
                correctWords: ["récupération"],
                explanation:
                    "Les indices de récupération aident l'accès aux souvenirs stockés en mémoire à long terme. [web:59][web:35]",
            },
        },

        {
            id: "memoire_lt_pont_q1",
            lessonId: "memoire_lt_pont",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quel futur nœud prolonge le plus naturellement l'étude des souvenirs d'événements vécus ?",
                choices: [
                    "memoire_episodique",
                    "boucle_phonologique",
                    "attention_divisee",
                    "reflexes_conditionnes",
                ],
                correctIndex: 0,
                explanation:
                    "Les souvenirs personnels vécus renvoient directement au nœud 'memoire_episodique'. [web:35][web:32]",
            },
        },
        {
            id: "memoire_lt_pont_q2",
            lessonId: "memoire_lt_pont",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Quel futur nœud prolonge le mieux l'étude des savoir-faire automatisés ?",
                choices: [
                    "memoire_procedurale",
                    "memoire_iconique",
                    "administrateur_central",
                    "attention_selective",
                ],
                correctIndex: 0,
                explanation:
                    "Les savoir-faire automatisés prolongent naturellement l'étude de la mémoire procédurale. [web:35][web:56][web:32]",
            },
        },

        {
            id: "memoire_lt_recap_q1",
            lessonId: "memoire_lt_recap",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces idées dans un ordre logique d'apprentissage :",
                items: [
                    "Comprendre que la mémoire à long terme est durable",
                    "Voir qu'elle comprend plusieurs systèmes",
                    "Distinguer mémoire épisodique, sémantique et procédurale",
                    "Étudier consolidation, récupération et oubli",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "La progression va de la définition générale à la structure des systèmes, puis aux grands types de contenus, puis aux processus dynamiques. [web:35][web:56][web:59]",
            },
        },
        {
            id: "memoire_lt_recap_q2",
            lessonId: "memoire_lt_recap",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de mémoire à son contenu principal :",
                pairs: [
                    { left: "Épisodique", right: "Événements vécus" },
                    { left: "Sémantique", right: "Faits et concepts" },
                    { left: "Procédurale", right: "Habiletés et savoir-faire" },
                    { left: "Consolidation", right: "Stabilisation progressive des traces" },
                ],
                explanation:
                    "Ces notions résument les distinctions fondamentales du nœud. [web:35][web:32][web:59]",
            },
        },

        {
            id: "memoire_lt_final_q1",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "La mémoire à long terme est surtout associée à :",
                choices: [
                    "Une conservation durable de l'information",
                    "Une conservation limitée à quelques secondes",
                    "Un traitement exclusivement verbal",
                    "Un système unique sans sous-types",
                ],
                correctIndex: 0,
                explanation:
                    "Elle correspond à la conservation durable d'informations, de souvenirs et de compétences. [web:35][web:56]",
            },
        },
        {
            id: "memoire_lt_final_q2",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "La mémoire à long terme comprend des formes explicites et implicites.",
                correct: true,
                explanation:
                    "Oui. Cette distinction est centrale dans l'organisation de la mémoire à long terme. [web:56][web:61][web:35]",
            },
        },
        {
            id: "memoire_lt_final_q3",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quel type de mémoire concerne surtout les faits et concepts ?",
                choices: [
                    "Mémoire procédurale",
                    "Mémoire sémantique",
                    "Mémoire réflexe",
                    "Mémoire iconique",
                ],
                correctIndex: 1,
                explanation:
                    "Les faits et concepts relèvent de la mémoire sémantique. [web:35][web:32][web:29]",
            },
        },
        {
            id: "memoire_lt_final_q4",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quel type de mémoire concerne surtout les événements personnellement vécus ?",
                choices: [
                    "Mémoire épisodique",
                    "Mémoire procédurale",
                    "Mémoire acoustique",
                    "Mémoire sensorielle",
                ],
                correctIndex: 0,
                explanation:
                    "Les souvenirs autobiographiques ou vécus relèvent de la mémoire épisodique. [web:35][web:32]",
            },
        },
        {
            id: "memoire_lt_final_q5",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quel type de mémoire concerne surtout les habiletés ?",
                choices: [
                    "Mémoire sémantique",
                    "Mémoire épisodique",
                    "Mémoire procédurale",
                    "Mémoire contextuelle",
                ],
                correctIndex: 2,
                explanation:
                    "Les habiletés et savoir-faire renvoient à la mémoire procédurale. [web:35][web:56][web:32]",
            },
        },
        {
            id: "memoire_lt_final_q6",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "La consolidation transforme progressivement une trace récente en trace plus stable.",
                correct: true,
                explanation:
                    "Oui. C'est la définition générale de la consolidation mnésique. [web:59][web:62]",
            },
        },
        {
            id: "memoire_lt_final_q7",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "match_pairs",
                question: "Associe chaque notion à son idée centrale :",
                pairs: [
                    { left: "Explicite", right: "Rappel conscient" },
                    { left: "Implicite", right: "Influence sans rappel conscient direct" },
                    { left: "Reconstructive", right: "Récupération guidée par indices et contexte" },
                    { left: "Consolidation", right: "Stabilisation progressive" },
                ],
                explanation:
                    "Ces notions résument l'organisation et le fonctionnement de la mémoire à long terme. [web:56][web:61][web:59]",
            },
        },
        {
            id: "memoire_lt_final_q8",
            lessonId: "memoire_lt_final_quiz",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets dans l'ordre logique cette progression :",
                items: [
                    "Une information est apprise",
                    "Elle se consolide progressivement",
                    "Elle peut être stockée durablement",
                    "Elle est récupérée plus tard avec plus ou moins de succès",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "L'information acquise se consolide, devient plus durable, puis peut être récupérée plus tard. [web:59][web:62][web:35]",
            },
        },
    ],
    lessonPath: [
        {
            id: "memoire_lt_intro",
            title: "Qu'est-ce que la mémoire à long terme ?",
            type: "vignette",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "vignette",
                    title: "Ce qui reste",
                    content:
                        "Tu peux oublier un numéro en quelques secondes, mais te souvenir d'une chanson, d'un fait appris à l'école ou de la manière de faire du vélo pendant des années. Cela montre qu'il existe un système de mémoire bien plus durable que le simple maintien temporaire.\n\nC'est ce qu'on appelle la mémoire à long terme. [web:35][web:56]",
                },
                {
                    type: "explanation",
                    title: "Une mémoire durable",
                    content:
                        "La mémoire à long terme correspond à la conservation durable d'informations, de connaissances, de souvenirs personnels et de savoir-faire. Sa durée peut aller de quelques minutes à toute une vie, et sa capacité est souvent considérée comme très vaste, voire théoriquement illimitée. [web:35][web:59]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire à long terme conserve l'information de façon durable [web:35][web:56]",
                        "Elle ne constitue pas un système unique et homogène [web:35][web:29]",
                        "Elle concerne souvenirs, connaissances et savoir-faire [web:35][web:56]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_duree",
            title: "Durée et capacité",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Beaucoup plus qu'un stockage bref",
                    content:
                        "Contrairement à la mémoire à court terme ou à la mémoire de travail, la mémoire à long terme permet de conserver des informations sur de très longues périodes. Certaines traces peuvent durer quelques minutes, d'autres des décennies. [web:35]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_duree_q1",
                },
                {
                    type: "explanation",
                    title: "Le problème de l'accès",
                    content:
                        "Dans la mémoire à long terme, la difficulté ne vient pas toujours d'une disparition pure et simple de l'information. Souvent, le problème est plutôt d'y accéder au bon moment, avec les bons indices ou dans le bon contexte. [web:35][web:59]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_duree_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire à long terme peut durer très longtemps [web:35]",
                        "L'accessibilité d'un souvenir est souvent aussi importante que sa présence en mémoire [web:35][web:59]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_types",
            title: "Une mémoire, plusieurs systèmes",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Pas un seul grand entrepôt",
                    content:
                        "La mémoire à long terme n'est pas un seul stock uniforme. Les chercheurs distinguent plusieurs formes de mémoire selon le type de contenu, le rapport à la conscience et la façon dont l'information influence le comportement. [web:35][web:56][web:61]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_types_q1",
                },
                {
                    type: "explanation",
                    title: "Explicite et implicite",
                    content:
                        "Une grande distinction oppose la mémoire explicite, qui peut être rappelée consciemment, à la mémoire implicite, qui influence l'action sans rappel conscient direct. Cette distinction permet ensuite de mieux situer les sous-types comme l'épisodique, la sémantique ou la procédurale. [web:56][web:61][web:35]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_types_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire à long terme comprend plusieurs systèmes [web:35][web:56]",
                        "Une distinction importante oppose explicite et implicite [web:56][web:61]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_episodique",
            title: "La mémoire épisodique",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Les épisodes de la vie",
                    content:
                        "La mémoire épisodique concerne les événements personnellement vécus. Elle permet de se rappeler une fête, une rencontre, un voyage, une journée particulière ou un moment précis avec son contexte propre. [web:35][web:32][web:29]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_epi_q1",
                },
                {
                    type: "explanation",
                    title: "Le rôle du contexte",
                    content:
                        "Un souvenir épisodique est généralement lié à un moment, un lieu, un ressenti ou un point de vue personnel. C'est ce contexte qui le distingue fortement des connaissances générales stockées ailleurs dans la mémoire à long terme. [web:32][web:35]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_epi_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire épisodique concerne les événements vécus [web:35][web:32]",
                        "Elle est liée à un contexte personnel et temporel [web:32][web:29]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_semantique",
            title: "La mémoire sémantique",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Le savoir sur le monde",
                    content:
                        "La mémoire sémantique contient les connaissances générales : sens des mots, concepts, catégories, faits et informations sur le monde. Elle te permet de savoir ce qu'est une capitale, de comprendre un mot ou de connaître une règle sans forcément te souvenir quand tu l'as apprise. [web:35][web:32][web:29]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_sem_q1",
                },
                {
                    type: "explanation",
                    title: "Connaître sans revivre",
                    content:
                        "Contrairement à la mémoire épisodique, la mémoire sémantique n'est pas forcément liée à un épisode personnel précis. On peut savoir quelque chose sans se rappeler l'événement exact où cette connaissance a été acquise. [web:35][web:32]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_sem_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire sémantique stocke faits, concepts et significations [web:35][web:29]",
                        "Elle n'est pas nécessairement liée à un souvenir personnel daté [web:32][web:35]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_procedurale",
            title: "La mémoire procédurale",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Savoir faire",
                    content:
                        "La mémoire procédurale correspond aux habiletés et savoir-faire acquis avec la pratique. Elle permet, par exemple, de faire du vélo, d'écrire au clavier, de lacer ses chaussures ou de jouer d'un instrument sans devoir réfléchir consciemment à chaque geste. [web:35][web:56][web:32]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_proc_q1",
                },
                {
                    type: "explanation",
                    title: "Une mémoire souvent implicite",
                    content:
                        "Cette forme de mémoire est souvent moins accessible à l'introspection consciente. On peut très bien exécuter une compétence correctement sans être capable d'en expliquer verbalement tous les détails. [web:56][web:29][web:35]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_proc_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire procédurale porte sur les habiletés [web:35][web:56]",
                        "Elle est souvent plus implicite que les souvenirs ou faits conscients [web:56][web:29]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_explicite_implicite",
            title: "Explicite et implicite",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Deux façons de garder le passé",
                    content:
                        "La mémoire explicite renvoie à ce qu'on peut rappeler consciemment, comme un fait appris ou un événement vécu. La mémoire implicite, elle, influence le comportement sans que le souvenir soit forcément rappelé de manière consciente. [web:56][web:61][web:35]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_explicite_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi cette distinction compte",
                    content:
                        "Cette opposition aide à comprendre pourquoi on peut perdre certains souvenirs déclaratifs tout en conservant des habiletés. Elle montre aussi que la mémoire à long terme n'agit pas toujours sous la forme d'un rappel conscient. [web:56][web:61]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_explicite_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire explicite implique un rappel conscient [web:56][web:61]",
                        "La mémoire implicite influence l'action sans rappel conscient direct [web:56][web:61]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_consolidation",
            title: "Consolidation",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "De fragile à plus stable",
                    content:
                        "Une information nouvellement apprise n'est pas immédiatement fixée pour toujours. La consolidation désigne le processus progressif par lequel une trace mnésique récente devient plus stable et plus résistante à l'oubli ou à l'interférence. [web:59][web:62]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_consolidation_q1",
                },
                {
                    type: "explanation",
                    title: "Le rôle du temps et du sommeil",
                    content:
                        "La consolidation peut s'étendre sur des minutes, des heures, des jours ou davantage. Le sommeil, notamment certaines phases profondes, est souvent décrit comme particulièrement important dans ce processus. [web:59][web:62]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_consolidation_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La consolidation stabilise progressivement la mémoire [web:59][web:62]",
                        "Le sommeil joue un rôle important dans ce processus [web:59][web:62]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_recuperation",
            title: "Récupération et reconstruction",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Retrouver n'est pas recopier",
                    content:
                        "Récupérer un souvenir en mémoire à long terme ne consiste pas toujours à lire une trace parfaitement intacte. La récupération dépend souvent d'indices, du contexte, des attentes du moment et de la manière dont l'information avait été encodée. [web:59][web:57]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_recup_q1",
                },
                {
                    type: "explanation",
                    title: "Une mémoire souple, mais imparfaite",
                    content:
                        "Cette dimension reconstructive rend la mémoire très utile, car elle permet d'adapter le rappel au contexte. Mais elle explique aussi pourquoi les souvenirs peuvent être déformés, incomplets ou influencés par des informations nouvelles. [web:59][web:57]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_recup_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La récupération dépend des indices et du contexte [web:59][web:57]",
                        "La mémoire à long terme est en partie reconstructive [web:59][web:57]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_oubli",
            title: "Oubli et accès au souvenir",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Un problème d'accès",
                    content:
                        "Dans la mémoire à long terme, oublier ne signifie pas toujours qu'une trace a complètement disparu. Il arrive qu'un souvenir soit difficile à retrouver faute de bons indices ou parce que le contexte de récupération ne facilite pas son accès. [web:35][web:59]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_oubli_q1",
                },
                {
                    type: "explanation",
                    title: "Le rôle des indices",
                    content:
                        "Un lieu, une odeur, une question précise ou une association pertinente peuvent parfois faire revenir une information qui semblait inaccessible. Cela montre que l'oubli dépend souvent des conditions de récupération autant que du stockage lui-même. [web:59][web:35]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_oubli_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'oubli peut venir d'un problème d'accès plutôt que d'une disparition totale [web:35][web:59]",
                        "Les indices de récupération jouent un rôle central [web:59]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_pont",
            title: "Vers les branches spécialisées",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Un nœud d'organisation",
                    content:
                        "Ce nœud introduit les grands systèmes de la mémoire à long terme et les principaux processus qui la rendent durable. Il prépare ensuite des branches plus spécialisées comme la mémoire épisodique, la mémoire sémantique, la mémoire procédurale ou encore la consolidation. [web:35][web:56][web:59]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_pont_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi ces branches sont utiles",
                    content:
                        "Chaque sous-type répond à une question différente : comment on se souvient de sa vie, comment on connaît le monde, comment on apprend des habiletés, et comment une trace devient plus stable avec le temps. [web:35][web:32][web:59]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_pont_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le nœud prépare l'étude détaillée des grands systèmes de mémoire à long terme [web:35][web:56]",
                        "Il mène naturellement vers mémoire épisodique, sémantique, procédurale et consolidation [web:35][web:59]",
                    ],
                },
            ],
        },
        {
            id: "memoire_lt_recap",
            title: "Récapitulatif",
            type: "recap",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "La mémoire à long terme conserve durablement les informations [web:35][web:56]",
                        "Elle n'est pas homogène et comprend plusieurs systèmes [web:35][web:56][web:61]",
                        "La mémoire épisodique concerne les événements vécus [web:35][web:32]",
                        "La mémoire sémantique concerne les faits et concepts [web:35][web:29]",
                        "La mémoire procédurale concerne les habiletés [web:35][web:56]",
                        "Une distinction importante oppose mémoire explicite et implicite [web:56][web:61]",
                        "La consolidation stabilise progressivement les traces mnésiques [web:59][web:62]",
                        "La récupération en mémoire à long terme est en partie reconstructive [web:59][web:57]",
                        "L'oubli dépend souvent de l'accès au souvenir et des indices disponibles [web:35][web:59]",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_recap_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_recap_q2",
                },
            ],
        },
        {
            id: "memoire_lt_final_quiz",
            title: "Quiz Final — Mémoire à Long Terme",
            type: "final_quiz",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    content:
                        "Ce quiz final évalue ta compréhension des bases de la mémoire à long terme : ses types, son organisation et ses grands processus de stabilisation et de récupération. [web:35][web:56][web:59]",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q2",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q3",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q4",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q5",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q6",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q7",
                },
                {
                    type: "quiz",
                    questionId: "memoire_lt_final_q8",
                },
            ],
        },
    ],
  };