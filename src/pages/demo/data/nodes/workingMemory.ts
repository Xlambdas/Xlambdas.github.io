import type { NodeType } from "../../types";

export const WorkingMemoryNode: NodeType = {
    id: "memoire_travail",
    title: "Mémoire de Travail",
    type: "concept",
    links: [], // ["administrateur_central", "boucle_phonologique", "calepin_visuospatial", "buffer_episodique"],
    isUnlocked: false,
    prerequisites: ["memoire"],
    branchColor: "#3b82f6",
    hook: "Quand tu fais un calcul mental, suis une phrase longue, gardes une consigne en tête ou compares deux options, tu n'utilises pas seulement un stockage temporaire : tu manipules activement l'information. C'est précisément le rôle de la mémoire de travail.",
    shortDescription:
        "Le système qui maintient et manipule temporairement l'information pendant l'activité mentale.",
    badge: {
        id: "badge_memoire_travail",
        nodeId: "memoire_travail",
        icon: "🧠",
        name: "Chef d'Orchestre Mental",
        description: "Maîtrise des fondements de la mémoire de travail",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "memoire_travail_intro_q1",
            lessonId: "memoire_travail_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire de travail sert surtout à :",
                choices: [
                    "Stocker définitivement les souvenirs autobiographiques",
                    "Maintenir et manipuler temporairement l'information pendant une tâche",
                    "Produire automatiquement des réflexes moteurs",
                    "Remplacer la mémoire à long terme",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire de travail est définie comme le système de stockage temporaire et de manipulation active de l'information nécessaire aux tâches cognitives complexes.",
            },
        },
        {
            id: "memoire_travail_intro_q2",
            lessonId: "memoire_travail_intro",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La mémoire de travail se limite à garder passivement quelques informations pendant quelques secondes.",
                correct: false,
                explanation:
                    "Faux. Elle implique aussi la manipulation active de l'information, pas seulement son maintien temporaire.",
            },
        },

        {
            id: "memoire_travail_role_q1",
            lessonId: "memoire_travail_role",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque activité à l'usage de la mémoire de travail :",
                pairs: [
                    { left: "Calcul mental", right: "Maintenir et transformer des informations" },
                    { left: "Comprendre une phrase longue", right: "Garder le début pendant qu'on traite la suite" },
                    { left: "Prendre une décision", right: "Comparer plusieurs éléments en cours" },
                ],
                explanation:
                    "La mémoire de travail intervient dans de nombreuses tâches où l'information doit être conservée temporairement tout en étant traitée.",
            },
        },
        {
            id: "memoire_travail_role_q2",
            lessonId: "memoire_travail_role",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Laquelle de ces tâches dépend fortement de la mémoire de travail ?",
                choices: [
                    "Reconnaître une odeur familière sans effort",
                    "Additionner plusieurs nombres de tête",
                    "Avoir un réflexe de retrait",
                    "Dormir profondément",
                ],
                correctIndex: 1,
                explanation:
                    "Le calcul mental mobilise fortement le maintien temporaire et la manipulation de l'information.",
            },
        },

        {
            id: "memoire_travail_limites_q1",
            lessonId: "memoire_travail_limites",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "La mémoire de travail est une ressource limitée.",
                correct: true,
                explanation:
                    "Oui. Les sources décrivent la mémoire de travail comme un système de capacité limitée.",
            },
        },
        {
            id: "memoire_travail_limites_q2",
            lessonId: "memoire_travail_limites",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Quand la mémoire de travail est surchargée, on observe souvent :",
                choices: [
                    "Une amélioration automatique de l'apprentissage",
                    "Une diminution possible de la compréhension ou de la performance",
                    "Une disparition de la mémoire à long terme",
                    "Une perception parfaite de toutes les informations",
                ],
                correctIndex: 1,
                explanation:
                    "Lorsque la charge dépasse la capacité de la mémoire de travail, la performance et l'apprentissage peuvent diminuer.",
            },
        },

        {
            id: "memoire_travail_modele_q1",
            lessonId: "memoire_travail_modele",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Le modèle de Baddeley et Hitch décrit la mémoire de travail comme :",
                choices: [
                    "Un seul espace de stockage uniforme",
                    "Un système à plusieurs composantes coordonnées",
                    "Une forme de mémoire procédurale",
                    "Une théorie limitée à la vision",
                ],
                correctIndex: 1,
                explanation:
                    "Le modèle de Baddeley et Hitch propose une mémoire de travail composée de plusieurs sous-systèmes coordonnés.",
            },
        },
        {
            id: "memoire_travail_modele_q2",
            lessonId: "memoire_travail_modele",
            blockIndex: 4,
            question: {
                type: "ordering",
                question: "Remets ces éléments dans une organisation logique du modèle :",
                items: [
                    "Boucle phonologique",
                    "Administrateur central",
                    "Calepin visuospatial",
                    "Buffer épisodique",
                ],
                correctOrder: [1, 0, 2, 3],
                explanation:
                    "L'administrateur central coordonne les sous-systèmes, auxquels s'ajoute le buffer épisodique dans la version étendue du modèle.",
            },
        },

        {
            id: "memoire_travail_admin_q1",
            lessonId: "memoire_travail_admin",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "L'administrateur central sert surtout à :",
                choices: [
                    "Stocker les souvenirs de l'enfance",
                    "Contrôler l'attention et coordonner les autres composantes",
                    "Conserver uniquement les images mentales",
                    "Empêcher toute distraction automatiquement",
                ],
                correctIndex: 1,
                explanation:
                    "L'administrateur central correspond au système de contrôle attentionnel chargé de coordonner les composantes de la mémoire de travail.",
            },
        },
        {
            id: "memoire_travail_admin_q2",
            lessonId: "memoire_travail_admin",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "L'administrateur central est lié à des fonctions comme l'attention, la planification et la mise à jour de l'information.",
                correct: true,
                explanation:
                    "Oui. Les descriptions du modèle lui attribuent des fonctions d'attention, de focalisation, de planification, de mise à jour et de coordination.",
            },
        },

        {
            id: "memoire_travail_boucle_q1",
            lessonId: "memoire_travail_boucle",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La boucle phonologique traite principalement :",
                choices: [
                    "Les informations verbales et sonores",
                    "Les souvenirs émotionnels",
                    "Les gestes appris",
                    "Les odeurs et les goûts",
                ],
                correctIndex: 0,
                explanation:
                    "La boucle phonologique est spécialisée dans le maintien temporaire de l'information verbale et phonologique.",
            },
        },
        {
            id: "memoire_travail_boucle_q2",
            lessonId: "memoire_travail_boucle",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La répétition subvocale aide à maintenir une information dans la boucle phonologique.",
                correct: true,
                explanation:
                    "Oui. Le maintien dans la boucle phonologique repose notamment sur une répétition articulatoire ou subvocale.",
            },
        },

        {
            id: "memoire_travail_visuo_q1",
            lessonId: "memoire_travail_visuo",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Le calepin visuospatial sert surtout à :",
                choices: [
                    "Maintenir des informations visuelles et spatiales",
                    "Stocker les connaissances générales",
                    "Contrôler toute la mémoire à long terme",
                    "Traduire automatiquement les mots en sons",
                ],
                correctIndex: 0,
                explanation:
                    "Le calepin visuospatial maintient temporairement les informations visuelles et spatiales.",
            },
        },
        {
            id: "memoire_travail_visuo_q2",
            lessonId: "memoire_travail_visuo",
            blockIndex: 4,
            question: {
                type: "match_pairs",
                question: "Associe chaque composante au bon type d'information :",
                pairs: [
                    { left: "Boucle phonologique", right: "Verbal et sonore" },
                    { left: "Calepin visuospatial", right: "Visuel et spatial" },
                    { left: "Administrateur central", right: "Contrôle et coordination" },
                ],
                explanation:
                    "Le modèle distingue des sous-systèmes spécialisés selon le type de traitement.",
            },
        },

        {
            id: "memoire_travail_buffer_q1",
            lessonId: "memoire_travail_buffer",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Le buffer épisodique a été ajouté pour expliquer surtout :",
                choices: [
                    "Le stockage des réflexes",
                    "L'intégration d'informations provenant de plusieurs sources",
                    "La disparition de la mémoire de travail",
                    "La lecture automatique des mots",
                ],
                correctIndex: 1,
                explanation:
                    "Le buffer épisodique sert d'espace temporaire d'intégration entre différents sous-systèmes et la mémoire à long terme.",
            },
        },
        {
            id: "memoire_travail_buffer_q2",
            lessonId: "memoire_travail_buffer",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "Le buffer épisodique joue un rôle d'interface entre la mémoire de travail et la mémoire à long terme.",
                correct: true,
                explanation:
                    "Oui. Il est présenté comme un espace temporaire reliant les composantes de la mémoire de travail et la mémoire à long terme.",
            },
        },

        {
            id: "memoire_travail_charge_q1",
            lessonId: "memoire_travail_charge",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La charge cognitive correspond surtout :",
                choices: [
                    "Au nombre total de souvenirs stockés à vie",
                    "À la quantité d'information que la mémoire de travail doit traiter",
                    "À une forme d'émotion intense",
                    "À la vitesse du système nerveux",
                ],
                correctIndex: 1,
                explanation:
                    "La charge cognitive renvoie à la quantité d'information et d'effort de traitement imposés à la mémoire de travail.",
            },
        },
        {
            id: "memoire_travail_charge_q2",
            lessonId: "memoire_travail_charge",
            blockIndex: 4,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de charge cognitive à sa définition :",
                pairs: [
                    { left: "Charge intrinsèque", right: "Difficulté propre à la tâche" },
                    { left: "Charge extrinsèque", right: "Coût causé par une mauvaise présentation ou des distractions" },
                    { left: "Charge germane", right: "Effort utile pour organiser et apprendre" },
                ],
                explanation:
                    "La théorie de la charge cognitive distingue ces trois formes de charge qui mobilisent la mémoire de travail.",
            },
        },

        {
            id: "memoire_travail_apprentissage_q1",
            lessonId: "memoire_travail_apprentissage",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "La mémoire de travail joue un rôle important dans l'apprentissage.",
                correct: true,
                explanation:
                    "Oui. Elle sert de passage pour traiter les nouvelles informations et les relier à la mémoire à long terme.",
            },
        },
        {
            id: "memoire_travail_apprentissage_q2",
            lessonId: "memoire_travail_apprentissage",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces choix aide généralement à ne pas surcharger la mémoire de travail ?",
                choices: [
                    "Ajouter un maximum d'informations inutiles en même temps",
                    "Présenter clairement l'information et réduire les distractions",
                    "Multiplier les tâches concurrentes",
                    "Supprimer toute structure dans l'explication",
                ],
                correctIndex: 1,
                explanation:
                    "Réduire la charge extrinsèque et clarifier l'information aide à préserver les ressources de la mémoire de travail.",
            },
        },

        {
            id: "memoire_travail_pont_q1",
            lessonId: "memoire_travail_pont",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quel futur nœud prolonge le plus naturellement l'étude de l'administrateur central ?",
                choices: [
                    "administrateur_central",
                    "memoire_episodique",
                    "oubli_autobiographique",
                    "habitudes_motrices",
                ],
                correctIndex: 0,
                explanation:
                    "L'administrateur central constitue une branche naturelle à approfondir après l'introduction générale à la mémoire de travail.",
            },
        },
        {
            id: "memoire_travail_pont_q2",
            lessonId: "memoire_travail_pont",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Quel futur nœud prolonge le mieux l'étude du maintien verbal temporaire ?",
                choices: [
                    "boucle_phonologique",
                    "memoire_semantique",
                    "memoire_procedurale",
                    "attention_divisee",
                ],
                correctIndex: 0,
                explanation:
                    "Le maintien verbal temporaire renvoie directement à la boucle phonologique.",
            },
        },

        {
            id: "memoire_travail_recap_q1",
            lessonId: "memoire_travail_recap",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces idées dans un ordre logique d'apprentissage :",
                items: [
                    "Comprendre que la mémoire de travail maintient et manipule l'information",
                    "Découvrir qu'elle est limitée",
                    "Étudier ses composantes",
                    "Voir son rôle dans la charge cognitive et l'apprentissage",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "La progression la plus logique va de la définition générale vers les limites, puis vers le modèle, puis vers ses implications pour l'apprentissage.",
            },
        },
        {
            id: "memoire_travail_recap_q2",
            lessonId: "memoire_travail_recap",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque composante à son rôle principal :",
                pairs: [
                    { left: "Administrateur central", right: "Contrôler et coordonner" },
                    { left: "Boucle phonologique", right: "Maintenir l'information verbale" },
                    { left: "Calepin visuospatial", right: "Maintenir l'information visuelle et spatiale" },
                    { left: "Buffer épisodique", right: "Intégrer plusieurs sources d'information" },
                ],
                explanation:
                    "Ces quatre composantes résument le modèle classique de la mémoire de travail.",
            },
        },

        {
            id: "memoire_travail_final_q1",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "La mémoire de travail se distingue surtout par le fait qu'elle :",
                choices: [
                    "Manipule temporairement l'information en cours de traitement",
                    "Stocke définitivement les souvenirs",
                    "Fonctionne uniquement pour la vision",
                    "Est illimitée en capacité",
                ],
                correctIndex: 0,
                explanation:
                    "Sa spécificité est de maintenir et manipuler temporairement l'information pendant une activité mentale.",
            },
        },
        {
            id: "memoire_travail_final_q2",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "La mémoire de travail est un système à capacité limitée.",
                correct: true,
                explanation:
                    "Oui. C'est une propriété centrale du système dans les modèles contemporains.",
            },
        },
        {
            id: "memoire_travail_final_q3",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quel composant coordonne les autres dans le modèle de Baddeley ?",
                choices: [
                    "Le buffer épisodique",
                    "L'administrateur central",
                    "La mémoire procédurale",
                    "Le stockage sémantique",
                ],
                correctIndex: 1,
                explanation:
                    "L'administrateur central assure le contrôle attentionnel et la coordination des autres composantes.",
            },
        },
        {
            id: "memoire_travail_final_q4",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quelle composante maintient surtout l'information verbale ?",
                choices: [
                    "Le calepin visuospatial",
                    "La boucle phonologique",
                    "L'administrateur central",
                    "Le buffer épisodique",
                ],
                correctIndex: 1,
                explanation:
                    "La boucle phonologique est spécialisée dans le traitement verbal et phonologique.",
            },
        },
        {
            id: "memoire_travail_final_q5",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quelle composante maintient surtout l'information visuelle et spatiale ?",
                choices: [
                    "Le calepin visuospatial",
                    "La boucle phonologique",
                    "La mémoire épisodique",
                    "Le système procédural",
                ],
                correctIndex: 0,
                explanation:
                    "Le calepin visuospatial traite l'information visuelle et spatiale.",
            },
        },
        {
            id: "memoire_travail_final_q6",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "Le buffer épisodique sert à intégrer des informations issues de plusieurs sources.",
                correct: true,
                explanation:
                    "Oui. C'est précisément son rôle dans la version étendue du modèle.",
            },
        },
        {
            id: "memoire_travail_final_q7",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de charge à sa description :",
                pairs: [
                    { left: "Intrinsèque", right: "Difficulté propre au contenu" },
                    { left: "Extrinsèque", right: "Coût lié à une présentation inutilement compliquée" },
                    { left: "Germane", right: "Effort utile pour construire l'apprentissage" },
                ],
                explanation:
                    "La théorie de la charge cognitive aide à comprendre comment la mémoire de travail peut être facilitée ou surchargée.",
            },
        },
        {
            id: "memoire_travail_final_q8",
            lessonId: "memoire_travail_final_quiz",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces étapes dans un ordre logique :",
                items: [
                    "Maintenir temporairement une information",
                    "La manipuler pendant une tâche",
                    "Être limité par la capacité du système",
                    "Faciliter ou gêner l'apprentissage selon la charge",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "La mémoire de travail maintient puis manipule, mais cette activité reste limitée et affecte l'apprentissage.",
            },
        },
    ],
    lessonPath: [
        {
            id: "memoire_travail_intro",
            title: "Qu'est-ce que la mémoire de travail ?",
            type: "vignette",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "vignette",
                    title: "Penser en direct",
                    content:
                        "Tu lis une phrase longue et tu gardes son début en tête pour comprendre sa fin. Tu fais un calcul mental et tu conserves un résultat intermédiaire pendant que tu poursuis l'opération. Tu compares deux idées avant de prendre une décision.\n\nDans tous ces cas, ton esprit ne se contente pas de stocker brièvement une information : il travaille dessus.",
                },
                {
                    type: "explanation",
                    title: "Un espace mental actif",
                    content:
                        "La mémoire de travail est le système qui permet de maintenir temporairement des informations tout en les manipulant. Elle est considérée comme nécessaire à de nombreuses activités cognitives complexes, comme le raisonnement, la compréhension du langage ou l'apprentissage.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire de travail maintient et manipule l'information",
                        "Elle intervient dans le raisonnement, la compréhension et l'apprentissage",
                        "Elle ne se réduit pas à un simple stockage passif",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_role",
            title: "À quoi sert-elle ?",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Une ressource au cœur de l'activité mentale",
                    content:
                        "La mémoire de travail est mobilisée dès qu'une tâche exige de garder des éléments présents à l'esprit pendant qu'on agit dessus. Elle joue donc un rôle central dans le calcul mental, la compréhension de phrases complexes, la résolution de problèmes, la prise de décision et la planification.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_role_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi elle est partout",
                    content:
                        "Dès qu'une activité demande de comparer, mettre à jour, inhiber, ordonner ou combiner des informations, la mémoire de travail entre en jeu. Elle agit comme un espace de traitement temporaire, indispensable pour penser en temps réel.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_role_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire de travail soutient les tâches cognitives complexes",
                        "Elle sert à garder l'information active pendant qu'on la traite",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_limites",
            title: "Une capacité limitée",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Un goulot d'étranglement mental",
                    content:
                        "La mémoire de travail est une ressource limitée. On ne peut pas maintenir et traiter une quantité illimitée d'informations à la fois, ce qui explique pourquoi certaines tâches deviennent rapidement difficiles quand trop d'éléments doivent être gérés simultanément.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_limites_q1",
                },
                {
                    type: "explanation",
                    title: "Quand la surcharge apparaît",
                    content:
                        "Si la quantité d'information ou la complexité de traitement dépasse les capacités du système, la compréhension, la précision ou l'apprentissage peuvent en souffrir. Cette idée est centrale dans l'étude de la charge cognitive.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_limites_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire de travail a une capacité limitée",
                        "Une surcharge peut nuire à la performance et à l'apprentissage",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_modele",
            title: "Le modèle de Baddeley et Hitch",
            type: "explanation",
            estimatedMinutes: 6,
            blocks: [
                {
                    type: "explanation",
                    title: "Plusieurs composantes coordonnées",
                    content:
                        "Le modèle de Baddeley et Hitch a marqué un tournant important en proposant que la mémoire de travail ne soit pas un simple espace unique, mais un système composé de plusieurs éléments spécialisés. Cette approche explique mieux comment différents types d'information peuvent être maintenus et traités en parallèle.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_modele_q1",
                },
                {
                    type: "explanation",
                    title: "Les grandes pièces du système",
                    content:
                        "Le modèle comprend un administrateur central chargé du contrôle attentionnel, une boucle phonologique pour les informations verbales, un calepin visuospatial pour les informations visuelles et spatiales, puis un buffer épisodique ajouté plus tard pour intégrer les informations de sources différentes.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_modele_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le modèle décrit une mémoire de travail à plusieurs composantes",
                        "Chaque composante a un rôle spécifique",
                        "Le buffer épisodique a été ajouté dans une version ultérieure",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_admin",
            title: "L'administrateur central",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Le système de contrôle",
                    content:
                        "L'administrateur central est souvent présenté comme la composante qui dirige l'allocation des ressources attentionnelles. Il ne se contente pas de stocker : il coordonne, sélectionne, met à jour, inhibe et distribue le traitement selon les besoins de la tâche.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_admin_q1",
                },
                {
                    type: "explanation",
                    title: "Un chef d'orchestre imparfait",
                    content:
                        "Cette composante est associée à des fonctions comme l'attention focalisée, la planification, la prise de décision, la séquence d'actions et la mise à jour de l'information. Elle n'est pas illimitée, ce qui explique pourquoi coordonner plusieurs demandes mentales en même temps peut devenir difficile.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_admin_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'administrateur central coordonne les autres composantes",
                        "Il est fortement lié au contrôle attentionnel",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_boucle",
            title: "La boucle phonologique",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Le maintien du verbal",
                    content:
                        "La boucle phonologique est le sous-système spécialisé dans le maintien temporaire des informations verbales et sonores. Elle est particulièrement importante pour retenir un mot, une suite de sons, une consigne verbale ou une phrase pendant un court laps de temps.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_boucle_q1",
                },
                {
                    type: "explanation",
                    title: "Le rôle de la répétition",
                    content:
                        "Le maintien verbal dépend en partie d'une répétition articulatoire ou subvocale. C'est ce mécanisme qui permet, par exemple, de se répéter mentalement un numéro ou une consigne pour éviter qu'elle ne disparaisse trop vite.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_boucle_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La boucle phonologique maintient l'information verbale",
                        "La répétition subvocale aide à maintenir cette information active",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_visuo",
            title: "Le calepin visuospatial",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Le maintien du visuel et du spatial",
                    content:
                        "Le calepin visuospatial permet de maintenir temporairement des images mentales, des formes, des emplacements ou des relations spatiales. Il est mobilisé lorsque tu imagines un trajet, maintiens une position dans l'espace, ou manipules mentalement une configuration visuelle.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_visuo_q1",
                },
                {
                    type: "explanation",
                    title: "Deux canaux spécialisés",
                    content:
                        "Le modèle distingue ainsi deux grands canaux de maintien temporaire : un canal verbal et un canal visuospatial. Cette distinction aide à comprendre pourquoi certaines tâches interfèrent fortement entre elles alors que d'autres coexistent plus facilement.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_visuo_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le calepin visuospatial maintient les informations visuelles et spatiales",
                        "Le modèle distingue un canal verbal et un canal visuospatial",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_buffer",
            title: "Le buffer épisodique",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Assembler des informations différentes",
                    content:
                        "Le buffer épisodique a été introduit plus tard dans le modèle pour expliquer comment plusieurs sources d'information peuvent être liées temporairement dans une représentation cohérente. Il sert d'espace d'intégration entre les systèmes verbaux, visuo-spatiaux et la mémoire à long terme.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_buffer_q1",
                },
                {
                    type: "explanation",
                    title: "Une interface temporaire",
                    content:
                        "Ce composant joue un rôle d'interface : il ne remplace pas la mémoire à long terme, mais il permet d'articuler temporairement différentes informations dans une forme unifiée et consciemment accessible.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_buffer_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le buffer épisodique intègre plusieurs sources d'information",
                        "Il fait le lien entre la mémoire de travail et la mémoire à long terme",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_charge",
            title: "Charge cognitive",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Quand le système sature",
                    content:
                        "Comme la mémoire de travail est limitée, elle peut être surchargée si trop d'informations, trop de complexité ou trop de distractions s'accumulent en même temps. La théorie de la charge cognitive cherche précisément à décrire ces contraintes.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_charge_q1",
                },
                {
                    type: "explanation",
                    title: "Trois types de charge",
                    content:
                        "On distingue souvent une charge intrinsèque, liée à la difficulté propre de la tâche, une charge extrinsèque, causée par une mauvaise présentation ou des distractions inutiles, et une charge germane, liée à l'effort utile de structuration et d'apprentissage.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_charge_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La charge cognitive dépend de ce que la mémoire de travail doit traiter",
                        "On distingue charge intrinsèque, extrinsèque et germane",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_apprentissage",
            title: "Mémoire de travail et apprentissage",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Un passage obligé pour apprendre",
                    content:
                        "Les nouvelles informations passent par la mémoire de travail lorsqu'elles sont activement traitées. C'est là qu'elles peuvent être comprises, organisées, comparées à des connaissances antérieures, puis reliées à la mémoire à long terme. Si la mémoire de travail est surchargée, ce processus devient plus difficile, ce qui peut nuire à l'apprentissage.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_apprentissage_q1",
                },
                {
                    type: "explanation",
                    title: "Mieux présenter pour mieux apprendre",
                    content:
                        "Si l'information est mal organisée, trop dense, ou accompagnée de distractions inutiles, la mémoire de travail se surcharge plus facilement. À l'inverse, une présentation claire, structurée et progressive aide à préserver ses ressources et favorise l'apprentissage.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_apprentissage_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire de travail joue un rôle central dans l'apprentissage",
                        "Réduire la charge extrinsèque aide à mieux apprendre",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_pont",
            title: "Vers les composantes spécialisées",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Un nœud fondation",
                    content:
                        "Ce nœud introduit la mémoire de travail comme système global. Il prépare ensuite l'étude détaillée de ses composantes, chacune pouvant devenir un nœud spécialisé : administrateur central, boucle phonologique, calepin visuospatial et buffer épisodique.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_pont_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi décomposer le système",
                    content:
                        "Cette décomposition permet de comprendre plus finement pourquoi certaines tâches verbales interfèrent entre elles, pourquoi les tâches spatiales ont leurs propres contraintes, et comment le contrôle attentionnel coordonne l'ensemble.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_pont_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le nœud prépare l'étude détaillée des composantes du modèle",
                        "Chaque composante peut devenir une branche spécialisée",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_recap",
            title: "Récapitulatif",
            type: "recap",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "La mémoire de travail maintient et manipule temporairement l'information",
                        "Elle joue un rôle central dans le raisonnement, la compréhension et l'apprentissage",
                        "Elle est limitée en capacité",
                        "Le modèle de Baddeley et Hitch décrit plusieurs composantes coordonnées",
                        "L'administrateur central contrôle et coordonne",
                        "La boucle phonologique traite le verbal",
                        "Le calepin visuospatial traite le visuel et le spatial",
                        "Le buffer épisodique intègre plusieurs sources d'information",
                        "La charge cognitive influence fortement les performances et l'apprentissage",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_recap_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_recap_q2",
                },
            ],
        },
        {
            id: "memoire_travail_final_quiz",
            title: "Quiz Final — Mémoire de Travail",
            type: "final_quiz",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    content:
                        "Ce quiz final vérifie ta compréhension des concepts essentiels de la mémoire de travail : sa fonction, ses limites, ses composantes et son rôle dans l'apprentissage.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q2",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q3",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q4",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q5",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q6",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q7",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_final_q8",
                },
            ],
        },
    ],
};