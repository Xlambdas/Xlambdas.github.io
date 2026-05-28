export type FunFact = {
    fact: string;
    source: string;
    question: string;
    relatedNodeId: string;
};

export const FUN_FACTS: FunFact[] = [
    {
        fact: "Tu peux regarder droit vers un gorille pendant plusieurs secondes… et ne pas le voir. Dans l'expérience de Simons et Chabris, des participants occupés à compter des passes de basket ont raté un gorille traversant la scène, preuve spectaculaire que l'attention sélectionne — elle n'enregistre pas tout.",
        source: "Simons & Chabris, 1999",
        question: "Tu veux voir pourquoi l'attention agit comme un filtre plutôt qu'une caméra ?",
        relatedNodeId: "attention",
    },
    {
        fact: "Faire un test n'est pas seulement une manière de vérifier ce que tu sais : c'est déjà une manière d'apprendre. Roediger et Karpicke ont montré que sur des tests différés, le rappel actif améliore davantage la rétention à long terme que la simple relecture, même quand la relecture donne plus de confiance sur le moment.",
        source: "Roediger & Karpicke, 2006",
        question: "Tu veux comprendre pourquoi récupérer une info est plus puissant que la relire ?",
        relatedNodeId: "memoire",
    },
    {
        fact: "Des plongeurs ont appris des listes de mots sous l'eau… et les rappelaient mieux sous l'eau. L'étude classique de Godden et Baddeley a rendu célèbre l'idée que le contexte d'apprentissage peut servir d'indice de récupération, même si les réplications plus récentes rappellent que ce type d'effet dépend beaucoup des conditions exactes.",
        source: "Godden & Baddeley, 1975",
        question: "Tu veux explorer comment le contexte peut aider — ou parfois ne pas aider — la mémoire ?",
        relatedNodeId: "memoire",
    },
    {
        fact: "Imaginer un mouvement n'est pas juste 'penser très fort' : selon la théorie de la simulation motrice, l'imagerie mentale mobilise des mécanismes neuronaux proches de ceux de l'action réelle. Autrement dit, visualiser un geste active en partie le cerveau de l'action, même sans bouger.",
        source: "Jeannerod, 2001",
        question: "Tu veux comprendre pourquoi l'imagerie mentale peut renforcer l'apprentissage moteur ?",
        relatedNodeId: "neurosciences",
    },
    {
        fact: "Dormir après avoir appris n'est pas une pause dans l'apprentissage : c'en est une étape. Des revues récentes expliquent que, pendant le sommeil, des représentations liées à l'hippocampe sont rejouées de façon répétée et rapide, ce qui contribue à la consolidation vers des réseaux corticaux plus durables.",
        source: "Klinzing, Niethard & Born, 2019",
        question: "Tu veux voir comment le sommeil transforme un souvenir fragile en trace plus stable ?",
        relatedNodeId: "consolidation",
    },
    {
        fact: "Le patient H.M. pouvait apprendre de nouvelles habiletés… sans se souvenir les avoir apprises. Son cas a montré qu'on peut conserver un apprentissage procédural alors que la formation de nouveaux souvenirs déclaratifs est gravement touchée, ce qui a bouleversé la manière de penser la mémoire.",
        source: "Milner, Corkin & Teuber, 1968",
        question: "Tu veux comprendre pourquoi il existe plusieurs systèmes de mémoire et pas une seule mémoire unique ?",
        relatedNodeId: "memoire_long_terme",
    },
    {
        fact: "Un grand maître d'échecs ne mémorise pas mieux 'tout' : il reconnaît mieux des motifs qui ont du sens. Les travaux inspirés par Chase et Simon montrent que l'expertise dépend de milliers de configurations stockées en mémoire à long terme, ce qui explique pourquoi l'avantage s'effondre quand les pièces sont placées au hasard.",
        source: "Chase & Simon, 1973",
        question: "Tu veux découvrir comment le chunking transforme une mémoire ordinaire en mémoire experte ?",
        relatedNodeId: "memoire_travail",
    },
    {
        fact: "Les difficultés qui ralentissent l'apprentissage peuvent en réalité le renforcer. Bjork a popularisé l'idée de 'difficultés désirables' : espacer, mélanger ou rendre le rappel un peu plus difficile nuit souvent à la performance immédiate, mais améliore la rétention à long terme.",
        source: "Bjork, 1994",
        question: "Tu veux comprendre pourquoi apprendre facilement n'est pas toujours apprendre durablement ?",
        relatedNodeId: "memoire",
    },
    {
        fact: "La mémoire de travail n'est pas juste un mini-stockage temporaire : c'est un système à capacité limitée qui sert à maintenir et manipuler activement l'information pendant une tâche. Dans le modèle de Baddeley, elle repose sur plusieurs composants spécialisés et non sur une simple boîte unique.",
        source: "Baddeley, 2000",
        question: "Tu veux voir pourquoi oublier une consigne en plein calcul n'est pas un bug, mais une limite normale du système ?",
        relatedNodeId: "memoire_travail",
    },
    {
        fact: "Les cellules les plus célèbres du cerveau ne sont pas seules à faire le travail. Les neurosciences modernes insistent sur le rôle des cellules gliales, longtemps sous-estimées, dans la régulation de l'environnement neuronal, la myélinisation, l'immunité cérébrale et même certains aspects de la communication synaptique.",
        source: "BrainFacts; Khan Academy overview",
        question: "Tu veux découvrir pourquoi le cerveau n'est pas seulement une histoire de neurones ?",
        relatedNodeId: "neurosciences",
    },
    {
        fact: "Le lobe occipital ne 'voit' pas comme un œil : il traite des signaux visuels transformés par tout un système. Les descriptions anatomiques classiques rappellent que la vision dépend d'un ensemble de régions, mais que l'occipital reste le grand centre cortical du traitement visuel.",
        source: "Mayo Clinic; Queensland Brain Institute",
        question: "Tu veux explorer comment le cerveau reconstruit ce que tu crois simplement 'voir' ?",
        relatedNodeId: "lobes_cerveau",
    },
    {
        fact: "Aucune grande méthode de neuroimagerie ne donne 'la vérité complète' sur le cerveau. L'EEG excelle pour suivre l'activité à l'échelle de la milliseconde, alors que l'IRMf aide davantage à localiser les régions impliquées, ce qui explique pourquoi les neurosciences combinent souvent plusieurs outils.",
        source: "EEG / IRMf overviews",
        question: "Tu veux comprendre pourquoi voir quand ça se passe et voir où ça se passe sont deux problèmes différents ?",
        relatedNodeId: "neuroimagerie",
    },
];