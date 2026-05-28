import type { NodeType } from "../../types";

export const MemoryNode: NodeType = {
    id: "memoire",
    title: "Mémoire",
    type: "topic",
    links: ["memoire_travail", "memoire_long_terme"],
    isUnlocked: false,
    prerequisites: ["psychologie"],
    branchColor: "#3b82f6",
    hook: "Sans mémoire, impossible d'apprendre, de reconnaître un visage, de suivre une conversation ou même de finir une phrase. La mémoire n'est pas un simple stockage passif : c'est un système complexe qui encode, organise, conserve et reconstruit l'information.",
    shortDescription:
        "Introduction aux grands systèmes de mémoire, à leur fonctionnement et à leurs limites.",
    badge: {
        id: "badge_memoire",
        nodeId: "memoire",
        icon: "🧩",
        name: "Architecte du Souvenir",
        description: "Maîtrise des fondements de la mémoire en psychologie",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "memoire_intro_q1",
            lessonId: "memoire_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "En psychologie, la mémoire désigne surtout :",
                choices: [
                    "Une capacité à réciter mécaniquement des informations",
                    "Un ensemble de processus permettant d'encoder, stocker et récupérer l'information",
                    "Un stock fixe de souvenirs enregistrés une fois pour toutes",
                    "Une forme de perception différée",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire est classiquement décrite comme un ensemble de processus impliquant l'encodage, le stockage et la récupération de l'information.",
            },
        },
        {
            id: "memoire_intro_q2",
            lessonId: "memoire_intro",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La mémoire fonctionne comme une simple copie fidèle du passé.",
                correct: false,
                explanation:
                    "Faux. La mémoire n'est pas un enregistrement passif ; elle dépend de l'encodage, de l'organisation et de la récupération, ce qui la rend reconstructive.",
            },
        },

        {
            id: "memoire_processus_q1",
            lessonId: "memoire_processus",
            blockIndex: 2,
            question: {
                type: "ordering",
                question:
                    "Remets dans l'ordre les grandes étapes du fonctionnement mnésique :",
                items: [
                    "Récupération",
                    "Encodage",
                    "Stockage",
                ],
                correctOrder: [1, 2, 0],
                explanation:
                    "Le schéma général est : encodage, stockage, puis récupération.",
            },
        },
        {
            id: "memoire_processus_q2",
            lessonId: "memoire_processus",
            blockIndex: 4,
            question: {
                type: "match_pairs",
                question: "Associe chaque processus à sa définition :",
                pairs: [
                    { left: "Encodage", right: "Transformer l'information en une forme traitable" },
                    { left: "Stockage", right: "Maintenir l'information dans le temps" },
                    { left: "Récupération", right: "Accéder à l'information lorsque nécessaire" },
                ],
                explanation:
                    "Ces trois processus structurent la plupart des théories générales de la mémoire.",
            },
        },

        {
            id: "memoire_encodage_q1",
            lessonId: "memoire_encodage",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces modes d'encodage est généralement le plus important pour la mémoire à long terme ?",
                choices: [
                    "L'encodage acoustique",
                    "L'encodage sémantique",
                    "L'encodage purement visuel",
                    "L'encodage réflexe",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire à long terme repose fortement sur un encodage sémantique, c'est-à-dire lié au sens.",
            },
        },
        {
            id: "memoire_encodage_q2",
            lessonId: "memoire_encodage",
            blockIndex: 3,
            question: {
                type: "word_bank",
                question: "Complète la phrase :",
                sentence:
                    "Un bon encodage consiste souvent à relier une nouvelle information à son ___ plutôt qu'à sa simple forme sonore.",
                bank: ["sens", "couleur", "volume", "hasard"],
                correctWords: ["sens"],
                explanation:
                    "L'encodage par le sens favorise généralement une meilleure mémorisation à long terme.",
            },
        },

        {
            id: "memoire_stockage_q1",
            lessonId: "memoire_stockage",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quelle distinction est la plus classique concernant le stockage de l'information ?",
                choices: [
                    "Stockage moteur vs stockage émotionnel",
                    "Mémoire courte durée / mémoire à long terme",
                    "Mémoire visuelle / mémoire verbale uniquement",
                    "Stockage conscient / stockage inconscient uniquement",
                ],
                correctIndex: 1,
                explanation:
                    "Une distinction classique oppose les systèmes de stockage à court terme et à long terme.",
            },
        },
        {
            id: "memoire_stockage_q2",
            lessonId: "memoire_stockage",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "La mémoire à long terme est généralement considérée comme beaucoup plus durable que la mémoire à court terme.",
                correct: true,
                explanation:
                    "Oui. La mémoire à court terme est brève, alors que la mémoire à long terme peut durer très longtemps.",
            },
        },

        {
            id: "memoire_recuperation_q1",
            lessonId: "memoire_recuperation",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "Oublier quelque chose signifie toujours que l'information n'a jamais été stockée.",
                correct: false,
                explanation:
                    "Faux. L'échec peut venir d'un problème de récupération et non d'une absence totale de stockage.",
            },
        },
        {
            id: "memoire_recuperation_q2",
            lessonId: "memoire_recuperation",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel énoncé décrit le mieux la récupération ?",
                choices: [
                    "La transformation initiale de l'information",
                    "Le maintien automatique de toute trace mnésique",
                    "L'accès à une information stockée au moment où l'on en a besoin",
                    "La répétition silencieuse d'un mot",
                ],
                correctIndex: 2,
                explanation:
                    "La récupération correspond à l'accès à l'information stockée.",
            },
        },

        {
            id: "memoire_court_terme_q1",
            lessonId: "memoire_court_terme",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire à court terme se caractérise surtout par :",
                choices: [
                    "Une grande capacité illimitée",
                    "Une durée brève et une capacité limitée",
                    "Une conservation permanente",
                    "Une spécialisation exclusive pour les souvenirs personnels",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire à court terme est brève et limitée en capacité.",
            },
        },
        {
            id: "memoire_court_terme_q2",
            lessonId: "memoire_court_terme",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La mémoire à court terme peut conserver une petite quantité d'information pendant quelques secondes seulement si rien n'est fait pour la maintenir.",
                correct: true,
                explanation:
                    "Oui. Sans maintien, l'information en mémoire à court terme disparaît rapidement.",
            },
        },

        {
            id: "memoire_travail_intro_q1",
            lessonId: "memoire_travail_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire de travail se distingue de la simple mémoire à court terme parce qu'elle :",
                choices: [
                    "Stocke uniquement des images",
                    "Permet de maintenir et de manipuler l'information pour accomplir une tâche",
                    "Fonctionne seulement pendant le sommeil",
                    "Correspond à la mémoire autobiographique",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire de travail ne se limite pas au stockage temporaire : elle implique aussi le traitement actif de l'information.",
            },
        },
        {
            id: "memoire_travail_intro_q2",
            lessonId: "memoire_travail_intro",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "La mémoire de travail est utile pour le raisonnement, la compréhension du langage et l'apprentissage.",
                correct: true,
                explanation:
                    "Oui. Elle est impliquée dans de nombreuses activités cognitives complexes comme le raisonnement, l'apprentissage et la compréhension.",
            },
        },

        {
            id: "memoire_baddeley_q1",
            lessonId: "memoire_baddeley",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque composant du modèle de Baddeley à sa fonction principale :",
                pairs: [
                    { left: "Administrateur central", right: "Contrôle attentionnel et coordination" },
                    { left: "Boucle phonologique", right: "Maintien de l'information verbale" },
                    { left: "Calepin visuospatial", right: "Maintien de l'information visuelle et spatiale" },
                ],
                explanation:
                    "Le modèle de Baddeley distingue plusieurs composantes spécialisées coordonnées par un système central.",
            },
        },
        {
            id: "memoire_baddeley_q2",
            lessonId: "memoire_baddeley",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel composant a été ajouté plus tard au modèle de Baddeley ?",
                choices: [
                    "Le buffer épisodique",
                    "La mémoire procédurale",
                    "Le stockage sémantique",
                    "Le système limbique",
                ],
                correctIndex: 0,
                explanation:
                    "Une version plus récente du modèle ajoute le buffer épisodique.",
            },
        },

        {
            id: "memoire_long_terme_intro_q1",
            lessonId: "memoire_long_terme_intro",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "La mémoire à long terme est généralement considérée comme un système unique et homogène.",
                correct: false,
                explanation:
                    "Faux. La mémoire à long terme comprend plusieurs sous-systèmes.",
            },
        },
        {
            id: "memoire_long_terme_intro_q2",
            lessonId: "memoire_long_terme_intro",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Quelle grande distinction est souvent utilisée pour la mémoire à long terme ?",
                choices: [
                    "Mémoire claire / mémoire obscure",
                    "Mémoire explicite / mémoire implicite",
                    "Mémoire rapide / mémoire lente",
                    "Mémoire centrale / mémoire périphérique",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire à long terme est souvent divisée entre mémoire explicite et implicite.",
            },
        },

        {
            id: "memoire_episodique_semantique_q1",
            lessonId: "memoire_episodique_semantique",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de mémoire à son contenu principal :",
                pairs: [
                    { left: "Mémoire épisodique", right: "Souvenirs d'événements vécus" },
                    { left: "Mémoire sémantique", right: "Connaissances générales et significations" },
                    { left: "Mémoire procédurale", right: "Savoir-faire et habiletés" },
                ],
                explanation:
                    "Ces distinctions permettent de comprendre que la mémoire à long terme n'est pas un bloc unique.",
            },
        },
        {
            id: "memoire_episodique_semantique_q2",
            lessonId: "memoire_episodique_semantique",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces exemples correspond le mieux à une mémoire sémantique ?",
                choices: [
                    "Se souvenir de son dernier anniversaire",
                    "Savoir que Paris est la capitale de la France",
                    "Faire du vélo sans y penser",
                    "Répéter un numéro dans sa tête",
                ],
                correctIndex: 1,
                explanation:
                    "La mémoire sémantique concerne les faits, concepts et connaissances générales.",
            },
        },

        {
            id: "memoire_procedurale_q1",
            lessonId: "memoire_procedurale",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La mémoire procédurale concerne surtout :",
                choices: [
                    "Les souvenirs datés et personnels",
                    "Les connaissances encyclopédiques",
                    "Les habiletés et savoir-faire automatisés",
                    "Les capacités de répétition immédiate",
                ],
                correctIndex: 2,
                explanation:
                    "La mémoire procédurale renvoie au 'savoir comment faire', souvent peu conscient.",
            },
        },
        {
            id: "memoire_procedurale_q2",
            lessonId: "memoire_procedurale",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La mémoire procédurale est souvent moins consciente que la mémoire épisodique.",
                correct: true,
                explanation:
                    "Oui. Les souvenirs procéduraux sont souvent peu accessibles à l'introspection consciente.",
            },
        },

        {
            id: "memoire_oubli_q1",
            lessonId: "memoire_oubli",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces énoncés décrit le mieux l'oubli dans une perspective psychologique ?",
                choices: [
                    "C'est toujours la preuve qu'aucun apprentissage n'a eu lieu",
                    "Cela peut venir d'un problème d'encodage, de stockage ou de récupération",
                    "Cela signifie toujours une atteinte cérébrale",
                    "Cela concerne uniquement la mémoire à long terme",
                ],
                correctIndex: 1,
                explanation:
                    "L'oubli peut survenir à différents stades du fonctionnement mnésique.",
            },
        },
        {
            id: "memoire_oubli_q2",
            lessonId: "memoire_oubli",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Une information peut être présente en mémoire mais inaccessible momentanément.",
                correct: true,
                explanation:
                    "Oui. Un échec de récupération ne signifie pas nécessairement disparition totale de la trace.",
            },
        },

        {
            id: "memoire_indices_q1",
            lessonId: "memoire_indices",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Pourquoi les indices de récupération sont-ils importants ?",
                choices: [
                    "Parce qu'ils remplacent totalement l'encodage",
                    "Parce qu'ils peuvent faciliter l'accès à une information stockée",
                    "Parce qu'ils empêchent toute erreur de mémoire",
                    "Parce qu'ils augmentent automatiquement la capacité de la mémoire de travail",
                ],
                correctIndex: 1,
                explanation:
                    "Des indices de récupération adaptés peuvent aider à retrouver une information stockée.",
            },
        },
        {
            id: "memoire_indices_q2",
            lessonId: "memoire_indices",
            blockIndex: 3,
            question: {
                type: "word_bank",
                question: "Complète la phrase :",
                sentence:
                    "La récupération est facilitée quand l'encodage a laissé des ___ efficaces permettant de retrouver l'information.",
                bank: ["indices", "reflexes", "erreurs", "obstacles"],
                correctWords: ["indices"],
                explanation:
                    "Les indices de récupération sont essentiels pour accéder à l'information mémorisée.",
            },
        },

        {
            id: "memoire_organisation_q1",
            lessonId: "memoire_organisation",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "La manière dont l'information est organisée influence la récupération.",
                correct: true,
                explanation:
                    "Oui. L'organisation de l'information peut faciliter l'accès ultérieur en mémoire.",
            },
        },
        {
            id: "memoire_organisation_q2",
            lessonId: "memoire_organisation",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel principe améliore généralement la mémorisation ?",
                choices: [
                    "Traiter toutes les informations comme des éléments isolés",
                    "Organiser et relier les informations entre elles",
                    "Éviter toute association avec les connaissances antérieures",
                    "Répéter au hasard sans structure",
                ],
                correctIndex: 1,
                explanation:
                    "L'organisation et les associations facilitent souvent l'encodage et la récupération.",
            },
        },

        {
            id: "memoire_recap_q1",
            lessonId: "memoire_recap",
            blockIndex: 1,
            question: {
                type: "ordering",
                question:
                    "Remets ces idées dans un ordre logique d'apprentissage :",
                items: [
                    "Comprendre les processus de base",
                    "Distinguer les grands systèmes de mémoire",
                    "Identifier les facteurs de récupération et d'oubli",
                    "Préparer l'étude détaillée de la mémoire de travail et de la mémoire à long terme",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "La progression va des processus généraux aux systèmes, puis aux difficultés de récupération, avant les branches spécialisées.",
            },
        },
        {
            id: "memoire_recap_q2",
            lessonId: "memoire_recap",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque notion à son idée centrale :",
                pairs: [
                    { left: "Encodage sémantique", right: "Traitement par le sens" },
                    { left: "Mémoire de travail", right: "Maintien et manipulation temporaires" },
                    { left: "Mémoire épisodique", right: "Événements personnellement vécus" },
                    { left: "Mémoire procédurale", right: "Habiletés automatisées" },
                ],
                explanation:
                    "Ces notions résument plusieurs axes essentiels du nœud.",
            },
        },
    ],
    lessonPath: [
        {
            id: "memoire_intro",
            title: "Qu'est-ce que la mémoire ?",
            type: "vignette",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "vignette",
                    title: "Un monde sans mémoire",
                    content:
                        "Tu ouvres les yeux, tu reconnais la pièce, tu sais qui tu es, tu poursuis une conversation commencée il y a quelques secondes et tu te rappelles ce que tu dois faire dans une heure. Tout cela paraît banal. Pourtant, sans mémoire, aucune de ces actions ne tiendrait ensemble.\n\nLa mémoire ne sert pas seulement à 'se souvenir'. Elle rend possible la continuité de l'expérience.",
                },
                {
                    type: "explanation",
                    title: "Un système, pas une boîte",
                    content:
                        "En psychologie, la mémoire n'est pas un simple endroit où l'on dépose des informations. C'est un ensemble de processus qui permettent d'encoder l'information, de la stocker, puis de la récupérer plus tard.\n\nAutrement dit, se souvenir n'est pas juste conserver : c'est transformer, maintenir et retrouver.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire est un ensemble de processus, pas un simple stock passif",
                        "Elle implique encodage, stockage et récupération",
                        "Elle rend possible la continuité de l'expérience mentale",
                    ],
                },
            ],
        },
        {
            id: "memoire_processus",
            title: "Les trois grands processus",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Trois étapes fondamentales",
                    content:
                        "Les théories générales de la mémoire distinguent souvent trois grands processus.\n\nD'abord, l'**encodage** : l'information est transformée dans un format que le système peut traiter. Ensuite, le **stockage** : cette information est maintenue dans le temps. Enfin, la **récupération** : elle redevient accessible au moment opportun.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_processus_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi cette distinction est utile",
                    content:
                        "Cette distinction permet de comprendre qu'un échec de mémoire n'a pas toujours la même origine. Parfois, l'information a été mal encodée. Parfois, elle n'a pas été maintenue. Parfois encore, elle est présente mais difficile à récupérer.\n\nComprendre la mémoire, c'est donc comprendre à quel niveau le système fonctionne — ou échoue.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_processus_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire repose sur encodage, stockage et récupération",
                        "Ces étapes permettent de diagnostiquer différents types d'échec mnésique",
                    ],
                },
            ],
        },
        {
            id: "memoire_encodage",
            title: "Comment l'information est encodée",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Entrer dans le système",
                    content:
                        "Pour être mémorisée, une information doit d'abord être encodée. Cela signifie qu'elle doit être transformée en un format exploitable par le système mnésique.\n\nL'encodage peut être visuel, acoustique ou sémantique. Mais tous ces encodages ne se valent pas selon le type de mémoire concerné.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_encodage_q1",
                },
                {
                    type: "explanation",
                    title: "Le rôle du sens",
                    content:
                        "Pour la mémoire à long terme, l'encodage sémantique — c'est-à-dire lié au sens — joue un rôle particulièrement important. Une information comprise, reliée à des connaissances existantes et organisée de manière signifiante a plus de chances d'être retenue durablement qu'une simple suite de sons ou de formes.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_encodage_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'encodage transforme l'information en format traitable",
                        "Il peut être visuel, acoustique ou sémantique",
                        "L'encodage par le sens favorise souvent la mémoire à long terme",
                    ],
                },
            ],
        },
        {
            id: "memoire_stockage",
            title: "Conserver l'information",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Combien de temps, combien d'éléments ?",
                    content:
                        "Le stockage soulève plusieurs questions : où l'information est-elle maintenue, combien de temps, avec quelle capacité, et sous quelle forme ?\n\nUne distinction classique oppose la mémoire à court terme, brève et limitée, à la mémoire à long terme, beaucoup plus durable et vaste.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_stockage_q1",
                },
                {
                    type: "explanation",
                    title: "Deux échelles très différentes",
                    content:
                        "La mémoire à court terme conserve une petite quantité d'information pendant une durée limitée. La mémoire à long terme, elle, peut conserver des connaissances, souvenirs et compétences pendant des périodes très longues, parfois toute la vie.\n\nCette différence de durée et de capacité est l'une des bases de la psychologie de la mémoire.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_stockage_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le stockage concerne durée, capacité et maintien de l'information",
                        "La mémoire à court terme est limitée et brève",
                        "La mémoire à long terme est bien plus durable",
                    ],
                },
            ],
        },
        {
            id: "memoire_recuperation",
            title: "Retrouver une information",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Se souvenir, c'est accéder",
                    content:
                        "La récupération correspond au fait d'accéder à une information stockée lorsque la situation l'exige. C'est souvent à ce stade que l'on constate l'échec mnésique : on a l'impression de 'savoir' quelque chose sans réussir à y accéder immédiatement.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_recuperation_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi récupérer est difficile",
                    content:
                        "Ne pas se rappeler une information ne signifie pas forcément qu'elle n'a jamais été apprise. Il est possible qu'elle ait été encodée et stockée, mais qu'aucun bon indice ne permette de la retrouver à ce moment-là.\n\nLa mémoire dépend donc autant de l'accès que de la conservation.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_recuperation_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La récupération est l'accès à une information stockée",
                        "Un oubli apparent peut venir d'un problème d'accès",
                    ],
                },
            ],
        },
        {
            id: "memoire_court_terme",
            title: "La mémoire à court terme",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Une mémoire fragile",
                    content:
                        "La mémoire à court terme correspond à la conservation brève d'une petite quantité d'information. Elle permet par exemple de retenir un numéro pendant quelques secondes ou de garder en tête le début d'une phrase pendant qu'on en entend la fin.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_court_terme_q1",
                },
                {
                    type: "explanation",
                    title: "Limite de durée et de capacité",
                    content:
                        "Cette mémoire est limitée à la fois en durée et en capacité. Si l'information n'est pas maintenue activement ou transformée, elle disparaît rapidement.\n\nC'est cette fragilité qui a conduit les chercheurs à distinguer plus finement mémoire à court terme et mémoire de travail.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_court_terme_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire à court terme conserve peu d'éléments pendant peu de temps",
                        "Elle est utile mais très fragile",
                        "Sa limitation a préparé les modèles de mémoire de travail",
                    ],
                },
            ],
        },
        {
            id: "memoire_travail_intro",
            title: "De la mémoire courte à la mémoire de travail",
            type: "explanation",
            estimatedMinutes: 6,
            blocks: [
                {
                    type: "explanation",
                    title: "Un système actif",
                    content:
                        "La mémoire de travail ne correspond pas seulement à garder des informations quelques secondes. Elle permet de maintenir temporairement des informations tout en les utilisant pour raisonner, comprendre, calculer ou apprendre.\n\nC'est pour cela qu'elle est au centre de nombreuses activités cognitives complexes.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_intro_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi elle est si importante",
                    content:
                        "Lire une phrase longue, résoudre un problème mentalement, suivre une explication, comparer plusieurs options : toutes ces tâches mobilisent la mémoire de travail. Elle forme une interface entre le maintien temporaire et le traitement actif de l'information.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire de travail maintient et manipule l'information",
                        "Elle joue un rôle central dans le raisonnement et l'apprentissage",
                    ],
                },
            ],
        },
        {
            id: "memoire_baddeley",
            title: "Le modèle de Baddeley",
            type: "explanation",
            estimatedMinutes: 6,
            blocks: [
                {
                    type: "explanation",
                    title: "Un modèle à plusieurs composantes",
                    content:
                        "Le modèle de Baddeley et Hitch propose que la mémoire de travail ne soit pas un système unique, mais un ensemble de composantes coordonnées.\n\nL'administrateur central assure le contrôle attentionnel. La boucle phonologique maintient les informations verbales. Le calepin visuospatial maintient les informations visuelles et spatiales. Plus tard, un buffer épisodique a été ajouté pour intégrer différentes sources d'information.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_baddeley_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi ce modèle a compté",
                    content:
                        "Ce modèle a permis de dépasser l'idée d'une simple mémoire à court terme unitaire. Il explique mieux comment différentes formes d'information peuvent être maintenues en parallèle et coordonnées pour accomplir une tâche.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_baddeley_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le modèle de Baddeley distingue plusieurs composantes de la mémoire de travail",
                        "L'administrateur central coordonne les sous-systèmes",
                        "Le buffer épisodique a été ajouté dans une version ultérieure",
                    ],
                },
            ],
        },
        {
            id: "memoire_long_terme_intro",
            title: "La mémoire à long terme",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Un système vaste, mais non unique",
                    content:
                        "La mémoire à long terme n'est pas un simple entrepôt homogène. Elle regroupe plusieurs types de contenus et plusieurs formes de connaissance.\n\nOn distingue souvent une mémoire explicite, accessible consciemment, et une mémoire implicite, plus liée aux habitudes et aux savoir-faire.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_long_terme_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_long_terme_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire à long terme est multiple et organisée",
                        "Une distinction importante oppose mémoire explicite et implicite",
                    ],
                },
            ],
        },
        {
            id: "memoire_episodique_semantique",
            title: "Épisodique, sémantique, procédurale",
            type: "explanation",
            estimatedMinutes: 6,
            blocks: [
                {
                    type: "explanation",
                    title: "Trois grands contenus",
                    content:
                        "Parmi les grands systèmes de mémoire à long terme, on distingue souvent la mémoire épisodique, la mémoire sémantique et la mémoire procédurale.\n\nLa mémoire épisodique concerne les événements vécus. La mémoire sémantique concerne les faits et connaissances générales. La mémoire procédurale concerne les habiletés et savoir-faire.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_episodique_semantique_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi cette distinction est importante",
                    content:
                        "Ces types de mémoire n'ont pas les mêmes contenus, ni le même rapport à la conscience. Se souvenir d'un dîner, savoir ce qu'est une capitale, ou faire du vélo ne mobilisent pas exactement le même système.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_episodique_semantique_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire épisodique porte sur les événements vécus",
                        "La mémoire sémantique porte sur les connaissances générales",
                        "La mémoire procédurale porte sur les habiletés et savoir-faire",
                    ],
                },
            ],
        },
        {
            id: "memoire_procedurale",
            title: "La mémoire des savoir-faire",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Savoir faire sans forcément savoir dire",
                    content:
                        "La mémoire procédurale concerne les compétences acquises par la pratique : faire du vélo, taper au clavier, jouer d'un instrument, lacer ses chaussures.\n\nElle correspond à un 'savoir comment', souvent moins conscient et moins verbalisable que les souvenirs épisodiques ou les connaissances sémantiques.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_procedurale_q1",
                },
                {
                    type: "explanation",
                    title: "Une mémoire souvent silencieuse",
                    content:
                        "On peut très bien exécuter une action complexe sans être capable d'expliquer précisément toutes les étapes qui la composent. C'est ce caractère souvent implicite qui distingue fortement la mémoire procédurale d'autres formes de mémoire à long terme.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_procedurale_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire procédurale concerne les habiletés et savoir-faire",
                        "Elle est souvent moins consciente que la mémoire épisodique",
                    ],
                },
            ],
        },
        {
            id: "memoire_oubli",
            title: "Pourquoi oublie-t-on ?",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "L'oubli n'a pas une seule cause",
                    content:
                        "Oublier ne signifie pas toujours que l'information n'a jamais existé en mémoire. L'échec peut venir d'un encodage insuffisant, d'un stockage fragile, ou d'une récupération difficile.\n\nL'oubli est donc un phénomène complexe, et non une simple 'disparition magique' du souvenir.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_oubli_q1",
                },
                {
                    type: "explanation",
                    title: "Présent mais inaccessible",
                    content:
                        "Certaines informations semblent introuvables à un moment donné, puis reviennent plus tard grâce à un contexte, un indice ou une association. Cela montre qu'un oubli apparent peut correspondre à un problème d'accès plutôt qu'à une perte définitive.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_oubli_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'oubli peut provenir de plusieurs niveaux du système mnésique",
                        "Un échec de récupération n'est pas toujours une perte totale",
                    ],
                },
            ],
        },
        {
            id: "memoire_indices",
            title: "Le rôle des indices de récupération",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Retrouver grâce à un repère",
                    content:
                        "La récupération est souvent facilitée par des indices : un mot, un lieu, une image, une odeur, une association, une question bien formulée.\n\nCes éléments servent de points d'entrée dans le réseau de traces mnésiques.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_indices_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi l'indice dépend de l'encodage",
                    content:
                        "Un bon indice n'est pas magique : il fonctionne parce qu'il est relié à la manière dont l'information a été encodée. Plus l'encodage est riche, organisé et significatif, plus les chemins de récupération sont nombreux.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_indices_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Les indices de récupération facilitent l'accès à l'information",
                        "Ils sont d'autant plus utiles que l'encodage a été riche et structuré",
                    ],
                },
            ],
        },
        {
            id: "memoire_organisation",
            title: "Pourquoi organiser aide à mémoriser",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "La mémoire aime les relations",
                    content:
                        "Une information isolée est souvent plus difficile à retenir qu'une information reliée à d'autres. Organiser, regrouper, associer, hiérarchiser ou relier à des connaissances existantes facilite à la fois l'encodage et la récupération.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_organisation_q1",
                },
                {
                    type: "explanation",
                    title: "De l'organisation à l'apprentissage",
                    content:
                        "C'est pour cette raison que les techniques de mémorisation efficaces passent rarement par la répétition aveugle seule. Elles s'appuient souvent sur le sens, les associations et la structure.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_organisation_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'organisation de l'information aide la récupération",
                        "Relier les informations entre elles améliore souvent la mémorisation",
                    ],
                },
            ],
        },
        {
            id: "memoire_recap",
            title: "Récapitulatif",
            type: "recap",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "La mémoire implique encodage, stockage et récupération",
                        "L'encodage sémantique est central pour la mémoire à long terme",
                        "La mémoire à court terme est brève et limitée",
                        "La mémoire de travail maintient et manipule l'information",
                        "Le modèle de Baddeley distingue plusieurs composantes de la mémoire de travail",
                        "La mémoire à long terme comprend différents systèmes, dont l'épisodique, la sémantique et la procédurale",
                        "L'oubli peut venir d'un problème d'encodage, de stockage ou de récupération",
                        "Les indices et l'organisation facilitent la récupération",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "memoire_recap_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_recap_q2",
                },
            ],
        },
        {
            id: "memoire_final_quiz",
            title: "Quiz Final — Mémoire",
            type: "final_quiz",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    content:
                        "Ce quiz final vérifie ta compréhension des grands systèmes de mémoire et des processus qui les organisent. Il réactive les notions essentielles du module avant les nœuds plus spécialisés.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_processus_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_encodage_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_stockage_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_recuperation_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_court_terme_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_travail_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_baddeley_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_long_terme_intro_q2",
                },
                {
                    type: "quiz",
                    questionId: "memoire_episodique_semantique_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_procedurale_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_oubli_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_indices_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_organisation_q2",
                },
            ],
        },
    ],
};