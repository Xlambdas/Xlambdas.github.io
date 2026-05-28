import type { NodeType } from "../../types";

export const PsychologyNode: NodeType = {
    id: "psychologie",
    title: "Psychologie",
    type: "domain",
    links: ["memoire", "attention"],
    isUnlocked: true,
    prerequisites: [],
    branchColor: "#3b82f6",
    hook: "La psychologie pose une question radicale : comment transformer l'esprit, pourtant invisible, en objet de science ? Pour y répondre, elle a dû inventer des concepts, des méthodes et des débats qui structurent encore toute l'étude de la cognition aujourd'hui.",
    shortDescription: "Introduction complète à la psychologie comme science de l'esprit, du comportement et des méthodes qui les étudient.",
    badge: {
        id: "badge_psychologie",
        nodeId: "psychologie",
        icon: "🧠",
        name: "Esprit Scientifique",
        description: "Maîtrise des fondements théoriques et méthodologiques de la psychologie",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "psychologie_fondements_q1",
            lessonId: "psychologie_fondements",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quelle définition correspond le mieux à la psychologie dans ce nœud ?",
                choices: [
                    "L'étude philosophique de l'âme humaine sans vérification empirique",
                    "L'étude scientifique du comportement observable uniquement",
                    "L'étude scientifique du comportement et des processus mentaux",
                    "L'étude clinique des troubles mentaux graves uniquement",
                ],
                correctIndex: 2,
                explanation: "La psychologie est classiquement définie comme l'étude scientifique du comportement et des processus mentaux. ",
            },
        },
        {
            id: "psychologie_fondements_q2",
            lessonId: "psychologie_fondements",
            blockIndex: 4,
            question: {
                type: "sentence",
                question: "Explique en une ou deux phrases pourquoi l'esprit pose un défi scientifique particulier.",
                placeholder: "Parce que...",
                modelAnswer: "L'esprit n'est pas directement observable ; les psychologues doivent donc inférer les processus mentaux à partir de comportements, de performances, de temps de réaction ou de mesures cérébrales. ",
                explanation: "La difficulté fondamentale est qu'on n'observe pas directement les processus mentaux eux-mêmes. ",
            },
        },
        {
            id: "psychologie_origines_q1",
            lessonId: "psychologie_origines",
            blockIndex: 2,
            question: {
                type: "ordering",
                question: "Remets ces repères dans l'ordre historique le plus cohérent :",
                items: [
                    "Cours de philosophie morale et mentale",
                    "Laboratoire de Wundt à Leipzig",
                    "Domination du béhaviorisme",
                    "Révolution cognitive",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "L'histoire va des racines philosophiques vers la psychologie expérimentale, puis le béhaviorisme, puis la révolution cognitive. ",
            },
        },
        {
            id: "psychologie_origines_q2",
            lessonId: "psychologie_origines",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Pourquoi l'année 1879 est-elle souvent retenue en psychologie ?",
                choices: [
                    "Parce qu'elle marque la naissance officielle de la psychanalyse",
                    "Parce qu'elle correspond à l'ouverture du laboratoire de Wundt à Leipzig",
                    "Parce qu'elle correspond à la publication du premier manuel de neurosciences",
                    "Parce qu'elle marque l'abandon définitif de l'introspection",
                ],
                correctIndex: 1,
                explanation: "1879 est souvent présentée comme la date symbolique de fondation de la psychologie scientifique avec le laboratoire de Wundt. ",
            },
        },
        {
            id: "psychologie_origines_q3",
            lessonId: "psychologie_origines",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "L'introspection visait à produire des auto-descriptions détaillées de l'expérience consciente.",
                correct: true,
                explanation: "Oui. Dans les débuts de la psychologie expérimentale, l'introspection cherchait à décrire finement les contenus de conscience. ",
            },
        },
        {
            id: "psychologie_ecoles_q1",
            lessonId: "psychologie_ecoles",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque courant à son orientation dominante :",
                pairs: [
                    { left: "Béhaviorisme", right: "Comportement observable" },
                    { left: "Gestalt", right: "Le tout dépasse la somme des parties" },
                    { left: "Psychologie cognitive", right: "Processus mentaux et traitement de l'information" },
                ],
                explanation: "Ces trois courants se distinguent par ce qu'ils considèrent comme le bon niveau d'analyse. ",
            },
        },
        {
            id: "psychologie_ecoles_q2",
            lessonId: "psychologie_ecoles",
            blockIndex: 4,
            question: {
                type: "multiple_choice",
                question: "Quel reproche central la psychologie cognitive adresse-t-elle au béhaviorisme ?",
                choices: [
                    "Il utilisait trop de mathématiques",
                    "Il ignorait les mécanismes mentaux entre stimulus et réponse",
                    "Il étudiait trop le langage",
                    "Il était centré sur la perception globale",
                ],
                correctIndex: 1,
                explanation: "Le reproche fondamental est d'avoir laissé de côté les processus mentaux médiateurs. ",
            },
        },
        {
            id: "psychologie_ecoles_q3",
            lessonId: "psychologie_ecoles",
            blockIndex: 5,
            question: {
                type: "sentence",
                question: "En quoi la Gestalt a-t-elle préparé, au moins en partie, certaines idées cognitives ?",
                placeholder: "La Gestalt a préparé...",
                modelAnswer: "La Gestalt a insisté sur l'organisation globale de l'expérience et sur le fait que l'esprit structure activement l'information, ce qui a préparé certains thèmes repris ensuite par la psychologie cognitive. ",
                explanation: "La Gestalt a servi de précurseur en refusant une vision trop atomiste de l'expérience mentale. ",
            },
        },
        {
            id: "psychologie_cognition_q1",
            lessonId: "psychologie_cognition",
            blockIndex: 2,
            question: {
                type: "word_bank",
                question: "Complète la formulation :",
                sentence: "La psychologie cognitive étudie les ___ mentaux et traite l'esprit comme un système de ___ de l'information.",
                bank: ["processus", "traitement", "réflexes", "digestion", "muscles"],
                correctWords: ["processus", "traitement"],
                explanation: "Cette formulation résume le cœur du paradigme cognitif. ",
            },
        },
        {
            id: "psychologie_cognition_q2",
            lessonId: "psychologie_cognition",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces ensembles correspond le mieux à des objets d'étude cognitifs ?",
                choices: [
                    "Mémoire, attention, perception, langage, décision",
                    "Circulation sanguine, digestion, respiration, immunité",
                    "Réflexes spinaux, croissance osseuse, cicatrisation",
                    "Volcanisme, climat, plaques tectoniques, érosion",
                ],
                correctIndex: 0,
                explanation: "La cognition recouvre notamment l'attention, la mémoire, la perception, le langage et la décision. ",
            },
        },
        {
            id: "psychologie_cognition_q3",
            lessonId: "psychologie_cognition",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Dire que l'esprit traite l'information signifie que le cerveau fonctionne littéralement comme un ordinateur au sens matériel strict.",
                correct: false,
                explanation: "Faux. Il s'agit d'un cadre théorique ou d'une métaphore de travail, pas d'une identité matérielle stricte. ",
            },
        },
        {
            id: "psychologie_miller_q1",
            lessonId: "psychologie_miller",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Pourquoi George Miller occupe-t-il une place centrale dans l'histoire de la psychologie cognitive ?",
                choices: [
                    "Parce qu'il a rejeté toute étude expérimentale",
                    "Parce qu'il a contribué à réintroduire scientifiquement l'étude de l'esprit",
                    "Parce qu'il a prouvé que toute pensée est inconsciente",
                    "Parce qu'il a fondé la psychanalyse linguistique",
                ],
                correctIndex: 1,
                explanation: "George Miller est présenté comme une figure majeure de la révolution cognitive et de la réintroduction scientifique du mental. ",
            },
        },
        {
            id: "psychologie_miller_q2",
            lessonId: "psychologie_miller",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Que suggère l'idée de 'chunk' chez Miller ?",
                choices: [
                    "Que la mémoire immédiate conserve toujours des données brutes inchangées",
                    "Que l'esprit recode l'information en unités mentalement gérables",
                    "Que l'apprentissage dépend uniquement de récompenses externes",
                    "Que l'introspection suffit à mesurer toute cognition",
                ],
                correctIndex: 1,
                explanation: "Le chunking renvoie au recodage de l'information en unités plus manipulables par le système cognitif. ",
            },
        },
        {
            id: "psychologie_miller_q3",
            lessonId: "psychologie_miller",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Chez Miller, la limite de traitement renvoie à un goulot d'étranglement dans le traitement humain de l'information.",
                correct: true,
                explanation: "Oui. La source décrit un bottleneck ou goulot d'étranglement du traitement humain de l'information. ",
            },
        },
        {
            id: "psychologie_methodes_q1",
            lessonId: "psychologie_methodes",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de recherche à sa propriété principale :",
                pairs: [
                    { left: "Expérimentale", right: "Permet une inférence causale plus forte" },
                    { left: "Corrélationnelle", right: "Mesure une relation sans manipuler la variable" },
                    { left: "Longitudinale", right: "Suit les mêmes personnes dans le temps" },
                    { left: "Quasi-expérimentale", right: "Compare des groupes sans assignation aléatoire" },
                ],
                explanation: "Ces plans répondent à des questions différentes et n'autorisent pas les mêmes conclusions. ",
            },
        },
        {
            id: "psychologie_methodes_q2",
            lessonId: "psychologie_methodes",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Dans une expérience, quelle affirmation est correcte ?",
                choices: [
                    "La variable dépendante est manipulée par le chercheur",
                    "La variable indépendante dépend des réponses du participant",
                    "La variable indépendante est manipulée, et son effet est observé sur la variable dépendante",
                    "Aucune variable n'a besoin d'être contrôlée",
                ],
                correctIndex: 2,
                explanation: "L'expérience repose sur la manipulation d'une variable indépendante et l'observation de ses effets sur la variable dépendante. ",
            },
        },
        {
            id: "psychologie_methodes_q3",
            lessonId: "psychologie_methodes",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Une corrélation forte permet à elle seule de conclure à une causalité.",
                correct: false,
                explanation: "Faux. Une corrélation ne suffit pas à établir la causalité. ",
            },
        },
        {
            id: "psychologie_methodes_q4",
            lessonId: "psychologie_methodes",
            blockIndex: 5,
            question: {
                type: "sentence",
                question: "Pourquoi l'assignation aléatoire est-elle si importante en expérimentation ?",
                placeholder: "Elle est importante car...",
                modelAnswer: "L'assignation aléatoire aide à rendre les groupes comparables en moyenne sur les autres facteurs, ce qui renforce l'idée que la différence observée vient de la variable manipulée. ",
                explanation: "L'enjeu central est l'inférence causale. ",
            },
        },
        {
            id: "psychologie_chronometrie_q1",
            lessonId: "psychologie_chronometrie",
            blockIndex: 2,
            question: {
                type: "ordering",
                question: "Dans la logique de Donders, quel ordre va du plus simple au plus complexe ?",
                items: [
                    "Temps de réaction simple",
                    "Go/no-go",
                    "Temps de réaction à choix",
                ],
                correctOrder: [0, 1, 2],
                explanation: "Le temps de réaction simple est le plus élémentaire, puis vient l'identification go/no-go, puis la sélection de réponse dans le choix. ",
            },
        },
        {
            id: "psychologie_chronometrie_q2",
            lessonId: "psychologie_chronometrie",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Que cherche à isoler la méthode soustractive de Donders ?",
                choices: [
                    "Le poids du cerveau",
                    "La durée approximative de processus mentaux distincts",
                    "Le niveau exact d'intelligence générale",
                    "Le contenu conscient complet d'une pensée",
                ],
                correctIndex: 1,
                explanation: "La mental chronometry vise à estimer le temps de certains sous-processus mentaux à partir des différences de temps de réaction. ",
            },
        },
        {
            id: "psychologie_chronometrie_q3",
            lessonId: "psychologie_chronometrie",
            blockIndex: 4,
            question: {
                type: "true_false",
                question: "Un temps de réaction plus long signifie nécessairement une moins bonne psychologie individuelle globale.",
                correct: false,
                explanation: "Faux. Un allongement peut indiquer un traitement plus complexe, une étape supplémentaire ou d'autres facteurs contextuels. ",
            },
        },
        {
            id: "psychologie_validite_q1",
            lessonId: "psychologie_validite",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Lequel de ces éléments est un exemple de facteur de confusion méthodologique ?",
                choices: [
                    "Une variable parasite qui permet une meilleure inférence causale",
                    "Un facteur qui menace l'interprétation causale des résultats",
                    "Une répétition exacte de la variable dépendante",
                    "Une mesure cérébrale à haute résolution",
                ],
                correctIndex: 1,
                explanation: "Un confond compromet la possibilité de conclure correctement à une cause.",
            },
        },
        {
            id: "psychologie_validite_q2",
            lessonId: "psychologie_validite",
            blockIndex: 3,
            question: {
                type: "match_pairs",
                question: "Associe chaque risque méthodologique à sa description :",
                pairs: [
                    { left: "Effet placebo", right: "Le simple fait de croire recevoir un traitement influence la réponse" },
                    { left: "Demand characteristics", right: "Le participant essaie de se comporter comme il pense qu'on l'attend" },
                    { left: "Attentes de l'expérimentateur", right: "Le chercheur influence involontairement l'observation" },
                    { left: "Double aveugle", right: "Ni participant ni expérimentateur ne connaissent la condition" },
                ],
                explanation: "Ces notions sont cruciales pour comprendre pourquoi une étude peut sembler convaincante tout en étant fragile. ",
            },
        },
        {
            id: "psychologie_validite_q3",
            lessonId: "psychologie_validite",
            blockIndex: 4,
            question: {
                type: "sentence",
                question: "Explique pourquoi 'corrélation n'implique pas causalité' est un principe central en psychologie.",
                placeholder: "Ce principe est central car...",
                modelAnswer: "Parce qu'une relation observée peut refléter une causalité inverse ou l'effet d'une troisième variable ; sans manipulation ou plan adapté, on ne peut pas conclure solidement à la cause. ",
                explanation: "Ce principe protège contre les interprétations abusives des données. ",
            },
        },
        {
            id: "psychologie_interdiscipline_q1",
            lessonId: "psychologie_interdiscipline",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "La révolution cognitive est liée à l'émergence conjointe de plusieurs disciplines. Lequel de ces ensembles est le plus juste ?",
                choices: [
                    "Linguistique, neurosciences, informatique",
                    "Chimie organique, astronomie, géologie",
                    "Botanique, météorologie, océanographie",
                    "Théologie, architecture, archéologie",
                ],
                correctIndex: 0,
                explanation: "La source souligne l'émergence conjointe de la linguistique, des neurosciences et de l'informatique dans la révolution cognitive. ",
            },
        },
        {
            id: "psychologie_interdiscipline_q2",
            lessonId: "psychologie_interdiscipline",
            blockIndex: 3,
            question: {
                type: "true_false",
                question: "La psychologie cognitive s'est développée comme champ entièrement isolé des autres sciences.",
                correct: false,
                explanation: "Faux. Son développement est profondément interdisciplinaire. ",
            },
        },
        {
            id: "psychologie_interdiscipline_q3",
            lessonId: "psychologie_interdiscipline",
            blockIndex: 4,
            question: {
                type: "sentence",
                question: "Pourquoi l'interdisciplinarité a-t-elle renforcé la psychologie cognitive ?",
                placeholder: "Elle l'a renforcée car...",
                modelAnswer: "Parce que différents problèmes sur l'esprit exigeaient des apports croisés : langage, calcul, cerveau, représentation, comportement et méthodes expérimentales. ",
                explanation: "La cognition dépasse les frontières d'une seule discipline. ",
            },
        },
        {
            id: "psychologie_objets_q1",
            lessonId: "psychologie_objets",
            blockIndex: 2,
            question: {
                type: "match_pairs",
                question: "Associe chaque objet d'étude à la bonne description :",
                pairs: [
                    { left: "Perception", right: "Transformation des stimulations en expérience signifiante" },
                    { left: "Mémoire", right: "Encodage, maintien ou récupération d'information" },
                    { left: "Attention", right: "Sélection et allocation des ressources de traitement" },
                    { left: "Décision", right: "Choix entre plusieurs réponses ou options" },
                ],
                explanation: "Ces objets d'étude structurent une grande partie des branches futures de la psychologie cognitive. ",
            },
        },
        {
            id: "psychologie_objets_q2",
            lessonId: "psychologie_objets",
            blockIndex: 3,
            question: {
                type: "multiple_choice",
                question: "Pourquoi ce nœud ne traite-t-il pas encore à fond la mémoire et l'attention ?",
                choices: [
                    "Parce qu'elles ne relèvent pas de la psychologie",
                    "Parce qu'elles seront développées dans les nœuds liés, après les bases générales",
                    "Parce qu'elles sont trop simples pour mériter un nœud",
                    "Parce qu'elles ne peuvent pas être étudiées expérimentalement",
                ],
                correctIndex: 1,
                explanation: "La structure du graphe sépare les fondements généraux des développements spécialisés. ",
            },
        },
        {
            id: "psychologie_objets_q3",
            lessonId: "psychologie_objets",
            blockIndex: 4,
            question: {
                type: "word_bank",
                question: "Complète :",
                sentence: "Dans ce nœud, la psychologie fournit un cadre général avant des nœuds plus ___ comme la mémoire et l'attention.",
                bank: ["spécifiques", "aléatoires", "biologiques", "simultanés"],
                correctWords: ["spécifiques"],
                explanation: "Le rôle du nœud est fondamental et préparatoire. ",
            },
        },
        {
            id: "psychologie_recap_q1",
            lessonId: "psychologie_recap",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Ordonne ces idées dans la progression intellectuelle du nœud :",
                items: [
                    "Définir la psychologie comme science",
                    "Situer ses grandes étapes historiques",
                    "Comprendre le paradigme cognitif",
                    "Étudier les méthodes et leurs limites",
                ],
                correctOrder: [0, 1, 2, 3],
                explanation: "La progression va du plus général au plus méthodologique. ",
            },
        },
        {
            id: "psychologie_recap_q2",
            lessonId: "psychologie_recap",
            blockIndex: 2,
            question: {
                type: "sentence",
                question: "Donne une mini-synthèse de ce qu'apporte la psychologie cognitive par rapport au béhaviorisme.",
                placeholder: "La psychologie cognitive apporte...",
                modelAnswer: "Elle réintroduit les processus mentaux comme objets scientifiques légitimes, au lieu de limiter l'analyse au seul comportement observable. ",
                explanation: "La rupture conceptuelle essentielle est là. ",
            },
        },

        {
            id: "psychologie_final_q1",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quelle définition correspond le mieux à la psychologie dans ce nœud ?",
                choices: [
                    "L'étude philosophique de l'âme humaine sans vérification empirique",
                    "L'étude scientifique du comportement observable uniquement",
                    "L'étude scientifique du comportement et des processus mentaux",
                    "L'étude clinique des troubles mentaux graves uniquement",
                ],
                correctIndex: 2,
                explanation: "La psychologie est classiquement définie comme l'étude scientifique du comportement et des processus mentaux. ",
            },
        },
        {
            id: "psychologie_final_q2",
            lessonId: "psychologie_final_quiz",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Pourquoi l'année 1879 est-elle souvent retenue en psychologie ?",
                choices: [
                    "Parce qu'elle marque la naissance officielle de la psychanalyse",
                    "Parce qu'elle correspond à l'ouverture du laboratoire de Wundt à Leipzig",
                    "Parce qu'elle correspond à la publication du premier manuel de neurosciences",
                    "Parce qu'elle marque l'abandon définitif de l'introspection",
                ],
                correctIndex: 1,
                explanation: "1879 est souvent présentée comme la date symbolique de fondation de la psychologie scientifique avec le laboratoire de Wundt. ",
            },
        },
        {
            id: "psychologie_final_q3",
            lessonId: "psychologie_final_quiz",
            blockIndex: 3,
            question: {
                type: "match_pairs",
                question: "Associe chaque courant à son orientation dominante :",
                pairs: [
                    { left: "Béhaviorisme", right: "Comportement observable" },
                    { left: "Gestalt", right: "Le tout dépasse la somme des parties" },
                    { left: "Psychologie cognitive", right: "Processus mentaux et traitement de l'information" },
                ],
                explanation: "Ces trois courants se distinguent par ce qu'ils considèrent comme le bon niveau d'analyse. ",
            },
        },
        {
            id: "psychologie_final_q4",
            lessonId: "psychologie_final_quiz",
            blockIndex: 4,
            question: {
                type: "word_bank",
                question: "Complète la formulation :",
                sentence: "La psychologie cognitive étudie les ___ mentaux et traite l'esprit comme un système de ___ de l'information.",
                bank: ["processus", "traitement", "réflexes", "digestion", "muscles"],
                correctWords: ["processus", "traitement"],
                explanation: "Cette formulation résume le cœur du paradigme cognitif. ",
            },
        },
        {
            id: "psychologie_final_q5",
            lessonId: "psychologie_final_quiz",
            blockIndex: 5,
            question: {
                type: "multiple_choice",
                question: "Pourquoi George Miller occupe-t-il une place centrale dans l'histoire de la psychologie cognitive ?",
                choices: [
                    "Parce qu'il a rejeté toute étude expérimentale",
                    "Parce qu'il a contribué à réintroduire scientifiquement l'étude de l'esprit",
                    "Parce qu'il a prouvé que toute pensée est inconsciente",
                    "Parce qu'il a fondé la psychanalyse linguistique",
                ],
                correctIndex: 1,
                explanation: "George Miller est présenté comme une figure majeure de la révolution cognitive et de la réintroduction scientifique du mental. ",
            },
        },
        {
            id: "psychologie_final_q6",
            lessonId: "psychologie_final_quiz",
            blockIndex: 6,
            question: {
                type: "match_pairs",
                question: "Associe chaque type de recherche à sa propriété principale :",
                pairs: [
                    { left: "Expérimentale", right: "Permet une inférence causale plus forte" },
                    { left: "Corrélationnelle", right: "Mesure une relation sans manipuler la variable" },
                    { left: "Longitudinale", right: "Suit les mêmes personnes dans le temps" },
                    { left: "Quasi-expérimentale", right: "Compare des groupes sans assignation aléatoire" },
                ],
                explanation: "Ces plans répondent à des questions différentes et n'autorisent pas les mêmes conclusions. ",
            },
        },
        {
            id: "psychologie_final_q7",
            lessonId: "psychologie_final_quiz",
            blockIndex: 7,
            question: {
                type: "multiple_choice",
                question: "Que cherche à isoler la méthode soustractive de Donders ?",
                choices: [
                    "Le poids du cerveau",
                    "La durée approximative de processus mentaux distincts",
                    "Le niveau exact d'intelligence générale",
                    "Le contenu conscient complet d'une pensée",
                ],
                correctIndex: 1,
                explanation: "La mental chronometry vise à estimer le temps de certains sous-processus mentaux à partir des différences de temps de réaction. ",
            },
        },
        {
            id: "psychologie_final_q8",
            lessonId: "psychologie_final_quiz",
            blockIndex: 8,
            question: {
                type: "match_pairs",
                question: "Associe chaque risque méthodologique à sa description :",
                pairs: [
                    { left: "Effet placebo", right: "Le simple fait de croire recevoir un traitement influence la réponse" },
                    { left: "Demand characteristics", right: "Le participant essaie de se comporter comme il pense qu'on l'attend" },
                    { left: "Attentes de l'expérimentateur", right: "Le chercheur influence involontairement l'observation" },
                    { left: "Double aveugle", right: "Ni participant ni expérimentateur ne connaissent la condition" },
                ],
                explanation: "Ces notions sont cruciales pour comprendre pourquoi une étude peut sembler convaincante tout en étant fragile. ",
            },
        },
        {
            id: "psychologie_final_q9",
            lessonId: "psychologie_final_quiz",
            blockIndex: 9,
            question: {
                type: "multiple_choice",
                question: "La révolution cognitive est liée à l'émergence conjointe de plusieurs disciplines. Lequel de ces ensembles est le plus juste ?",
                choices: [
                    "Linguistique, neurosciences, informatique",
                    "Chimie organique, astronomie, géologie",
                    "Botanique, météorologie, océanographie",
                    "Théologie, architecture, archéologie",
                ],
                correctIndex: 0,
                explanation: "La source souligne l'émergence conjointe de la linguistique, des neurosciences et de l'informatique dans la révolution cognitive. ",
            },
        },
        {
            id: "psychologie_final_q10",
            lessonId: "psychologie_final_quiz",
            blockIndex: 10,
            question: {
                type: "match_pairs",
                question: "Associe chaque objet d'étude à la bonne description :",
                pairs: [
                    { left: "Perception", right: "Transformation des stimulations en expérience signifiante" },
                    { left: "Mémoire", right: "Encodage, maintien ou récupération d'information" },
                    { left: "Attention", right: "Sélection et allocation des ressources de traitement" },
                    { left: "Décision", right: "Choix entre plusieurs réponses ou options" },
                ],
                explanation: "Ces objets d'étude structurent une grande partie des branches futures de la psychologie cognitive. ",
            },
        },
    ],
    lessonPath: [
        {
            id: "psychologie_fondements",
            title: "Pourquoi la psychologie est une science difficile",
            type: "vignette",
            estimatedMinutes: 6,
            blocks: [
                {
                    type: "vignette",
                    title: "Tu observes sans voir",
                    content: "Tu regardes une personne fixer une porte, hésiter, puis revenir sur ses pas. Tu vois son comportement, mais pas directement son doute, sa mémoire, son attention ni son raisonnement. La psychologie commence précisément avec cette difficulté : comprendre scientifiquement ce qui ne se laisse pas observer comme un objet matériel ordinaire. ",
                },
                {
                    type: "explanation",
                    title: "Définir l'objet",
                    content: "Dans ce nœud, la psychologie est comprise comme l'étude scientifique du comportement et des processus mentaux. Cela veut dire qu'elle n'étudie pas seulement ce que les gens font, mais aussi comment ils perçoivent, mémorisent, décident, interprètent et organisent leur expérience. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_fondements_q1",
                },
                {
                    type: "explanation",
                    title: "Le problème central",
                    content: "Le comportement est visible ; les processus mentaux ne le sont pas directement. Toute la psychologie scientifique doit donc inventer des moyens indirects d'inférer ce qui se passe entre un stimulus, une situation, une consigne, et la réponse produite. C'est ce problème d'accès indirect qui rend la discipline à la fois complexe et fascinante. ",
                },
                // {
                //     type: "quiz",
                //     questionId: "psychologie_fondements_q2",
                // },
                {
                    type: "recap",
                    points: [
                        "La psychologie étudie scientifiquement le comportement et les processus mentaux ",
                        "Son objet est difficile car les processus mentaux sont indirectement observables ",
                        "Toute la discipline repose sur des inférences construites à partir de méthodes rigoureuses ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_origines",
            title: "Des racines philosophiques à la psychologie expérimentale",
            type: "explanation",
            estimatedMinutes: 7,
            blocks: [
                {
                    type: "explanation",
                    title: "Avant la psychologie scientifique",
                    content: "Pendant longtemps, les questions sur l'esprit relevaient surtout de la philosophie. Des traditions comme l'empirisme ont insisté sur le rôle de l'expérience et des sens dans la construction de la connaissance, préparant le terrain à une approche plus scientifique de l'esprit. ",
                },
                {
                    type: "explanation",
                    title: "Le basculement expérimental",
                    content: "La psychologie moderne se constitue réellement lorsqu'elle affirme que les phénomènes mentaux peuvent être étudiés expérimentalement. Le laboratoire de Wundt à Leipzig, en 1879, est souvent retenu comme date symbolique de cette fondation, parce qu'il institutionnalise l'idée d'une psychologie expérimentale autonome. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_origines_q1",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_origines_q2",
                },
                {
                    type: "explanation",
                    title: "L'introspection comme première méthode",
                    content: "Au début, l'une des méthodes centrales est l'introspection : des participants entraînés doivent décrire avec précision leurs réactions conscientes à différents stimuli. Cette méthode a joué un rôle historique important, même si ses limites de fiabilité et de reproductibilité ont ensuite conduit la discipline à chercher d'autres outils. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_origines_q3",
                },
                {
                    type: "recap",
                    points: [
                        "La psychologie a des racines philosophiques anciennes, mais une institutionnalisation scientifique plus récente ",
                        "1879 et le laboratoire de Wundt servent de repère fondateur classique ",
                        "L'introspection a été une méthode importante mais limitée des débuts ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_ecoles",
            title: "Les grandes écoles qui ont structuré la psychologie",
            type: "explanation",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    title: "Pourquoi les écoles comptent",
                    content: "La psychologie ne s'est pas développée comme un bloc homogène. Elle a été structurée par des écoles qui ne s'accordaient pas sur ce qu'il fallait étudier, ni sur la bonne méthode, ni même sur ce que signifie 'expliquer' un comportement humain. ",
                },
                {
                    type: "explanation",
                    title: "Trois repères majeurs",
                    content: "La Gestalt insiste sur l'organisation globale de l'expérience et sur l'idée que le tout ne se réduit pas à l'addition de ses parties. Le béhaviorisme recentre la psychologie sur le comportement observable. La psychologie cognitive réintroduit les processus mentaux comme objets scientifiques légitimes. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_ecoles_q1",
                },
                {
                    type: "explanation",
                    title: "La critique du béhaviorisme",
                    content: "Le béhaviorisme a imposé un standard d'objectivité puissant, mais au prix d'un appauvrissement théorique : entre le stimulus et la réponse, il restait peu de place pour une analyse des représentations, des décisions, de la mémoire ou des stratégies mentales. La psychologie cognitive s'est construite en grande partie contre cette réduction. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_ecoles_q2",
                },
                // {
                //     type: "quiz",
                //     questionId: "psychologie_ecoles_q3",
                // },
                {
                    type: "recap",
                    points: [
                        "Les écoles psychologiques diffèrent par leur objet, leur méthode et leur niveau d'explication ",
                        "La Gestalt a défendu une approche globale de l'expérience ",
                        "Le béhaviorisme s'est centré sur le comportement observable ",
                        "La psychologie cognitive a réintroduit les processus mentaux dans le champ scientifique ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_cognition",
            title: "Le paradigme cognitif et l'idée de traitement de l'information",
            type: "explanation",
            estimatedMinutes: 7,
            blocks: [
                {
                    type: "explanation",
                    title: "Le cœur du tournant cognitif",
                    content: "La psychologie cognitive propose que l'esprit puisse être étudié comme un système de traitement de l'information. Cette formule ne veut pas dire que l'humain serait une machine au sens simpliste ; elle fournit surtout un cadre théorique pour décrire comment l'information est reçue, sélectionnée, transformée, stockée et utilisée. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_cognition_q1",
                },
                {
                    type: "explanation",
                    title: "Quels processus sont concernés",
                    content: "Dans ce cadre, la psychologie s'intéresse à des processus comme la perception, l'attention, la mémoire, le langage, la résolution de problèmes, la prise de décision et la pensée. Autrement dit, elle cherche à décrire les opérations mentales qui médiatisent notre rapport au monde. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_cognition_q2",
                },
                {
                    type: "explanation",
                    title: "Une métaphore utile, pas une identité",
                    content: "Le langage du traitement de l'information a été extraordinairement fécond, mais il faut le manier avec nuance. Il s'agit d'une manière de modéliser l'esprit et de produire des hypothèses testables, non d'affirmer que le cerveau serait littéralement réductible à un ordinateur classique. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_cognition_q3",
                },
                {
                    type: "recap",
                    points: [
                        "La cognition renvoie à des processus mentaux comme perception, mémoire, langage et décision ",
                        "Le traitement de l'information est un cadre théorique central de la psychologie cognitive ",
                        "Cette idée est heuristique et explicative, pas une identité matérielle stricte ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_miller",
            title: "George Miller et la révolution cognitive",
            type: "vignette",
            estimatedMinutes: 7,
            blocks: [
                {
                    type: "vignette",
                    title: "Le retour du mental",
                    content: "Tu arrives dans une période où parler de 'mental' en psychologie expérimentale ressemble presque à une provocation. Pourtant, certains chercheurs commencent à penser que sans concepts mentaux, la psychologie ne peut pas expliquer sérieusement le langage, la mémoire ou le raisonnement. George Miller devient l'une des figures de ce basculement. ",
                },
                {
                    type: "explanation",
                    title: "Un acteur central",
                    content: "Harvard présente George A. Miller comme un 'father of the cognitive revolution'. Son apport ne se réduit pas à une formule célèbre : il a aidé à rendre de nouveau scientifiquement légitime l'étude de l'esprit, contre l'héritage dominant du béhaviorisme. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_miller_q1",
                },
                {
                    type: "explanation",
                    title: "Capacité limitée et chunking",
                    content: "Dans ses travaux sur la mémoire immédiate et la capacité du système humain, Miller montre que la performance humaine est contrainte par des limites de traitement. Mais il souligne aussi que l'esprit ne transmet pas passivement l'information : il la recode en unités plus efficaces, les 'chunks', ce qui modifie notre manière de penser la capacité mentale. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_miller_q2",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_miller_q3",
                },
                {
                    type: "recap",
                    points: [
                        "George Miller est une figure fondatrice majeure de la révolution cognitive ",
                        "Il a contribué à redonner une légitimité scientifique à l'étude du mental ",
                        "Ses travaux sur la capacité limitée et les chunks ont marqué durablement la psychologie cognitive ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_methodes",
            title: "Les grands types de méthodes en psychologie",
            type: "explanation",
            estimatedMinutes: 9,
            blocks: [
                {
                    type: "explanation",
                    title: "Pourquoi la méthode est décisive",
                    content: "En psychologie, la valeur d'une conclusion dépend fortement du plan de recherche qui la produit. La même hypothèse peut sembler convaincante ou fragile selon qu'elle provient d'une expérience contrôlée, d'une corrélation, d'une étude longitudinale ou d'un quasi-plan expérimental. ",
                },
                {
                    type: "explanation",
                    title: "Comparer les plans",
                    content: "L'expérimentation manipule une variable indépendante et observe son effet sur une variable dépendante ; elle est donc particulièrement puissante pour l'inférence causale. La corrélation observe des relations sans manipulation. Les études longitudinales suivent les mêmes personnes dans le temps. Les quasi-expériences comparent des groupes sans assignation aléatoire. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_methodes_q1",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_methodes_q2",
                },
                {
                    type: "explanation",
                    title: "Ce qu'on peut conclure, ce qu'on ne peut pas conclure",
                    content: "Une erreur fréquente consiste à confondre relation et causalité. Deux variables peuvent évoluer ensemble sans que l'une cause l'autre : la causalité peut être inversée, ou bien une troisième variable peut expliquer les deux. C'est pourquoi la psychologie insiste autant sur la précision méthodologique. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_methodes_q3",
                },
                // {
                //     type: "quiz",
                //     questionId: "psychologie_methodes_q4",
                // },
                {
                    type: "recap",
                    points: [
                        "Tous les plans de recherche ne donnent pas le même type de preuve ",
                        "L'expérimentation renforce l'inférence causale grâce à la manipulation et au contrôle ",
                        "La corrélation décrit des relations mais ne suffit pas à elle seule pour conclure à une cause ",
                        "Le choix d'une méthode dépend à la fois de la question, des ressources et des contraintes éthiques ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_chronometrie",
            title: "Temps de réaction et chronométrie mentale",
            type: "explanation",
            estimatedMinutes: 7,
            blocks: [
                {
                    type: "explanation",
                    title: "Mesurer l'invisible par le temps",
                    content: "Bien avant les techniques modernes d'imagerie, des chercheurs ont compris qu'on pouvait apprendre quelque chose sur l'esprit à partir du temps nécessaire pour répondre. Si deux tâches se ressemblent mais que l'une ajoute une opération mentale, l'écart de temps peut donner un indice sur le coût de cette opération. ",
                },
                {
                    type: "explanation",
                    title: "Donders et la méthode soustractive",
                    content: "Donders distingue notamment le temps de réaction simple, la tâche go/no-go et le temps de réaction à choix. Sa logique est de comparer ces tâches pour estimer la durée relative de sous-processus comme l'identification d'un stimulus ou la sélection d'une réponse. Cette approche est appelée chronométrie mentale. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_chronometrie_q1",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_chronometrie_q2",
                },
                {
                    type: "explanation",
                    title: "Interpréter avec prudence",
                    content: "Un temps de réaction n'est jamais une vérité brute sur l'intelligence ou la qualité globale d'un sujet. C'est une donnée interprétable seulement dans un cadre théorique précis, avec une tâche bien définie et des hypothèses claires sur les opérations mentales engagées. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_chronometrie_q3",
                },
                {
                    type: "recap",
                    points: [
                        "Les temps de réaction servent à inférer indirectement des processus mentaux ",
                        "La chronométrie mentale repose sur des comparaisons structurées entre tâches ",
                        "L'interprétation des temps doit rester théorique et prudente ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_validite",
            title: "Validité, biais et prudence scientifique",
            type: "explanation",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    title: "Pourquoi une étude peut tromper",
                    content: "Une étude peut sembler convaincante tout en reposant sur un dispositif fragile. En psychologie, le danger ne vient pas seulement d'une absence de données, mais aussi de facteurs qui biaisent l'interprétation : attentes des participants, attentes du chercheur, effets placebo, ou variables parasites non contrôlées. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_validite_q1",
                },
                {
                    type: "explanation",
                    title: "Confonds et procédures de contrôle",
                    content: "Les confonds affaiblissent la capacité d'une étude à justifier une conclusion causale. Les procédures comme le double aveugle cherchent précisément à limiter les effets d'attente, aussi bien du côté des participants que du côté des expérimentateurs. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_validite_q2",
                },
                {
                    type: "explanation",
                    title: "Le principe de prudence",
                    content: "L'une des grandes leçons de la psychologie scientifique est qu'une relation observée n'est pas automatiquement une explication. Dire 'corrélation n'implique pas causalité' n'est pas une formule scolaire vide : c'est une règle intellectuelle qui protège l'interprétation contre la surconfiance. ",
                },
                // {
                //     type: "quiz",
                //     questionId: "psychologie_validite_q3",
                // },
                {
                    type: "recap",
                    points: [
                        "Une étude doit être jugée aussi par sa validité méthodologique, pas seulement par son résultat ",
                        "Les confonds, attentes et effets placebo peuvent fausser l'interprétation ",
                        "Le double aveugle et d'autres contrôles renforcent la crédibilité des conclusions ",
                        "La prudence causale est une norme centrale en psychologie ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_interdiscipline",
            title: "Pourquoi la psychologie moderne est interdisciplinaire",
            type: "explanation",
            estimatedMinutes: 6,
            blocks: [
                {
                    type: "explanation",
                    title: "La cognition dépasse une seule discipline",
                    content: "La révolution cognitive ne s'est pas produite dans un vase clos. Elle a émergé à un moment où la linguistique, les neurosciences et l'informatique devenaient elles aussi des ressources puissantes pour penser la représentation, le calcul, le langage et les mécanismes du comportement intelligent. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_interdiscipline_q1",
                },
                {
                    type: "explanation",
                    title: "Ce que cela change",
                    content: "Cette interdisciplinarité a transformé la psychologie. Elle l'a poussée à articuler comportements, représentations, cerveau, langage, modélisation et traitement de l'information. La psychologie moderne ne perd pas son identité pour autant ; elle gagne au contraire en profondeur explicative. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_interdiscipline_q2",
                },
                // {
                //     type: "quiz",
                //     questionId: "psychologie_interdiscipline_q3",
                // },
                {
                    type: "recap",
                    points: [
                        "La psychologie cognitive s'est développée avec d'autres disciplines ",
                        "Linguistique, neurosciences et informatique ont joué un rôle majeur ",
                        "L'interdisciplinarité permet d'expliquer plus finement les phénomènes mentaux ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_objets",
            title: "Les grands objets d'étude de la psychologie",
            type: "explanation",
            estimatedMinutes: 7,
            blocks: [
                {
                    type: "explanation",
                    title: "Cartographier le domaine",
                    content: "La psychologie cognitive n'est pas un sujet unique mais une constellation de problèmes : comment nous percevons, comment nous sélectionnons l'information pertinente, comment nous retenons et récupérons ce que nous avons appris, comment nous comprenons le langage, comment nous résolvons un problème et comment nous décidons. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_objets_q1",
                },
                {
                    type: "explanation",
                    title: "Pourquoi un nœud général avant les branches",
                    content: "Ce nœud 'psychologie' joue un rôle de fondation. Il donne les concepts, les méthodes, les débats et le vocabulaire général nécessaires pour que les nœuds suivants, comme 'mémoire' et 'attention', puissent être étudiés plus en profondeur sans que l'apprenant ne les reçoive comme des faits isolés. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_objets_q2",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_objets_q3",
                },
                {
                    type: "recap",
                    points: [
                        "La psychologie couvre plusieurs objets d'étude mentaux majeurs ",
                        "Ce nœud donne une carte générale avant les spécialisations ",
                        "Mémoire et attention sont des branches futures, pas des contenus à épuiser ici ",
                    ],
                },
            ],
        },
        {
            id: "psychologie_recap",
            title: "Récapitulatif des fondements",
            type: "recap",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "La psychologie est une science du comportement et des processus mentaux ",
                        "Elle est née d'un passage des spéculations philosophiques vers des méthodes expérimentales ",
                        "Wundt et l'introspection appartiennent aux débuts institutionnels de la discipline ",
                        "Le béhaviorisme a imposé l'étude du comportement observable ",
                        "La psychologie cognitive a réintroduit le mental comme objet scientifique légitime ",
                        "George Miller a joué un rôle clé dans la révolution cognitive ",
                        "Les méthodes psychologiques diffèrent fortement par le type de conclusion qu'elles autorisent ",
                        "La chronométrie mentale montre comment le temps de réponse peut informer sur les processus mentaux ",
                        "La validité méthodologique et la prudence causale sont essentielles ",
                        "Ce nœud prépare les futurs approfondissements sans les confondre avec ses propres objectifs ",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "psychologie_recap_q1",
                },
                // {
                //     type: "quiz",
                //     questionId: "psychologie_recap_q2",
                // },
            ],
        },
        {
            id: "psychologie_final_quiz",
            title: "Quiz final — Psychologie",
            type: "final_quiz",
            estimatedMinutes: 10,
            blocks: [
                {
                    type: "explanation",
                    content: "Ce quiz final reprend des questions déjà rencontrées dans les leçons pour consolider durablement les fondements du nœud. Il vérifie surtout ta capacité à relier définition, histoire, paradigmes, méthodes et précautions d'interprétation. ",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q1",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q2",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q3",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q4",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q5",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q6",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q7",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q8",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q9",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q10",
                },
            ],
        },
    ],
};
