export type PracticeQuestion = {
    nodeId: string;
    question: string;
    type: "recall" | "relational" | "applicable";
    modelAnswer: string;
    followUp?: string;
};

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
    // Mémoire de travail
    {
        nodeId: "A",
        type: "recall",
        question: "Explique ce qu'est la mémoire de travail en une ou deux phrases, sans regarder tes notes.",
        modelAnswer: "La mémoire de travail est le système cognitif qui maintient et manipule temporairement l'information pendant qu'on l'utilise activement. Elle est limitée en capacité — environ 4 à 7 chunks — et volatile : son contenu disparaît en quelques secondes sans effort de maintien.",
        followUp: "Est-ce que ta réponse mentionnait la notion de chunk ? C'est souvent ce qu'on oublie.",
    },
    {
        nodeId: "A",
        type: "relational",
        question: "En une phrase : pourquoi est-ce que apprendre quelque chose de totalement nouveau est plus fatigant qu'apprendre quelque chose qui ressemble à ce qu'on sait déjà ?",
        modelAnswer: "Parce que sans connaissances préalables, chaque élément occupe un slot séparé en mémoire de travail. Avec des connaissances existantes, le cerveau peut chunker — regrouper plusieurs éléments en une seule unité significative — réduisant drastiquement la charge.",
        followUp: "Le lien entre mémoire de travail et expertise est l'une des clés pour comprendre pourquoi les débutants saturent si vite.",
    },
    {
        nodeId: "A",
        type: "applicable",
        question: "Tu conçois un cours pour des débutants complets. Que dit la mémoire de travail sur le nombre de concepts nouveaux que tu peux introduire en une seule séance ?",
        modelAnswer: "La mémoire de travail étant limitée à ~4 chunks pour un novice, introduire plus de 3 à 4 concepts nouveaux par séance risque de saturer le système et d'empêcher tout encodage en mémoire à long terme. Le principe de segmentation — diviser le contenu en petites unités séparées — est directement dérivé de cette limite.",
        followUp: "La plupart des cours magistraux violent ce principe systématiquement.",
    },

    // Effet de test
    {
        nodeId: "B",
        type: "recall",
        question: "Qu'est-ce que l'effet de test ? Décris-le sans utiliser le mot 'révision'.",
        modelAnswer: "L'effet de test désigne le phénomène par lequel tenter de récupérer une information de sa mémoire — même en échouant — consolide cette information bien plus efficacement que de simplement la lire ou l'écouter de nouveau. L'effort de récupération est lui-même le mécanisme d'apprentissage.",
        followUp: "La clé est le mot 'récupération'. C'est l'acte de chercher, pas de trouver, qui crée la trace mémorielle.",
    },
    {
        nodeId: "B",
        type: "relational",
        question: "Comment l'effet de test et la mémoire de travail s'articulent-ils ? Quel rôle joue la mémoire de travail pendant un test ?",
        modelAnswer: "Pendant un effort de récupération, la mémoire de travail est mobilisée pour chercher et reconstruire l'information depuis la mémoire à long terme. Cet effort actif de reconstruction — par opposition à la reconnaissance passive — force des connexions neuronales plus solides. La difficulté de la récupération est précisément ce qui la rend efficace.",
        followUp: "C'est le principe de 'desirable difficulty' de Bjork : ce qui est difficile à récupérer est mieux retenu.",
    },
    {
        nodeId: "B",
        type: "applicable",
        question: "Un étudiant te dit qu'il relit ses cours 5 fois avant un examen et qu'il trouve ça efficace. Que lui réponds-tu en t'appuyant sur l'effet de test ?",
        modelAnswer: "Le sentiment d'efficacité vient de la familiarité — le texte devient reconnaissable, ce qui est interprété à tort comme de la maîtrise. Mais la reconnaissance n'est pas la même chose que la capacité à récupérer. La suggestion serait de remplacer au moins 3 des 5 relectures par des tests actifs : fermer le cours et essayer d'écrire ce qu'on sait, même imparfaitement.",
        followUp: "Ce biais — confondre familiarité et maîtrise — est l'un des plus coûteux dans l'éducation.",
    },

    // Charge cognitive
    {
        nodeId: "C",
        type: "recall",
        question: "Qu'est-ce que la charge cognitive ? Distingue ses trois composantes sans regarder tes notes.",
        modelAnswer: "La charge cognitive est la quantité de ressources mentales mobilisées lors d'une tâche. Sweller distingue trois types : la charge intrinsèque (complexité inhérente du contenu), la charge extrinsèque (liée à la façon dont le contenu est présenté — et qui peut être réduite par un bon design), et la charge germane (ressources dédiées à la construction de schémas en mémoire à long terme).",
        followUp: "La charge extrinsèque est la seule qu'un enseignant ou designer peut réduire directement.",
    },
    {
        nodeId: "C",
        type: "relational",
        question: "Pourquoi une interface confuse ou un énoncé mal rédigé peut-il littéralement empêcher l'apprentissage ?",
        modelAnswer: "Parce que la mémoire de travail est partagée entre comprendre le contenu et naviguer l'interface. Si la présentation est confuse, une part des ressources cognitives est consommée par la charge extrinsèque — il en reste moins pour la charge germane, celle qui construit réellement le savoir. L'apprentissage ne s'arrête pas par manque de motivation, mais par saturation cognitive.",
        followUp: "C'est pourquoi la clarté d'une explication n'est pas un détail esthétique — c'est une condition pédagogique.",
    },
];