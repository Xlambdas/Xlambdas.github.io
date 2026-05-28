import type { NodeType } from "../graphData";

export const NeuroscienceNode: NodeType = {
    id: "neurosciences",
    title: "Neurosciences",
    type: "domain",
    links: [], // ["neurone", "synapse", "lobes_cerveau", "neuroimagerie"],
    isUnlocked: true,
    prerequisites: [],
    branchColor: "#8b5cf6",
    hook: "Tout ce que tu penses, ressens, perçois ou fais dépend d'un immense réseau de cellules qui communiquent par signaux électriques et chimiques. Les neurosciences étudient précisément comment le cerveau, les neurones et leurs connexions rendent possibles le comportement et la cognition.",
    shortDescription:
        "L'étude scientifique du cerveau, des neurones et des mécanismes biologiques de l'esprit.",
    badge: {
        id: "badge_neurosciences",
        nodeId: "neurosciences",
        icon: "🧬",
        name: "Cartographe du Cerveau",
        description: "Maîtrise des fondements des neurosciences",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "neurosciences_intro_q1",
            lessonId: "neurosciences_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Les neurosciences étudient principalement :",
                choices: [
                    "Les planètes et les étoiles",
                    "Le système nerveux et le cerveau",
                    "Uniquement les muscles",
                    "Seulement les émotions sociales",
                ],
                correctIndex: 1,
                explanation:
                    "Les neurosciences ont pour objet d'étude le système nerveux, en particulier le cerveau, ses cellules et ses circuits.",
            },
        },
        {
            id: "neurosciences_intro_q2",
            lessonId: "neurosciences_intro",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "Les neurosciences servent de base biologique pour comprendre la cognition.",
                correct: true,
                explanation:
                    "Oui. Elles permettent de relier les fonctions mentales à des mécanismes biologiques, cellulaires et cérébraux.",
            },
        },

        {
            id: "neurosciences_systeme_q1",
            lessonId: "neurosciences_systeme",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque partie du système nerveux à sa description :",
                pairs: [
                    { left: "Système nerveux central", right: "Cerveau et moelle épinière" },
                    { left: "Système nerveux périphérique", right: "Nerfs et structures hors cerveau/moelle" },
                    { left: "Neurones sensoriels", right: "Apportent l'information vers le système nerveux central" },
                ],
                explanation:
                    "Le système nerveux central comprend le cerveau et la moelle épinière, tandis que le système périphérique relie le reste du corps à ce centre de traitement.",
            },
        },
        {
            id: "neurosciences_systeme_q2",
            lessonId: "neurosciences_systeme",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Le système nerveux périphérique comprend des éléments situés hors du cerveau et de la moelle épinière.",
                correct: true,
                explanation:
                    "Oui. C'est précisément ce qui distingue le système nerveux périphérique du système nerveux central.",
            },
        },

        {
            id: "neurosciences_cellules_q1",
            lessonId: "neurosciences_cellules",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quelles sont les deux grandes catégories de cellules mises en avant dans le système nerveux ?",
                choices: [
                    "Neurones et glies",
                    "Muscles et os",
                    "Hormones et enzymes",
                    "Globules rouges et globules blancs",
                ],
                correctIndex: 0,
                explanation:
                    "Les sources distinguent les neurones, qui transmettent les signaux, et les cellules gliales, qui assurent de nombreux rôles de soutien et de régulation.",
            },
        },
        {
            id: "neurosciences_cellules_q2",
            lessonId: "neurosciences_cellules",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Les cellules gliales n'ont absolument aucun rôle important dans le fonctionnement cérébral.",
                correct: false,
                explanation:
                    "Faux. Les glies participent notamment au soutien, à la myélinisation, à la régulation synaptique, à l'immunité cérébrale et à l'homéostasie.",
            },
        },

        {
            id: "neurosciences_neurone_q1",
            lessonId: "neurosciences_neurone",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque partie du neurone à sa fonction principale :",
                pairs: [
                    { left: "Dendrites", right: "Reçoivent des signaux" },
                    { left: "Axone", right: "Transmet le signal sur une longue distance" },
                    { left: "Corps cellulaire", right: "Contient le noyau et intègre l'activité cellulaire" },
                ],
                explanation:
                    "Un neurone comprend classiquement des dendrites, un corps cellulaire et un axone, chacun ayant une fonction spécifique dans la circulation de l'information.",
            },
        },
        {
            id: "neurosciences_neurone_q2",
            lessonId: "neurosciences_neurone",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Le signal électrique rapide transmis par un neurone est appelé :",
                choices: [
                    "Réflexe hormonal",
                    "Potentiel d'action",
                    "Rêve cortical",
                    "Cycle synaptique lent",
                ],
                correctIndex: 1,
                explanation:
                    "Les neurones génèrent des signaux électriques appelés potentiels d'action pour transmettre rapidement l'information.",
            },
        },

        {
            id: "neurosciences_synapse_q1",
            lessonId: "neurosciences_synapse",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La synapse est surtout :",
                choices: [
                    "Une zone où deux os se rejoignent",
                    "Le point de communication entre neurones",
                    "Une partie du foie",
                    "Un type de lobe cérébral",
                ],
                correctIndex: 1,
                explanation:
                    "La synapse est le site où l'information passe d'un neurone présynaptique à une cellule cible.",
            },
        },
        {
            id: "neurosciences_synapse_q2",
            lessonId: "neurosciences_synapse",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Quand un potentiel d'action atteint la terminaison axonale, il peut déclencher la libération de neurotransmetteurs.",
                correct: true,
                explanation:
                    "Oui. L'arrivée du potentiel d'action à la terminaison axonale déclenche la libération de neurotransmetteurs dans la synapse.",
            },
        },
        {
            id: "neurosciences_synapse_q3",
            lessonId: "neurosciences_synapse",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Les neurotransmetteurs traversent la synapse pour :",
                choices: [
                    "Construire un nouvel axone",
                    "Se lier à des récepteurs de la cellule postsynaptique",
                    "Créer directement un souvenir durable",
                    "Remplacer la myéline",
                ],
                correctIndex: 1,
                explanation:
                    "Les neurotransmetteurs sont libérés par la cellule présynaptique puis se lient à des récepteurs sur la cellule postsynaptique.",
            },
        },

        {
            id: "neurosciences_glie_q1",
            lessonId: "neurosciences_glie",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quel rôle est bien associé aux cellules gliales ?",
                choices: [
                    "Soutenir, protéger et réguler l'environnement des neurones",
                    "Former uniquement les souvenirs autobiographiques",
                    "Mesurer directement l'intelligence",
                    "Créer les lobes cérébraux à chaque apprentissage",
                ],
                correctIndex: 0,
                explanation:
                    "Les cellules gliales soutiennent les neurones, régulent leur environnement et remplissent aussi des fonctions immunitaires ou de myélinisation selon leur type.",
            },
        },
        {
            id: "neurosciences_glie_q2",
            lessonId: "neurosciences_glie",
            blockIndex: 3,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de glie à un rôle important :",
                pairs: [
                    { left: "Astrocytes", right: "Régulent l'environnement neuronal et la communication" },
                    { left: "Microglies", right: "Défense immunitaire du cerveau" },
                    { left: "Oligodendrocytes", right: "Produisent la myéline dans le système nerveux central" },
                ],
                explanation:
                    "Les astrocytes, microglies et oligodendrocytes jouent des rôles distincts mais essentiels dans le cerveau.",
            },
        },

        {
            id: "neurosciences_lobes_q1",
            lessonId: "neurosciences_lobes",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque lobe cérébral à sa fonction générale :",
                pairs: [
                    { left: "Frontal", right: "Planification, raisonnement, contrôle exécutif" },
                    { left: "Pariétal", right: "Intégration sensorielle" },
                    { left: "Temporal", right: "Audition, langage, mémoire" },
                    { left: "Occipital", right: "Vision" },
                ],
                explanation:
                    "Les quatre grands lobes du cortex sont généralement associés à ces grandes fonctions, même si le cerveau travaille toujours en réseau.",
            },
        },
        {
            id: "neurosciences_lobes_q2",
            lessonId: "neurosciences_lobes",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel lobe est présenté comme le principal centre de traitement visuel ?",
                choices: [
                    "Frontal",
                    "Pariétal",
                    "Temporal",
                    "Occipital",
                ],
                correctIndex: 3,
                explanation:
                    "Le lobe occipital est décrit comme le centre majeur du traitement visuel.",
            },
        },

        {
            id: "neurosciences_methodes_q1",
            lessonId: "neurosciences_methodes",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "L'EEG est particulièrement connu pour sa :",
                choices: [
                    "Très haute résolution temporelle",
                    "Capacité à mesurer directement les os du crâne",
                    "Lecture précise des pensées mot à mot",
                    "Mesure exclusive des émotions sociales",
                ],
                correctIndex: 0,
                explanation:
                    "L'EEG est connu pour sa résolution temporelle de l'ordre de la milliseconde.",
            },
        },
        {
            id: "neurosciences_methodes_q2",
            lessonId: "neurosciences_methodes",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "L'IRMf est surtout utilisée pour :",
                choices: [
                    "Observer des variations hémodynamiques liées à l'activité cérébrale",
                    "Mesurer directement chaque neurotransmetteur synaptique",
                    "Voir seulement les muscles faciaux",
                    "Remplacer toute autre méthode",
                ],
                correctIndex: 0,
                explanation:
                    "L'IRMf observe des changements hémodynamiques dans le cerveau, ce qui aide à relier des tâches à certaines régions.",
            },
        },
        {
            id: "neurosciences_methodes_q3",
            lessonId: "neurosciences_methodes",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Les neurosciences combinent souvent plusieurs méthodes, car aucune ne donne à elle seule une image complète du cerveau.",
                correct: true,
                explanation:
                    "Oui. Les sources sur EEG et IRMf montrent bien qu'elles ont des forces différentes, notamment temporelles et spatiales, donc complémentaires.",
            },
        },

        {
            id: "neurosciences_pont_q1",
            lessonId: "neurosciences_pont",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quel futur nœud découle le plus directement de l'étude des cellules nerveuses ?",
                choices: [
                    "neurone",
                    "memoire_episodique",
                    "conditionnement_classique",
                    "biais_cognitifs",
                ],
                correctIndex: 0,
                explanation:
                    "Le nœud 'neurone' approfondit directement la cellule de base du système nerveux.",
            },
        },
        {
            id: "neurosciences_pont_q2",
            lessonId: "neurosciences_pont",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Quel futur nœud prolonge le mieux l'étude de la communication entre cellules nerveuses ?",
                choices: [
                    "synapse",
                    "memoire_sensorielle",
                    "attention_divisee",
                    "motivation",
                ],
                correctIndex: 0,
                explanation:
                    "Le nœud 'synapse' est la suite naturelle lorsqu'on veut comprendre plus finement comment les neurones communiquent.",
            },
        },

        {
            id: "neurosciences_recap_q1",
            lessonId: "neurosciences_recap",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces idées dans l'ordre logique d'apprentissage :",
                items: [
                    "Comprendre ce que sont les neurosciences",
                    "Identifier les cellules du système nerveux",
                    "Voir comment les neurones communiquent",
                    "Découvrir l'organisation générale du cerveau et les méthodes d'étude",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "On part de la définition générale, puis des cellules, puis de leur communication, avant d'aborder l'organisation cérébrale et les outils d'observation.",
            },
        },
        {
            id: "neurosciences_recap_q2",
            lessonId: "neurosciences_recap",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque notion à sa meilleure description :",
                pairs: [
                    { left: "Neurone", right: "Cellule qui transmet des signaux" },
                    { left: "Glie", right: "Cellule de soutien et de régulation" },
                    { left: "Synapse", right: "Jonction de communication cellulaire" },
                    { left: "Occipital", right: "Lobe majeur du traitement visuel" },
                ],
                explanation:
                    "Ces associations résument les idées fondatrices du nœud.",
            },
        },

        {
            id: "neurosciences_final_q1",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Les neurosciences étudient principalement :",
                choices: [
                    "Le système nerveux",
                    "Les lois du marché",
                    "La composition des roches",
                    "Uniquement les rêves",
                ],
                correctIndex: 0,
                explanation:
                    "Les neurosciences portent sur le système nerveux, le cerveau, ses cellules et ses circuits.",
            },
        },
        {
            id: "neurosciences_final_q2",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "Le système nerveux central comprend le cerveau et la moelle épinière.",
                correct: true,
                explanation:
                    "Oui. C'est la définition classique du système nerveux central.",
            },
        },
        {
            id: "neurosciences_final_q3",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Les deux grandes catégories cellulaires mises en avant dans le système nerveux sont :",
                choices: [
                    "Neurones et glies",
                    "Os et muscles",
                    "Artères et veines",
                    "Récepteurs et hormones",
                ],
                correctIndex: 0,
                explanation:
                    "Le système nerveux repose notamment sur les neurones et les cellules gliales.",
            },
        },
        {
            id: "neurosciences_final_q4",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "match_pairs",
                question: "Associe chaque structure neuronale à sa fonction :",
                pairs: [
                    { left: "Dendrites", right: "Reçoivent les signaux" },
                    { left: "Axone", right: "Conduit le signal" },
                    { left: "Terminaisons axonales", right: "Libèrent des neurotransmetteurs" },
                ],
                explanation:
                    "Ces structures sont essentielles à la réception, à la conduction et à la transmission de l'information neuronale.",
            },
        },
        {
            id: "neurosciences_final_q5",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "La synapse est un site de communication entre cellules nerveuses.",
                correct: true,
                explanation:
                    "Oui. La synapse permet le passage de l'information d'une cellule à une autre.",
            },
        },
        {
            id: "neurosciences_final_q6",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quel type de glie produit la myéline dans le système nerveux central ?",
                choices: [
                    "Microglie",
                    "Astrocyte",
                    "Oligodendrocyte",
                    "Dendrite",
                ],
                correctIndex: 2,
                explanation:
                    "Les oligodendrocytes produisent la myéline dans le système nerveux central.",
            },
        },
        {
            id: "neurosciences_final_q7",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quel lobe est le plus directement associé à la vision ?",
                choices: [
                    "Frontal",
                    "Temporal",
                    "Occipital",
                    "Pariétal",
                ],
                correctIndex: 2,
                explanation:
                    "Le lobe occipital est le principal centre du traitement visuel.",
            },
        },
        {
            id: "neurosciences_final_q8",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quelle méthode est particulièrement forte pour suivre l'activité cérébrale à l'échelle de la milliseconde ?",
                choices: [
                    "IRMf",
                    "EEG",
                    "Scanner osseux",
                    "Radiographie simple",
                ],
                correctIndex: 1,
                explanation:
                    "L'EEG est particulièrement reconnu pour sa haute résolution temporelle.",
            },
        },
        {
            id: "neurosciences_final_q9",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "word_bank",
                question: "Complète la phrase :",
                sentence:
                    "Les neurones communiquent notamment à travers des ___ en libérant des ___.",
                bank: ["synapses", "neurotransmetteurs", "muscles", "hormones", "cartilages"],
                correctWords: ["synapses", "neurotransmetteurs"],
                explanation:
                    "La communication neuronale passe classiquement par les synapses et la libération de neurotransmetteurs.",
            },
        },
        {
            id: "neurosciences_final_q10",
            lessonId: "neurosciences_final_quiz",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces étapes dans l'ordre simple d'une transmission neuronale :",
                items: [
                    "Le neurotransmetteur se lie à des récepteurs postsynaptiques",
                    "Le potentiel d'action arrive en terminaison axonale",
                    "Le neurotransmetteur est libéré dans la synapse",
                    "Un signal est transmis à la cellule cible",
                ],
                correctOrder: [1, 2, 0, 3],
                explanation:
                    "Le potentiel d'action arrive, déclenche la libération du neurotransmetteur, celui-ci se fixe aux récepteurs, puis le signal est transmis.",
            },
        },
    ],
    lessonPath: [
        {
            id: "neurosciences_intro",
            title: "Qu'est-ce que les neurosciences ?",
            type: "vignette",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "vignette",
                    title: "Du comportement aux cellules",
                    content:
                        "Tu peux observer quelqu'un parler, bouger, mémoriser ou se tromper. Mais derrière chaque action, il existe des mécanismes biologiques précis : cellules nerveuses, connexions, signaux électriques, signaux chimiques, régions cérébrales spécialisées et réseaux.\n\nLes neurosciences cherchent à comprendre cette mécanique du vivant.",
                },
                {
                    type: "explanation",
                    title: "Une base biologique pour l'esprit",
                    content:
                        "Les neurosciences étudient le système nerveux, surtout le cerveau, afin de comprendre comment des mécanismes biologiques rendent possibles la perception, l'action, les émotions et la cognition. Ce nœud pose les bases avant des nœuds plus ciblés comme le neurone, la synapse, les lobes cérébraux ou la neuroimagerie.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Les neurosciences étudient le système nerveux et le cerveau",
                        "Elles servent de base biologique pour comprendre la cognition",
                        "Elles introduisent des notions comme neurone, synapse, lobes et neuroimagerie",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_systeme",
            title: "Le système nerveux",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Centre et périphérie",
                    content:
                        "Le système nerveux est souvent présenté en deux grandes parties. Le système nerveux central comprend le cerveau et la moelle épinière, tandis que le système nerveux périphérique regroupe les nerfs et éléments situés hors de ce centre.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_systeme_q1",
                },
                {
                    type: "explanation",
                    title: "Faire circuler l'information",
                    content:
                        "Des neurones sensoriels apportent des informations vers le système nerveux central, tandis que des neurones moteurs envoient des commandes vers les muscles. D'autres neurones, parfois appelés interneurones, assurent de nombreuses liaisons au sein des circuits.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_systeme_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le système nerveux central comprend cerveau et moelle épinière",
                        "Le système nerveux périphérique relie le reste du corps au centre nerveux",
                        "Des neurones sensoriels et moteurs assurent l'entrée et la sortie de l'information",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_cellules",
            title: "Les cellules du cerveau",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Deux grandes familles",
                    content:
                        "Le système nerveux repose notamment sur deux grandes catégories cellulaires : les neurones et les cellules gliales. Les neurones transmettent des signaux, tandis que les glies soutiennent, nourrissent, protègent et régulent le fonctionnement de l'ensemble.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_cellules_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi les glies comptent",
                    content:
                        "Pendant longtemps, les glies ont été vues comme de simples cellules de soutien. Les sources modernes montrent au contraire qu'elles participent à la régulation des synapses, à la myéline, à l'immunité cérébrale et au maintien de l'environnement neuronal.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_cellules_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le système nerveux comprend neurones et glies",
                        "Les glies ont des fonctions de soutien, régulation et protection",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_neurone",
            title: "Le neurone",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "La cellule messagère",
                    content:
                        "Le neurone est souvent présenté comme l'unité fonctionnelle de base du système nerveux. Il reçoit des signaux, les intègre, puis transmet éventuellement une réponse vers d'autres neurones, des muscles ou des glandes.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_neurone_q1",
                },
                {
                    type: "explanation",
                    title: "Sa structure de base",
                    content:
                        "Un neurone possède en général un corps cellulaire, des dendrites qui reçoivent des signaux, et un axone qui conduit l'information. Les neurones utilisent des potentiels d'action pour transmettre rapidement ces signaux sur de longues distances.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_neurone_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le neurone reçoit, intègre et transmet l'information",
                        "Ses principales parties sont les dendrites, le corps cellulaire et l'axone",
                        "Le potentiel d'action est un signal électrique fondamental",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_synapse",
            title: "La synapse",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Là où les cellules communiquent",
                    content:
                        "Les neurones ne forment pas juste une collection de cellules isolées. Ils sont reliés par des sites de communication appelés synapses, où l'information passe d'une cellule présynaptique à une cellule cible.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_synapse_q1",
                },
                {
                    type: "explanation",
                    title: "Du signal électrique au signal chimique",
                    content:
                        "Quand un potentiel d'action arrive à la terminaison axonale, il déclenche la libération de neurotransmetteurs. Ces molécules traversent l'espace synaptique puis se lient à des récepteurs sur la cellule postsynaptique, où elles peuvent produire un effet excitateur ou inhibiteur.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_synapse_q2",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_synapse_q3",
                },
                {
                    type: "recap",
                    points: [
                        "La synapse est le site de communication entre cellules nerveuses",
                        "Les neurotransmetteurs y transmettent l'information",
                        "La transmission synaptique convertit un signal électrique en signal chimique puis en nouvelle réponse cellulaire",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_glie",
            title: "Les cellules gliales",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Bien plus que du soutien",
                    content:
                        "Les cellules gliales remplissent des fonctions essentielles au bon fonctionnement du cerveau. Elles participent à la nutrition des neurones, à la régulation de l'environnement ionique, à la protection immunitaire et à la formation de la myéline selon leur type.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_glie_q1",
                },
                {
                    type: "explanation",
                    title: "Quelques types importants",
                    content:
                        "Les astrocytes aident à réguler l'environnement neuronal et la communication synaptique. Les microglies jouent un rôle immunitaire. Les oligodendrocytes produisent la myéline dans le système nerveux central, ce qui accélère la conduction des signaux le long de certains axones.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_glie_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Les glies sont essentielles au fonctionnement cérébral",
                        "Astrocytes, microglies et oligodendrocytes ont des rôles complémentaires",
                        "La myéline accélère la conduction du signal",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_lobes",
            title: "Les grands lobes du cerveau",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Une organisation générale",
                    content:
                        "Le cortex cérébral est traditionnellement divisé en deux hémisphères et en quatre grands lobes : frontal, pariétal, temporal et occipital. Cette organisation aide à repérer de grandes fonctions, même si le cerveau fonctionne toujours en réseaux distribués.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_lobes_q1",
                },
                {
                    type: "explanation",
                    title: "Des fonctions dominantes",
                    content:
                        "Le lobe frontal est souvent associé à la planification, au raisonnement et au contrôle exécutif. Le pariétal intègre des informations sensorielles. Le temporal participe notamment à l'audition, au langage et à la mémoire. L'occipital est le grand centre du traitement visuel.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_lobes_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le cortex est souvent décrit à travers quatre grands lobes",
                        "Frontal, pariétal, temporal et occipital ont des fonctions dominantes différentes",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_methodes",
            title: "Comment observer le cerveau",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Des outils complémentaires",
                    content:
                        "Les neurosciences utilisent plusieurs méthodes pour observer ou inférer l'activité cérébrale. Aucune ne suffit seule : chacune donne un type d'information particulier.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_methodes_q1",
                },
                {
                    type: "explanation",
                    title: "EEG et IRMf",
                    content:
                        "L'EEG enregistre l'activité électrique depuis le cuir chevelu et se distingue par une résolution temporelle très fine, de l'ordre de la milliseconde. L'IRMf observe des changements hémodynamiques dans le cerveau avec une bonne résolution spatiale. Les deux approches sont donc souvent vues comme complémentaires.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_methodes_q2",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_methodes_q3",
                },
                {
                    type: "recap",
                    points: [
                        "Les neurosciences combinent plusieurs méthodes d'étude",
                        "L'EEG est fort sur le temps",
                        "L'IRMf est utile pour localiser des variations d'activité dans le cerveau",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_pont",
            title: "Vers les nœuds spécialisés",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Un nœud fondation",
                    content:
                        "Le nœud 'neurosciences' ne cherche pas à tout expliquer d'un coup. Il donne les repères biologiques de base : système nerveux, cellules, communication neuronale, grandes régions cérébrales et outils d'observation.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_pont_q1",
                },
                {
                    type: "explanation",
                    title: "Ce que tu peux approfondir ensuite",
                    content:
                        "À partir d'ici, tu peux descendre dans des nœuds plus ciblés. Le neurone approfondit la cellule de base. La synapse détaille la transmission. Les lobes du cerveau développent l'organisation anatomique. La neuroimagerie explore les méthodes comme l'EEG et l'IRMf.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_pont_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le nœud 'neurosciences' pose les bases biologiques générales",
                        "Il prépare des branches comme neurone, synapse, lobes du cerveau et neuroimagerie",
                    ],
                },
            ],
        },
        {
            id: "neurosciences_recap",
            title: "Récapitulatif",
            type: "recap",
            estimatedMinutes: 3,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "Les neurosciences étudient le système nerveux et le cerveau",
                        "Le système nerveux central comprend cerveau et moelle épinière",
                        "Le système nerveux périphérique regroupe les structures hors de ce centre",
                        "Les deux grandes catégories cellulaires sont les neurones et les glies",
                        "Le neurone transmet des signaux grâce à sa structure et au potentiel d'action",
                        "La synapse permet la communication par neurotransmetteurs",
                        "Les glies soutiennent, régulent, protègent et myélinisent selon leur type",
                        "Les lobes frontal, pariétal, temporal et occipital ont des fonctions dominantes différentes",
                        "L'EEG et l'IRMf sont des méthodes complémentaires pour étudier le cerveau",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_recap_q1",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_recap_q2",
                },
            ],
        },
        {
            id: "neurosciences_final_quiz",
            title: "Quiz Final — Neurosciences",
            type: "final_quiz",
            estimatedMinutes: 9,
            blocks: [
                {
                    type: "explanation",
                    content:
                        "Ce quiz final vérifie ta compréhension des fondements des neurosciences avant de passer vers des nœuds plus spécifiques sur les cellules, les circuits, les régions cérébrales ou les méthodes.",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q1",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q2",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q3",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q4",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q5",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q6",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q7",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q8",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q9",
                },
                {
                    type: "quiz",
                    questionId: "neurosciences_final_q10",
                },
            ],
        },
    ],
  };