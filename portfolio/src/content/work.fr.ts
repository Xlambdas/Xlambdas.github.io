// Travaux universitaires — FR
// To add a report: copy one object in `reports`, give it a new slug, and do the same in work.en.ts.
import type { Content } from './types'

export const workFr: Content['work'] = {
    meta: {
        title: 'Travaux universitaires — Corentin Gassien',
        description:
            "Rapports et synthèses de Corentin Gassien (Master TECH, Université de Bordeaux) : revue de littérature sur le membre fantôme, vulgarisation sur les agents virtuels, TER sur les robots sociaux et la maladie d'Alzheimer.",
    },
    title: 'Travaux universitaires',
    intro: "Les rapports et synthèses que je rédige pendant mes études : revues de littérature, vulgarisation scientifique et recherche de terrain.",
    homeTitle: 'Travaux universitaires',
    seeAll: 'Voir tous les travaux',
    read: 'Lire',
    backToList: 'Tous les travaux',
    status: { done: 'Terminé', ongoing: 'En cours', rewriting: 'En réécriture' },
    labels: {
        course: 'Cadre',
        date: 'Année',
        status: 'Statut',
        authors: 'Auteurs',
        question: 'Question de recherche',
        basedOn: "D'après",
        acknowledgements: 'Remerciements',
    },

    reports: [
        {
            slug: 'membre-fantome',
            type: 'Synthèse de littérature',
            course: 'Projet scientifique, Master TECH',
            date: '2026',
            status: 'ongoing',
            title: 'Stimulation sensorielle non-invasive et membre fantôme',
            subtitle: 'Peut-on restituer une sensation crédible sans implant ?',
            authors: ['Corentin Gassien'],
            summary:
                "Jusqu'où une stimulation sans implant, à travers la peau, peut-elle redonner une sensation crédible à une personne amputée ? Revue de littérature en cours.",
            question:
                "Dans quelle mesure la stimulation sensorielle non-invasive peut-elle restituer une sensation perceptivement crédible chez des personnes amputées avec membre fantôme, en comparaison de sujets sans handicap ?",
            sections: [
                {
                    title: 'Le contexte',
                    paragraphs: [
                        "De plus en plus de personnes vivent avec une prothèse de bras ou de jambe. Mais ces prothèses ne renvoient presque aucune sensation : on peut les bouger, sans sentir ce qu'on touche ni où se trouve sa main ou son pied artificiel. Ce manque de retour sensoriel est l'une des raisons pour lesquelles beaucoup de personnes finissent par abandonner leur prothèse.",
                        "Des chercheurs essaient donc de redonner une sensation en stimulant les nerfs encore présents. Cette synthèse se concentre sur les techniques non-invasives, sans chirurgie (électrodes posées sur la peau, stimulation magnétique…), avec en perspective des prothèses à retour sensoriel ou des applications en réalité virtuelle.",
                    ],
                },
                {
                    title: 'Cadre PICO',
                    items: [
                        'Population : personnes amputées qui ressentent un membre fantôme.',
                        "Intervention : stimulation sensorielle non-invasive des nerfs (par exemple stimulation électrique transcutanée d'un nerf périphérique).",
                        'Comparaison : sujets sans handicap, soumis à la même stimulation.',
                        'Résultat : crédibilité perceptive de la sensation (réalisme, précision de localisation…).',
                    ],
                },
                {
                    title: 'Méthode',
                    paragraphs: [
                        "Recherche sur Google Scholar et PubMed, avec une équation construite à partir du cadre PICO. Sont retenus les articles publiés depuis 2025 dans des revues à comité de lecture, en français ou en anglais. Sont exclues les techniques invasives (électrodes implantées, chirurgie), les interfaces cerveau-machine qui décodent plutôt qu'elles ne stimulent, et les études hors sujet.",
                    ],
                },
                {
                    title: 'Sélection des articles (méthode PRISMA)',
                    items: [
                        '46 articles identifiés (27 sur Google Scholar, 19 sur PubMed)',
                        '40 après suppression des doublons',
                        '9 exclus après lecture du titre et du résumé',
                        '31 lus en texte intégral',
                        '10 à 15 retenus : sélection finale en cours',
                    ],
                },
                {
                    title: "Où j'en suis",
                    paragraphs: ["La sélection finale et l'analyse des résultats sont en cours. Cette page sera complétée quand la synthèse sera terminée."],
                },
            ],
        },
        {
            slug: 'rire-virtuel',
            type: 'Vulgarisation scientifique',
            course: 'Master TECH',
            date: '2026',
            status: 'done',
            title: "Et si votre rire n'était pas vraiment le vôtre ?",
            subtitle: "Comment des agents virtuels peuvent influencer notre perception d'une blague",
            authors: ['Corentin Gassien'],
            summary:
                "Des personnages virtuels qui rient autour de vous suffisent-ils à changer la note que vous donnez à une blague ? Une étude en réalité virtuelle expliquée pour tout le monde.",
            basedOn:
                "« Laughing Together: A Pilot Study on the Role of Virtual Agents in Emotional Contagion, Conformity, and Opinion Shaping in a Virtual Stand-Up Comedy Club », Similde Mair, Fariba Mostajeran, Joan Llobera, Mel Slater, Frank Steinicke. IEEE ISMAR 2025.",
            sections: [
                {
                    title: "L'exercice",
                    paragraphs: [
                        "Rendre un article scientifique compréhensible par n'importe qui : expliquer les notions clés (contagion émotionnelle, conformité au groupe, agent virtuel) avec des exemples du quotidien, tout en gardant la prudence des auteurs sur une étude pilote.",
                    ],
                },
                {
                    title: "L'étude en bref",
                    paragraphs: [
                        "20 participants, assis dans un club de stand-up en réalité virtuelle. Autour d'eux, entre zéro et cinq personnages virtuels qui ne rient pas, rient modérément ou rient fort. Après chacune des 16 blagues, le participant la note de 1 (pas drôle du tout) à 5 (rire aux larmes).",
                    ],
                },
                {
                    title: "Ce qu'ils ont trouvé",
                    items: [
                        'Plus les personnages riaient fort, plus les blagues étaient bien notées.',
                        "Une bonne partie de cet effet (environ 52 %) passe par l'activité des lèvres, autrement dit le sourire.",
                        "La taille du groupe n'a pas eu d'effet significatif.",
                        'Les personnes qui ont tendance à suivre le groupe étaient les plus influencées.',
                    ],
                },
                {
                    title: 'Les limites',
                    items: [
                        "Seulement 20 participants, surtout des étudiants en informatique ou en psychologie.",
                        "Beaucoup connaissaient déjà la contagion émotionnelle et ont pu deviner le but de l'expérience.",
                        'Les enregistrements audio ont dû être abandonnés.',
                        "Un des personnages semblait plus « contagieux » que les autres, sans que ce soit analysé.",
                    ],
                },
                {
                    title: 'Pourquoi ça compte',
                    paragraphs: [
                        "Si un personnage virtuel peut changer notre perception d'une blague, il peut sans doute aussi influencer la motivation d'un élève, l'engagement d'un patient ou l'entraînement d'un sportif. Les réactions sociales rendent les agents virtuels plus naturels, mais elles créent aussi une influence que le concepteur doit comprendre et contrôler.",
                    ],
                },
            ],
        },
        {
            slug: 'robots-sociaux-alzheimer',
            type: "Travail d'étude et de recherche (TER)",
            course: 'Licence MIASHS, Université de Bordeaux',
            date: '2025',
            status: 'rewriting',
            title: "Robots sociaux et maladie d'Alzheimer",
            subtitle: "Un robot peut-il aider à se souvenir de ce qu'on doit faire ?",
            authors: ['Pierre-Samuel Bashaga-Kachungunu', 'Corentin Gassien', 'Younha Jean-Louis'],
            summary:
                "Un état de l'art sur les robots sociaux face à la démence, et un protocole pour comparer un robot social et un professionnel humain qui aident des résidents d'EHPAD à se souvenir d'une action à faire.",
            question:
                "Dans quelle mesure un robot de compagnie peut-il apporter son aide dans le quotidien d'une personne atteinte de la maladie d'Alzheimer ?",
            sections: [
                {
                    title: "État de l'art",
                    paragraphs: [
                        "La maladie d'Alzheimer et ses troubles cognitifs, la mémoire prospective (se souvenir de faire quelque chose plus tard), les approches de stimulation cognitive, et les différents types de robots sociaux : humanoïdes, compagnons, de téléprésence.",
                        "Études de cas : NAO et l'entraînement de la mémoire prospective, PARO et le soutien émotionnel, Tammy et la thérapie de réminiscence, et les travaux de Kerem Tahan sur les robots sociaux et la stimulation cognitive.",
                    ],
                },
                {
                    title: 'Le protocole',
                    paragraphs: [
                        "Une étude auprès de 10 résidents d'EHPAD. Chaque résident reçoit deux consignes du type « Si vous voyez qu'il est 11 h, alors vous irez à l'atelier peinture » : une fois de la part d'un robot social, une fois de la part d'un professionnel, dans un ordre alterné. Le résident répète la phrase à voix haute puis s'imagine faire l'action : c'est la technique de l'implémentation d'intention.",
                    ],
                },
                {
                    title: 'Ce qui est mesuré',
                    items: [
                        "Si le résident se rend à l'activité le lendemain, sans aucun rappel.",
                        "S'il s'en souvient quelques jours plus tard, d'abord librement, puis avec un indice.",
                        "Son profil (score MMSE, niveau de dépendance) et l'acceptabilité du robot.",
                    ],
                },
                {
                    title: "Où j'en suis",
                    paragraphs: ["Je retravaille ce TER pour en faire une version présentable. La version complète sera ajoutée ici."],
                },
            ],
            acknowledgements:
                "Merci à Bernard N'Kaoua, notre professeur référent, à Kerem Tahan pour son soutien, et à l'EHPAD du groupe Colisée pour son accueil.",
        },
    ],
}
