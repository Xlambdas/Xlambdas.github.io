// Academic work — EN (same slugs and order as work.fr.ts)
import type { Content } from './types'

export const workEn: Content['work'] = {
    meta: {
        title: 'Academic work — Corentin Gassien',
        description:
            "Reports and reviews by Corentin Gassien (Master TECH, University of Bordeaux): a literature review on phantom limbs, a science communication piece on virtual agents, and research on social robots and Alzheimer's disease.",
    },
    title: 'Academic work',
    intro: 'The reports and reviews I write during my studies: literature reviews, science communication and field research.',
    homeTitle: 'Academic work',
    seeAll: 'See all academic work',
    read: 'Read',
    backToList: 'All academic work',
    status: { done: 'Completed', ongoing: 'In progress', rewriting: 'Being rewritten' },
    labels: {
        course: 'Context',
        date: 'Year',
        status: 'Status',
        authors: 'Authors',
        question: 'Research question',
        basedOn: 'Based on',
        acknowledgements: 'Acknowledgements',
    },

    reports: [
        {
            slug: 'membre-fantome',
            type: 'Literature review',
            course: 'Scientific project, Master TECH',
            date: '2026',
            status: 'ongoing',
            title: 'Non-invasive sensory stimulation and phantom limbs',
            subtitle: 'Can a believable sensation be restored without an implant?',
            authors: ['Corentin Gassien'],
            summary:
                'How far can stimulation through the skin, without any implant, give a believable sensation back to a person with an amputation? Literature review in progress.',
            question:
                'To what extent can non-invasive sensory stimulation restore a perceptually believable sensation in amputees with a phantom limb, compared with people without a disability?',
            sections: [
                {
                    title: 'Context',
                    paragraphs: [
                        "More and more people live with an arm or leg prosthesis. But these prostheses give almost no sensation back: you can move them, without feeling what you touch or where your artificial hand or foot is. This lack of sensory feedback is one of the reasons many people end up abandoning their prosthesis.",
                        'Researchers are therefore trying to restore sensation by stimulating the nerves that remain. This review focuses on non-invasive techniques, with no surgery (electrodes on the skin, magnetic stimulation…), with future sensory-feedback prostheses and virtual reality in mind.',
                    ],
                },
                {
                    title: 'PICO framework',
                    items: [
                        'Population: amputees who feel a phantom limb.',
                        'Intervention: non-invasive sensory nerve stimulation (e.g. transcutaneous electrical stimulation of a peripheral nerve).',
                        'Comparison: people without a disability, receiving the same stimulation.',
                        'Outcome: perceptual believability of the sensation (realism, localisation accuracy…).',
                    ],
                },
                {
                    title: 'Method',
                    paragraphs: [
                        'Searches on Google Scholar and PubMed, with a query built from the PICO framework. Included: peer-reviewed articles published since 2025, in English or French. Excluded: invasive techniques (implanted electrodes, surgery), brain-computer interfaces that decode rather than stimulate, and off-topic studies.',
                    ],
                },
                {
                    title: 'Article selection (PRISMA method)',
                    items: [
                        '46 articles identified (27 on Google Scholar, 19 on PubMed)',
                        '40 after removing duplicates',
                        '9 excluded after reading the title and abstract',
                        '31 read in full',
                        '10 to 15 kept: final selection in progress',
                    ],
                },
                {
                    title: 'Where I am',
                    paragraphs: ['The final selection and the analysis of results are in progress. This page will be completed when the review is finished.'],
                },
            ],
        },
        {
            slug: 'rire-virtuel',
            type: 'Science communication',
            course: 'Master TECH',
            date: '2026',
            status: 'done',
            title: "What if your laugh wasn't really yours?",
            subtitle: 'How virtual agents can change the way we judge a joke',
            authors: ['Corentin Gassien'],
            summary:
                'Is it enough for virtual characters to laugh around you to change how you rate a joke? A virtual reality study explained for everyone.',
            basedOn:
                '"Laughing Together: A Pilot Study on the Role of Virtual Agents in Emotional Contagion, Conformity, and Opinion Shaping in a Virtual Stand-Up Comedy Club", Similde Mair, Fariba Mostajeran, Joan Llobera, Mel Slater, Frank Steinicke. IEEE ISMAR 2025.',
            sections: [
                {
                    title: 'The exercise',
                    paragraphs: [
                        "Making a scientific paper understandable to anyone: explaining the key ideas (emotional contagion, group conformity, virtual agent) with everyday examples, while keeping the authors' caution about a pilot study.",
                    ],
                },
                {
                    title: 'The study in short',
                    paragraphs: [
                        '20 participants, seated in a virtual reality stand-up comedy club. Around them, between zero and five virtual characters who do not laugh, laugh moderately or laugh loudly. After each of the 16 jokes, the participant rates it from 1 (not funny at all) to 5 (crying with laughter).',
                    ],
                },
                {
                    title: 'What they found',
                    items: [
                        'The louder the characters laughed, the higher the jokes were rated.',
                        'A large part of this effect (about 52%) goes through lip activity, in other words smiling.',
                        'Group size had no significant effect.',
                        'People who tend to follow the group were the most influenced.',
                    ],
                },
                {
                    title: 'Limitations',
                    items: [
                        'Only 20 participants, mostly computer science or psychology students.',
                        'Many already knew about emotional contagion and may have guessed the aim of the study.',
                        'The audio recordings had to be dropped.',
                        'One character seemed more "contagious" than the others, which was not analysed.',
                    ],
                },
                {
                    title: 'Why it matters',
                    paragraphs: [
                        "If a virtual character can change how we perceive a joke, it can probably also influence a pupil's motivation, a patient's engagement or an athlete's training. Social reactions make virtual agents feel more natural, but they also create an influence that designers need to understand and control.",
                    ],
                },
            ],
        },
        {
            slug: 'robots-sociaux-alzheimer',
            type: 'Research project (TER)',
            course: "Bachelor's in MIASHS, University of Bordeaux",
            date: '2025',
            status: 'rewriting',
            title: "Social robots and Alzheimer's disease",
            subtitle: 'Can a robot help people remember what they have to do?',
            authors: ['Pierre-Samuel Bashaga-Kachungunu', 'Corentin Gassien', 'Younha Jean-Louis'],
            summary:
                'A state of the art on social robots and dementia, and a protocol comparing a social robot with a human professional helping care home residents remember an action to do.',
            question: "To what extent can a companion robot help a person with Alzheimer's disease in their daily life?",
            sections: [
                {
                    title: 'State of the art',
                    paragraphs: [
                        "Alzheimer's disease and its cognitive symptoms, prospective memory (remembering to do something later), cognitive stimulation approaches, and the different kinds of social robots: humanoid, companion and telepresence robots.",
                        "Case studies: NAO and prospective memory training, PARO and emotional support, Tammy and reminiscence therapy, and Kerem Tahan's work on social robots and cognitive stimulation.",
                    ],
                },
                {
                    title: 'The protocol',
                    paragraphs: [
                        'A study with 10 care home residents. Each resident receives two instructions such as "If you see it is 11 am, then you will go to the painting workshop": once from a social robot, once from a professional, in alternating order. The resident repeats the sentence out loud and then imagines doing the action: a technique called implementation intention.',
                    ],
                },
                {
                    title: 'What is measured',
                    items: [
                        'Whether the resident goes to the activity the next day, without any reminder.',
                        'Whether they remember it a few days later, first freely, then with a cue.',
                        'Their profile (MMSE score, level of dependence) and how acceptable they find the robot.',
                    ],
                },
                {
                    title: 'Where I am',
                    paragraphs: ["I'm reworking this project into a presentable version. The full version will be added here."],
                },
            ],
            acknowledgements:
                "Thanks to Bernard N'Kaoua, our supervisor, to Kerem Tahan for his support, and to the Colisée group care home for welcoming us.",
        },
    ],
}
