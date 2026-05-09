// import { type NodeType } from "./graphData";

export type FunFact = {
    fact: string;
    source: string;
    question: string;
    relatedNodeId: string;
};

export const FUN_FACTS: FunFact[] = [
    {
        fact: "Relire ses notes donne l'impression d'apprendre — mais des études montrent que cette méthode produit une rétention presque identique à ne rien faire du tout. Ce sentiment de maîtrise est une illusion cognitive documentée.",
        source: "Roediger & Karpicke, 2006",
        question: "Tu veux comprendre pourquoi se tromper est plus efficace que relire ?",
        relatedNodeId: "B",
    },
    {
        fact: "Ton cerveau consomme 20% de l'énergie totale de ton corps, alors qu'il ne représente que 2% de ta masse. Et pourtant, il ne peut maintenir activement que 4 à 7 éléments simultanément dans ta mémoire de travail.",
        source: "Baddeley, 2000",
        question: "Tu veux comprendre ce que cette limite implique pour apprendre ?",
        relatedNodeId: "A",
    },
    {
        fact: "Dans une expérience célèbre, des étudiants qui apprenaient sous l'eau se souvenaient mieux de l'information... sous l'eau. Le contexte d'apprentissage est encodé avec le souvenir lui-même.",
        source: "Godden & Baddeley, 1975",
        question: "Tu veux explorer comment le contexte façonne la mémoire ?",
        relatedNodeId: "C",
    },
    {
        fact: "Le cerveau humain ne distingue pas toujours entre imaginer faire quelque chose et le faire vraiment. Les athlètes qui visualisent mentalement leurs mouvements activent les mêmes circuits neuronaux que lors de l'entraînement physique.",
        source: "Jeannerod, 2001",
        question: "Tu veux comprendre comment l'imagination peut remplacer la pratique ?",
        relatedNodeId: "A",
    },
    {
        fact: "Une étude a montré que dormir après avoir appris quelque chose de nouveau double la rétention à long terme — comparé à rester éveillé. Le cerveau rejoue et consolide les souvenirs pendant le sommeil.",
        source: "Walker & Stickgold, 2006",
        question: "Tu veux voir comment le sommeil s'intègre dans une vraie stratégie d'apprentissage ?",
        relatedNodeId: "B",
    },
    {
        fact: "L'effet Dunning-Kruger ne dit pas que les ignorants se croient experts. Il dit que tout le monde, y compris les experts, surestime ses propres capacités dans les domaines où sa compétence est faible. Personne n'y échappe.",
        source: "Kruger & Dunning, 1999",
        question: "Tu veux comprendre comment les biais cognitifs affectent l'apprentissage ?",
        relatedNodeId: "C",
    },
    {
        fact: "Quand tu lis un mot, ton cerveau ne lit pas les lettres une par une. Il reconnaît la forme globale du mot en quelques millisecondes. C'est pourquoi tu peux lire un texte avec les lettres mélangées si la première et la dernière sont à leur place.",
        source: "Grainger & Whitney, 2004",
        question: "Tu veux explorer comment la reconnaissance de patterns structure la cognition ?",
        relatedNodeId: "A",
    },
    {
        fact: "L'espacement des révisions produit un effet contre-intuitif : plus l'oubli est avancé au moment de la révision, plus la consolidation est forte. Réviser juste avant d'oublier est plus efficace que réviser quand on se souvient encore bien.",
        source: "Bjork, 1994",
        question: "Tu veux comprendre la logique complète derrière l'apprentissage espacé ?",
        relatedNodeId: "B",
    },
    {
        fact: "Dans l'expérience du gorille invisible (1999), des participants comptant des passes de basket n'ont pas vu un homme en costume de gorille traverser le terrain. Ils n'étaient pas distraits — ils faisaient exactement ce qu'on leur avait demandé.",
        source: "Simons & Chabris, 1999",
        question: "Tu veux comprendre pourquoi l'attention est un filtre et non un enregistreur ?",
        relatedNodeId: "attention",
    },
    {
        fact: "Pendant le sommeil, l'hippocampe rejoue les souvenirs de la journée des centaines de fois à grande vitesse — les transférant progressivement vers le cortex. C'est pourquoi dormir après avoir appris double la rétention.",
        source: "Walker & Stickgold, 2004",
        question: "Tu veux explorer comment la consolidation mémorielle fonctionne ?",
        relatedNodeId: "memoire",
    },
    {
        fact: "Le patient H.M., après une opération cérébrale en 1953, pouvait encore apprendre de nouvelles compétences motrices — mais ne se souvenait jamais de les avoir apprises. La mémoire procédurale et la mémoire épisodique sont des systèmes biologiquement distincts.",
        source: "Milner, Corkin & Teuber, 1968",
        question: "Tu veux comprendre les différents systèmes de mémoire ?",
        relatedNodeId: "memoire",
    },
    {
        fact: "Un grand maître aux échecs peut mémoriser la position de toutes les pièces d'une partie réelle en quelques secondes. Mais face à des pièces placées aléatoirement, ses performances tombent au niveau d'un débutant. La mémoire experte dépend du sens, pas de la capacité brute.",
        source: "Chase & Simon, 1973",
        question: "Tu veux comprendre pourquoi le chunking définit l'expertise ?",
        relatedNodeId: "memoire_travail",
    },
];