// Academic work — EN (same slugs and order as work.fr.ts)
import type { Content } from './types'
import { DOCS } from './shared'

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
        doc: 'The full report',
        download: 'Download the PDF',
        pages: 'pages',
        coverAlt: 'First page of the report',
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
            doc: { ...DOCS.rireVirtuel, size: '3.3 MB' },
        },
        {
            slug: 'robots-sociaux-alzheimer',
            type: 'Research project (TER)',
            course: "Bachelor's in MIASHS, University of Bordeaux",
            date: '2025',
            status: 'done',
            title: 'Social robots and prospective memory in care homes',
            subtitle: 'Can a robot pass on a memory strategy as well as a human?',
            authors: ['Pierre-Samuel Bashaga-Kachungunu', 'Corentin Gassien', 'Younha Jean-Louis'],
            summary:
                'A state of the art on prospective memory and social robots in geriatrics, and a protocol comparing a robot and a professional helping care home residents remember an action to do.',
            question:
                'When it is delivered by a social robot rather than a professional, does an implementation intention help care home residents carry out an action planned for the next day, and remember it a few days later, just as well?',
            sections: [
                {
                    title: 'In short',
                    paragraphs: [
                        "Prospective memory means remembering to do something later: taking medication, going to an activity. Much of a person's independence depends on it, and it declines early in Alzheimer's disease.",
                        'A simple strategy helps: implementation intentions, a plan of the form "If [situation], then [action]". At the same time, social robots (PARO, NAO, Pepper…) are increasingly studied in geriatrics. They are well accepted, but their cognitive benefits remain uncertain. Our work sits where these two fields meet.',
                    ],
                },
                {
                    title: 'State of the art',
                    items: [
                        "Alzheimer's disease and the role of non-drug interventions.",
                        'Prospective memory: definition, types of tasks, theoretical models, effects of ageing.',
                        'Ways to support it: external aids, training, and above all implementation intentions.',
                        'Social robots in geriatrics: companion robots (PARO), humanoids (NAO, Pepper), and what systematic reviews say.',
                        'The studies closest to ours, then acceptability, individual factors and ethical issues.',
                    ],
                },
                {
                    title: 'The protocol',
                    paragraphs: [
                        'A study designed for 10 care home residents, each taking part in both conditions. They receive an instruction such as "If you see it is 11 am, then you will go to the painting workshop": once from the NAO robot, once from a professional following exactly the same script. Order and activity are counterbalanced.',
                        'The robot first planned was Pepper, but the licence needed to program it could not be obtained in time, so the protocol was adapted to NAO.',
                    ],
                },
                {
                    title: 'What is measured',
                    items: [
                        'Whether the resident does the action the next day, without any reminder.',
                        'Whether they remember it three days later, first freely, then with a cue.',
                        'Their profile (MMSE, education, level of dependence) and how acceptable they find the robot.',
                        'Planned analyses: McNemar and Wilcoxon tests for paired data.',
                    ],
                },
                {
                    title: 'What ten participants allow',
                    paragraphs: [
                        'With ten people, at least six residents would need to succeed in one condition and fail in the other, all in the same direction, to reach significance. Finding no difference would therefore not mean the robot and the human are equivalent. The study should be presented as a pilot feasibility study.',
                    ],
                },
                {
                    title: 'Limitations and next steps',
                    paragraphs: [
                        'For lack of time, the experiment could not be run: the report presents expected results, not real ones. The critical analysis of the protocol identified precise improvements:',
                    ],
                    items: [
                        'add a condition without implementation intentions, to know whether the strategy itself helps;',
                        'use an event rather than a time as the cue, which works better for older adults;',
                        "choose an action outside the care home's routine, so staff reminders do not skew the measure;",
                        'collect more measures, and present the whole as a pilot study.',
                    ],
                },
                {
                    title: 'What this project taught us',
                    paragraphs: [
                        'The reality of field research: the technical and administrative constraints of robots, the ethical requirements of working with vulnerable people, and the gap between a rigorous experimental design and the daily life of a care home.',
                    ],
                },
            ],
            acknowledgements:
                'Supervisor: Bernard N\'Kaoua. Scientific advisor: Kerem Tahan. Partner: the Colisée group, whom we thank for welcoming us.',
            doc: { ...DOCS.ter, size: '340 KB' },
        },
    ],
}
