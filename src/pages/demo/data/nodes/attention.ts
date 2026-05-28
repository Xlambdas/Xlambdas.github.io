import type { NodeType } from "../../types";

export const AttentionNode: NodeType = {
    id: "attention",
    title: "Attention",
    type: "topic",
    links: [], // ["attention_selective", "attention_controle"],
    isUnlocked: false,
    prerequisites: ["psychologie"],
    branchColor: "#3b82f6",
    hook: "À chaque seconde, ton cerveau reçoit bien plus d'informations qu'il ne peut en traiter en détail. L'attention sert justement à sélectionner, maintenir ou répartir les ressources mentales selon les buts du moment.",
    shortDescription:
        "Introduction aux grands mécanismes de l'attention, à ses limites et à ses fonctions.",
    badge: {
        id: "badge_attention",
        nodeId: "attention",
        icon: "🎯",
        name: "Maître du Focus",
        description: "Maîtrise des fondements de l'attention en psychologie",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "attention_intro_q1",
            lessonId: "attention_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "En psychologie, l'attention sert principalement à :",
                choices: [
                    "Enregistrer automatiquement toute l'information disponible",
                    "Sélectionner et orienter les ressources mentales vers certaines informations",
                    "Remplacer complètement la mémoire",
                    "Supprimer toute distraction de manière parfaite",
                ],
                correctIndex: 1,
                explanation:
                    "L'attention permet de sélectionner certaines informations et d'orienter le traitement mental vers ce qui est pertinent pour la tâche ou le but du moment.",
            },
        },
        {
            id: "attention_intro_q2",
            lessonId: "attention_intro",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "Le cerveau traite avec la même profondeur tous les stimuli présents autour de nous.",
                correct: false,
                explanation:
                    "Faux. L'attention existe précisément parce que les ressources de traitement sont limitées et que tout ne peut pas être traité également.",
            },
        },

        {
            id: "attention_fonctions_q1",
            lessonId: "attention_fonctions",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque fonction attentionnelle à sa description :",
                pairs: [
                    { left: "Sélectionner", right: "Choisir une information prioritaire" },
                    { left: "Maintenir", right: "Rester concentré sur une tâche dans le temps" },
                    { left: "Répartir", right: "Partager les ressources entre plusieurs activités" },
                ],
                explanation:
                    "Les fonctions attentionnelles incluent la sélection, le maintien et parfois la division des ressources selon les exigences de la situation.",
            },
        },
        {
            id: "attention_fonctions_q2",
            lessonId: "attention_fonctions",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Laquelle de ces situations mobilise surtout le maintien de l'attention ?",
                choices: [
                    "Repérer un mot précis dans une page",
                    "Suivre une explication pendant plusieurs minutes",
                    "Faire du vélo sans réfléchir",
                    "Reconnaître un visage familier",
                ],
                correctIndex: 1,
                explanation:
                    "Le maintien de l'attention concerne la capacité à rester focalisé sur une tâche ou une source d'information dans la durée.",
            },
        },

        {
            id: "attention_selective_intro_q1",
            lessonId: "attention_selective_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "L'attention sélective correspond surtout à la capacité de :",
                choices: [
                    "Se souvenir de toutes les informations vues dans la journée",
                    "Se concentrer sur une source d'information en ignorant le reste",
                    "Faire parfaitement deux tâches difficiles en même temps",
                    "Accélérer automatiquement tous les traitements cognitifs",
                ],
                correctIndex: 1,
                explanation:
                    "L'attention sélective correspond à la focalisation sur certains stimuli pendant que d'autres sont ignorés.",
            },
        },
        {
            id: "attention_selective_intro_q2",
            lessonId: "attention_selective_intro",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "L'attention sélective peut conduire à manquer certains éléments pourtant présents dans l'environnement.",
                correct: true,
                explanation:
                    "Oui. Se focaliser sur une source d'information peut conduire à négliger d'autres éléments pourtant visibles ou audibles.",
            },
        },

        {
            id: "attention_divisee_q1",
            lessonId: "attention_divisee",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "L'attention divisée désigne surtout :",
                choices: [
                    "Le stockage rapide de plusieurs souvenirs",
                    "Le fait de répartir l'attention entre plusieurs tâches ou sources d'information",
                    "La suppression définitive des distractions",
                    "Le passage automatique en mémoire à long terme",
                ],
                correctIndex: 1,
                explanation:
                    "L'attention divisée correspond au partage des ressources mentales entre plusieurs tâches ou sources d'information.",
            },
        },
        {
            id: "attention_divisee_q2",
            lessonId: "attention_divisee",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "Le multitâche améliore généralement les performances sur toutes les tâches en parallèle.",
                correct: false,
                explanation:
                    "Faux. Diviser l'attention réduit souvent la vitesse, la précision ou la qualité de traitement.",
            },
        },
        {
            id: "attention_divisee_q3",
            lessonId: "attention_divisee",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel exemple illustre le mieux une limite de l'attention divisée ?",
                choices: [
                    "Lire tranquillement un livre dans le silence",
                    "Conduire en répondant à des messages",
                    "Dormir profondément",
                    "Reconnaître son prénom",
                ],
                correctIndex: 1,
                explanation:
                    "La conduite avec une autre tâche concurrente illustre bien le coût du partage de l'attention.",
            },
        },

        {
            id: "attention_stroop_q1",
            lessonId: "attention_stroop",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Dans la tâche de Stroop, la difficulté vient surtout du fait que :",
                choices: [
                    "Le cerveau oublie la couleur immédiatement",
                    "La lecture automatique du mot interfère avec la tâche de nommer la couleur",
                    "Les couleurs sont physiquement impossibles à distinguer",
                    "La mémoire à long terme bloque la vision",
                ],
                correctIndex: 1,
                explanation:
                    "L'effet Stroop montre qu'un traitement automatique, comme la lecture, peut interférer avec une tâche contrôlée, comme nommer la couleur de l'encre.",
            },
        },
        {
            id: "attention_stroop_q2",
            lessonId: "attention_stroop",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "L'effet Stroop est utilisé pour étudier le contrôle attentionnel et l'inhibition.",
                correct: true,
                explanation:
                    "Oui. Cette tâche sert à étudier l'attention contrôlée, l'inhibition et l'interférence entre processus automatiques et contrôlés.",
            },
        },

        {
            id: "attention_automatique_q1",
            lessonId: "attention_automatique",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de traitement à sa caractéristique principale :",
                pairs: [
                    { left: "Traitement automatique", right: "Rapide et difficile à empêcher" },
                    { left: "Traitement contrôlé", right: "Demande un effort attentionnel" },
                    { left: "Interférence", right: "Conflit entre deux traitements concurrents" },
                ],
                explanation:
                    "L'étude de l'attention oppose souvent traitements automatiques et traitements contrôlés, notamment dans les paradigmes d'interférence.",
            },
        },
        {
            id: "attention_automatique_q2",
            lessonId: "attention_automatique",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel exemple correspond le mieux à un traitement relativement automatique ?",
                choices: [
                    "Lire un mot familier",
                    "Inhiber une réponse dominante",
                    "Partager son attention entre plusieurs tâches complexes",
                    "Maintenir volontairement son focus pendant une heure",
                ],
                correctIndex: 0,
                explanation:
                    "La lecture de mots familiers est un exemple classique de traitement très automatisé dans les tâches de type Stroop.",
            },
        },

        {
            id: "attention_limites_q1",
            lessonId: "attention_limites",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "L'attention a des limites, ce qui peut conduire à des omissions ou à des erreurs.",
                correct: true,
                explanation:
                    "Oui. Les limites attentionnelles expliquent pourquoi certaines informations peuvent être manquées malgré leur présence dans l'environnement.",
            },
        },
        {
            id: "attention_limites_q2",
            lessonId: "attention_limites",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Pourquoi l'attention est-elle souvent décrite comme une ressource limitée ?",
                choices: [
                    "Parce qu'elle ne sert qu'aux émotions",
                    "Parce que le cerveau ne peut pas tout traiter avec la même intensité en même temps",
                    "Parce qu'elle disparaît totalement après l'enfance",
                    "Parce qu'elle dépend uniquement de la vision",
                ],
                correctIndex: 1,
                explanation:
                    "L'attention est limitée parce que les ressources cognitives ne permettent pas un traitement approfondi de toutes les informations simultanément.",
            },
        },

        {
            id: "attention_pont_q1",
            lessonId: "attention_pont",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quel sous-thème prépare le mieux le nœud 'attention_selective' ?",
                choices: [
                    "La focalisation sur une information pertinente parmi d'autres",
                    "La consolidation hippocampique",
                    "Le rappel autobiographique",
                    "L'amorçage procédural",
                ],
                correctIndex: 0,
                explanation:
                    "L'attention sélective repose précisément sur la focalisation sur certaines informations et le filtrage du reste.",
            },
        },
        {
            id: "attention_pont_q2",
            lessonId: "attention_pont",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Quel sous-thème prépare le mieux un nœud sur le contrôle attentionnel ?",
                choices: [
                    "Le conflit entre traitement automatique et traitement contrôlé",
                    "La mémoire procédurale",
                    "La perception des profondeurs",
                    "La reconnaissance des objets",
                ],
                correctIndex: 0,
                explanation:
                    "Le contrôle attentionnel devient particulièrement visible dans les situations d'inhibition et d'interférence, comme dans la tâche de Stroop.",
            },
        },

        {
            id: "attention_recap_q1",
            lessonId: "attention_recap",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces idées dans un ordre logique d'apprentissage :",
                items: [
                    "Comprendre que l'attention sélectionne les informations",
                    "Voir qu'elle peut être maintenue ou divisée",
                    "Découvrir ses limites et ses coûts",
                    "Étudier le contrôle attentionnel avec l'effet Stroop",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "On commence par la fonction générale de sélection, puis par les formes d'allocation, ensuite par les limites, puis par les paradigmes plus spécifiques de contrôle.",
            },
        },
        {
            id: "attention_recap_q2",
            lessonId: "attention_recap",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque notion à son idée centrale :",
                pairs: [
                    { left: "Attention sélective", right: "Focaliser une source d'information" },
                    { left: "Attention divisée", right: "Partager les ressources entre plusieurs tâches" },
                    { left: "Effet Stroop", right: "Interférence entre lecture automatique et consigne" },
                    { left: "Contrôle attentionnel", right: "Orienter et inhiber le traitement selon le but" },
                ],
                explanation:
                    "Ces quatre repères structurent l'entrée dans le thème de l'attention.",
            },
        },

        {
            id: "attention_final_q1",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Pourquoi avons-nous besoin de l'attention ?",
                choices: [
                    "Parce que toute information est traitée parfaitement sans sélection",
                    "Parce que les ressources cognitives sont limitées et qu'il faut prioriser",
                    "Parce que la mémoire suffit rarement à percevoir",
                    "Parce que l'attention remplace tous les autres processus mentaux",
                ],
                correctIndex: 1,
                explanation:
                    "L'attention sert à gérer des ressources limitées en orientant le traitement vers ce qui est pertinent.",
            },
        },
        {
            id: "attention_final_q2",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "L'attention sélective consiste à traiter toutes les informations de manière égale.",
                correct: false,
                explanation:
                    "Faux. Elle consiste justement à privilégier certaines informations au détriment d'autres.",
            },
        },
        {
            id: "attention_final_q3",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Le multitâche est généralement associé à :",
                choices: [
                    "Une amélioration générale de toutes les performances",
                    "Une répartition sans coût des ressources",
                    "Une baisse possible de vitesse ou de précision",
                    "Une suppression de toute interférence",
                ],
                correctIndex: 2,
                explanation:
                    "Diviser l'attention entraîne souvent des coûts de performance.",
            },
        },
        {
            id: "attention_final_q4",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "match_pairs",
                question: "Associe chaque concept à sa bonne définition :",
                pairs: [
                    { left: "Attention sélective", right: "Choisir une source d'information prioritaire" },
                    { left: "Attention divisée", right: "Répartir les ressources entre plusieurs tâches" },
                    { left: "Traitement automatique", right: "Traitement rapide et peu coûteux en contrôle" },
                    { left: "Traitement contrôlé", right: "Traitement demandant effort et supervision" },
                ],
                explanation:
                    "Ces distinctions sont au cœur de l'introduction à l'attention.",
            },
        },
        {
            id: "attention_final_q5",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "L'effet Stroop montre qu'un processus automatique peut interférer avec une tâche contrôlée.",
                correct: true,
                explanation:
                    "Oui. C'est exactement ce que met en évidence le paradigme Stroop.",
            },
        },
        {
            id: "attention_final_q6",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Dans la tâche de Stroop, qu'est-ce qui ralentit la réponse ?",
                choices: [
                    "L'absence totale de perception",
                    "Le conflit entre lecture automatique et dénomination de la couleur",
                    "La disparition du mot à l'écran",
                    "Le manque de mémoire autobiographique",
                ],
                correctIndex: 1,
                explanation:
                    "Le ralentissement vient de l'interférence entre deux traitements concurrents.",
            },
        },
        {
            id: "attention_final_q7",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "word_bank",
                question: "Complète la définition :",
                sentence:
                    "L'attention permet de ___ certaines informations et de ___ les ressources mentales selon la tâche.",
                bank: ["sélectionner", "répartir", "oublier", "figer", "copier"],
                correctWords: ["sélectionner", "répartir"],
                explanation:
                    "Cette phrase résume deux fonctions centrales de l'attention : choisir et allouer les ressources.",
            },
        },
        {
            id: "attention_final_q8",
            lessonId: "attention_final_quiz",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets dans l'ordre logique cette progression :",
                items: [
                    "L'attention sert à sélectionner",
                    "Elle peut être divisée ou maintenue",
                    "Cette division a souvent un coût",
                    "Le contrôle attentionnel permet d'inhiber certaines réponses",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation:
                    "On part de la fonction générale, puis des formes de mobilisation, ensuite des limites, puis du contrôle plus avancé.",
            },
        },
    ],
    lessonPath: [
        {
            id: "attention_intro",
            title: "Qu'est-ce que l'attention ?",
            type: "vignette",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "vignette",
                    title: "Trop d'informations, trop peu de ressources",
                    content:
                        "Autour de toi, il y a des sons, des visages, des mouvements, des pensées, des souvenirs, des notifications, des objectifs en cours. Si ton cerveau devait tout traiter avec la même intensité, il serait rapidement submergé.\n\nL'attention existe pour éviter cela. Elle aide à donner la priorité à certaines informations plutôt qu'à d'autres.",
                },
                {
                    type: "explanation",
                    title: "Une fonction de sélection",
                    content:
                        "En psychologie, l'attention désigne l'ensemble des mécanismes qui permettent d'orienter les ressources mentales vers une information, une tâche ou un but pertinent. Elle ne crée pas l'information, mais elle influence fortement ce qui sera traité, ignoré, maintenu ou interrompu.",
                },
                {
                    type: "quiz",
                    questionId: "attention_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "attention_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'attention aide à gérer un excès d'informations",
                        "Elle sert à orienter les ressources mentales vers ce qui est pertinent",
                        "Elle existe parce que le traitement cognitif est limité",
                    ],
                },
            ],
        },
        {
            id: "attention_fonctions",
            title: "Les grandes fonctions de l'attention",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Sélectionner, maintenir, répartir",
                    content:
                        "L'attention n'est pas une seule opération. Elle peut d'abord **sélectionner** une information parmi d'autres, puis **maintenir** la concentration dans le temps, et parfois **répartir** les ressources entre plusieurs tâches ou plusieurs sources d'information.",
                },
                {
                    type: "quiz",
                    questionId: "attention_fonctions_q1",
                },
                {
                    type: "explanation",
                    title: "Une ressource orientée par le but",
                    content:
                        "Ce que tu attends, ce que tu cherches, et ce que tu veux faire influencent la direction de ton attention. Elle n'est donc pas seulement déterminée par l'environnement, mais aussi par les objectifs de l'individu.",
                },
                {
                    type: "quiz",
                    questionId: "attention_fonctions_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'attention peut sélectionner, maintenir ou répartir les ressources",
                        "Elle dépend aussi des buts et des priorités de la personne",
                    ],
                },
            ],
        },
        {
            id: "attention_selective_intro",
            title: "L'attention sélective",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Se focaliser sur une chose",
                    content:
                        "L'attention sélective correspond à la capacité de concentrer le traitement sur une partie des informations disponibles tout en en ignorant d'autres. C'est elle qui permet, par exemple, de suivre une voix particulière dans un environnement bruyant ou de chercher un objet précis dans une scène complexe.",
                },
                {
                    type: "quiz",
                    questionId: "attention_selective_intro_q1",
                },
                {
                    type: "explanation",
                    title: "Le prix de la sélection",
                    content:
                        "Sélectionner a un avantage évident : on traite mieux ce qui compte pour la tâche. Mais cela a aussi un coût : ce qui n'est pas sélectionné risque d'être négligé, voire totalement manqué.",
                },
                {
                    type: "quiz",
                    questionId: "attention_selective_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'attention sélective permet de prioriser certaines informations",
                        "Elle améliore le traitement de la cible mais peut faire manquer le reste",
                    ],
                },
            ],
        },
        {
            id: "attention_divisee",
            title: "L'attention divisée",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Partager son attention",
                    content:
                        "L'attention divisée désigne la tentative de répartir les ressources mentales entre plusieurs tâches ou plusieurs flux d'information. C'est ce qu'on appelle souvent, dans la vie quotidienne, le multitâche.",
                },
                {
                    type: "quiz",
                    questionId: "attention_divisee_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi cela coûte souvent cher",
                    content:
                        "Même si certaines combinaisons de tâches deviennent plus faciles avec l'entraînement, le partage attentionnel réduit souvent la précision, ralentit la réponse ou augmente les erreurs. Dans beaucoup de cas, on ne fait pas réellement deux choses à la fois : on alterne rapidement entre elles, ce qui a aussi un coût cognitif.",
                },
                {
                    type: "quiz",
                    questionId: "attention_divisee_q2",
                },
                {
                    type: "quiz",
                    questionId: "attention_divisee_q3",
                },
                {
                    type: "recap",
                    points: [
                        "L'attention divisée correspond au partage des ressources",
                        "Le multitâche a souvent un coût en vitesse, précision ou qualité",
                        "Le changement rapide entre tâches peut lui-même être coûteux",
                    ],
                },
            ],
        },
        {
            id: "attention_stroop",
            title: "Le test de Stroop",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Quand l'automatique gêne le volontaire",
                    content:
                        "Dans la tâche de Stroop, on demande souvent de nommer la couleur de l'encre d'un mot, tout en ignorant le mot lui-même. Quand le mot et la couleur sont incompatibles, les réponses deviennent plus lentes et plus coûteuses.",
                },
                {
                    type: "quiz",
                    questionId: "attention_stroop_q1",
                },
                {
                    type: "explanation",
                    title: "Ce que révèle cette tâche",
                    content:
                        "L'effet Stroop révèle que certains traitements, comme la lecture, sont très automatiques. Pour suivre la consigne, il faut donc inhiber cette réponse dominante et contrôler plus activement l'attention.",
                },
                {
                    type: "quiz",
                    questionId: "attention_stroop_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'effet Stroop montre une interférence entre deux traitements",
                        "Il permet d'étudier l'inhibition et le contrôle attentionnel",
                    ],
                },
            ],
        },
        {
            id: "attention_automatique",
            title: "Automatique vs contrôlé",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "explanation",
                    title: "Deux styles de traitement",
                    content:
                        "Certains traitements cognitifs deviennent rapides, habituels et peu coûteux en attention : on les dit relativement automatiques. D'autres demandent au contraire une supervision consciente, un effort et un contrôle plus important : on parle alors de traitements contrôlés.",
                },
                {
                    type: "quiz",
                    questionId: "attention_automatique_q1",
                },
                {
                    type: "explanation",
                    title: "Quand les deux entrent en conflit",
                    content:
                        "L'un des grands enjeux de l'attention est justement de permettre aux traitements contrôlés de prendre le dessus lorsque les automatismes ne sont pas adaptés à la tâche. Les phénomènes d'interférence montrent que ce contrôle a un coût mesurable.",
                },
                {
                    type: "quiz",
                    questionId: "attention_automatique_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Les traitements automatiques sont rapides et peu coûteux en contrôle",
                        "Les traitements contrôlés demandent davantage d'effort attentionnel",
                        "L'interférence révèle le conflit entre ces deux modes de traitement",
                    ],
                },
            ],
        },
        {
            id: "attention_limites",
            title: "Les limites de l'attention",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Une ressource imparfaite",
                    content:
                        "L'attention est utile, mais elle a des limites. On peut manquer un détail important, négliger une information inattendue, ou perdre en performance quand trop de demandes concurrentes apparaissent en même temps.",
                },
                {
                    type: "quiz",
                    questionId: "attention_limites_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi ces limites comptent",
                    content:
                        "Comprendre ces limites permet d'expliquer beaucoup de phénomènes du quotidien : distraction, surcharge, erreurs sous pression, difficulté à suivre plusieurs tâches, ou besoin de réduire les interruptions pour mieux travailler.",
                },
                {
                    type: "quiz",
                    questionId: "attention_limites_q2",
                },
                {
                    type: "recap",
                    points: [
                        "L'attention a des limites réelles",
                        "Ces limites expliquent omissions, distractions et coûts de performance",
                    ],
                },
            ],
        },
        {
            id: "attention_pont",
            title: "Vers les nœuds spécialisés",
            type: "explanation",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "explanation",
                    title: "Un nœud d'introduction",
                    content:
                        "Ce nœud 'attention' sert de base avant d'entrer dans des branches plus spécialisées. Il introduit les idées centrales : sélection, maintien, division, contrôle, interférence et limites.",
                },
                {
                    type: "quiz",
                    questionId: "attention_pont_q1",
                },
                {
                    type: "explanation",
                    title: "Deux directions naturelles",
                    content:
                        "Une première branche logique porte sur l'attention sélective, c'est-à-dire le filtrage et la focalisation. Une seconde porte sur le contrôle attentionnel, où l'on étudie plus précisément l'inhibition, les conflits de traitement et les tâches comme Stroop.",
                },
                {
                    type: "quiz",
                    questionId: "attention_pont_q2",
                },
                {
                    type: "recap",
                    points: [
                        "Le nœud 'attention' prépare des branches plus spécifiques",
                        "Il mène naturellement vers l'attention sélective et le contrôle attentionnel",
                    ],
                },
            ],
        },
        {
            id: "attention_recap",
            title: "Récapitulatif",
            type: "recap",
            estimatedMinutes: 3,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "L'attention permet d'orienter des ressources limitées vers ce qui est pertinent",
                        "Elle peut sélectionner, maintenir ou répartir les ressources",
                        "L'attention sélective priorise une information au détriment d'autres",
                        "L'attention divisée correspond au partage de ressources entre plusieurs tâches",
                        "Le multitâche entraîne souvent des coûts de performance",
                        "L'effet Stroop montre l'interférence entre traitement automatique et contrôle attentionnel",
                        "Les limites de l'attention expliquent erreurs, distractions et omissions",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "attention_recap_q1",
                },
                {
                    type: "quiz",
                    questionId: "attention_recap_q2",
                },
            ],
        },
        {
            id: "attention_final_quiz",
            title: "Quiz Final — Attention",
            type: "final_quiz",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    content:
                        "Ce quiz final évalue ta compréhension des bases de l'attention avant l'ouverture des branches plus spécialisées. Il couvre les fonctions générales, l'attention sélective, l'attention divisée et le contrôle attentionnel.",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q1",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q2",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q3",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q4",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q5",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q6",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q7",
                },
                {
                    type: "quiz",
                    questionId: "attention_final_q8",
                },
            ],
        },
    ],
};