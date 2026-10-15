import type { Content } from './types'
import { BASE, IMAGES, LINKS } from './shared'
import { workEn } from './work.en'

export const en: Content = {
    lang: 'en',
    ui: {
        skip: 'Skip to content',
        nav: { about: 'About', projects: 'Projects', work: 'Academic work', path: 'Background', skills: 'Skills', contact: 'Contact' },
        switchLabel: 'Version française',
        footer: 'Nouvelle-Aquitaine, France',
        univ: 'University of Bordeaux',
        programme: 'Master TECH · Ergonomics & HCI',
        backHome: 'Back to portfolio',
    },

    home: {
        meta: {
            title: 'Corentin Gassien — Ergonomics & HCI, Master TECH Bordeaux',
            description:
                "Portfolio of Corentin Gassien, Master's student in Technology, Ergonomics, Cognition & Disability (Master TECH) at the University of Bordeaux. Looking for an M1 internship starting April 2027.",
        },
        eyebrow: 'Ergonomics & human-computer interaction',
        lead:
            "Master's student in Technology, Ergonomics, Cognition & Disability (Master TECH) at the University of Bordeaux. I come from software development, and what interests me most is the people who use what we build.",
        status: {
            label: 'Looking',
            title: 'M1 internship starting April 2027',
            text: 'In any field related to my Master: ergonomics, UX, accessibility, cognitive science, disability. Happy to relocate anywhere.',
        },
        ctaContact: 'Get in touch',
        ctaCv: 'Download my CV (PDF, French)',
        cvHref: `${BASE}cv/CV_Corentin_Gassien_FR.pdf`,

        about: {
            title: 'About',
            paragraphs: [
                "I'm curious about pretty much everything. I want to understand how things work, and above all how people actually experience them day to day.",
                "Growing up, I spent a lot of time in my own head. Since then I've learned to reach out, to talk things through and to stand behind my ideas. That's roughly how I see ergonomics: observe and listen first, then propose, and talk about it.",
                "Before the Master, I did a Bachelor's in MIASHS (maths, computer science and social sciences), then spent five months at a small game startup in Croatia: an internship outside my degree, which I set up myself by finishing my Bachelor's courses early. That's where I realised that what I enjoy most isn't just the code: it's what the person on the other side of the screen goes through.",
            ],
            facts: [
                '1,800 km of self-supported bikepacking, from Arcachon to Aix along the Pyrenees',
                'Trained in Mental Health First Aid (PSSM)',
                'English C1 · German B1 · Italian A2',
            ],
        },

        projects: {
            title: 'Projects',
            featured: {
                tag: 'Internship · 2026 · Croatia',
                title: 'Big Small Games: 5 months of game dev',
                text: "Puzzles that make maths tangible, game concepts tested with the team, a search engine for a detective game, and a proposal to redesign the studio's website.",
                cta: 'Read the case study',
                shot: { ...IMAGES.roadLight, alt: 'Road Light prototype: pedestrians crossing a road managed by traffic lights' },
            },
            others: [
                {
                    tag: 'Side project · ongoing',
                    title: 'Game Of Life, an Obsidian plugin',
                    text: 'Turning your life into an RPG inside the Obsidian note-taking app: quests, levels, rewards and progress tracking.',
                },
                {
                    tag: 'Personal site',
                    title: 'xls-studio',
                    text: 'My playground: small apps, tools and prototypes I build to learn.',
                    link: { label: 'Visit xls-studio.com', href: LINKS.xls },
                },
            ],
        },

        path: {
            title: 'Background',
            educationTitle: 'Education',
            education: [
                {
                    period: 'Since 2026',
                    title: 'Master TECH: Technology, Ergonomics, Cognition & Disability',
                    place: 'University of Bordeaux',
                },
                {
                    period: '2022 – 2025',
                    title: "Bachelor's in MIASHS",
                    place: 'Maths and computer science applied to the humanities and social sciences · University of Bordeaux',
                },
            ],
            workTitle: 'Experience',
            work: [
                {
                    period: 'Feb – Jun 2026',
                    title: 'Game developer (voluntary internship, outside my degree)',
                    place: 'Big Small Games · Osijek, Croatia',
                },
                {
                    period: 'Since 2023',
                    title: 'Night watch, reception & tech support',
                    place: 'CREMI computer science building · University of Bordeaux, Talence',
                },
                {
                    period: 'Since 2023',
                    title: 'Exam invigilator',
                    place: 'University of Bordeaux, Talence',
                },
                {
                    period: '2022 – 2025',
                    title: 'Treasurer & activity leader (volunteer)',
                    place: 'Free-Rider Club mountain bike club · Saint-Sulpice-et-Cameyrac',
                },
            ],
        },

        skills: {
            title: 'Skills',
            groups: [
                {
                    title: 'Ergonomics & UX',
                    items: ['Activity analysis', 'HCI / UX design', 'Low & high-fidelity prototyping', 'User testing', 'Accessibility'],
                },
                { title: 'Tools', items: ['Figma', 'Unity 6', 'Git / GitHub', 'LaTeX', 'Markdown', 'Obsidian'] },
                {
                    title: 'Programming',
                    items: ['C#', 'TypeScript / JavaScript', 'React', 'HTML / CSS', 'Python', 'R', 'Matlab', 'SQL / PHP', 'C++ / Arduino'],
                },
                { title: 'Languages', items: ['French (native)', 'English C1', 'German B1', 'Italian A2'] },
            ],
        },

        contact: {
            title: 'Contact',
            text: "An internship offer, a question, or just want to chat? Write to me, I reply quickly.",
            links: [
                { label: LINKS.email, href: `mailto:${LINKS.email}` },
                { label: 'LinkedIn', href: LINKS.linkedin },
                { label: 'GitHub', href: LINKS.github },
            ],
        },
    },

    work: workEn,

    caseStudy: {
        meta: {
            title: 'Big Small Games, 5 months of game dev in Croatia — Corentin Gassien',
            description:
                "Case study: Corentin Gassien's internship at Big Small Games (Croatia). Educational puzzle prototypes, team-tested game concepts, a boolean search engine and a website redesign.",
        },
        tag: 'Case study · Internship',
        title: 'Big Small Games: 5 months of game development in Croatia',
        facts: [
            { label: 'Role', value: 'Game developer (intern)' },
            { label: 'Period', value: 'February – June 2026' },
            { label: 'Setting', value: 'Voluntary, outside my degree' },
            { label: 'Location', value: 'Osijek, Croatia' },
            { label: 'Team', value: '8 people, international team' },
            { label: 'Tools', value: 'Unity 6, C#, Git, Figma' },
        ],
        intro: [
            "This internship wasn't part of my degree. I arranged with my teachers to finish my Bachelor's courses early, in December 2025, so I could spend five months in Croatia, from February to the end of June 2026.",
            'Big Small Games is a small independent studio making 2D PC games. A tiny team: the founder, an artist, and a group of interns (three developers, a concept artist, a marketing intern and a video maker). We all worked in English.',
            'I went there to find out whether coding full-time was really for me. The answer: yes, but what hooked me most was everything to do with the player\'s experience.',
        ],
        method: {
            title: 'How I worked',
            text: "Expectations changed often, which is normal in a startup still looking for its direction. Instead of rushing in, I always followed the same loop:",
            steps: [
                { title: 'Sketch', text: 'Quick sketches to check I had understood the request, before writing any code.' },
                { title: 'Prototype', text: 'A playable version as fast as possible, so the team could test it and react.' },
                { title: 'Polish', text: 'Only then: visual feedback, readability, finishing touches.' },
            ],
        },
        phases: [
            {
                period: 'Feb – Mar',
                title: 'Puzzles that make maths tangible',
                intro:
                    "The studio is preparing an educational STEM game to show middle and high school students that maths, physics or computer science can be fun. Each developer took one subject; mine was maths. The challenge: let players handle mathematical ideas without ever feeling like they're \"doing maths\".",
                blocks: [
                    {
                        title: 'Math Slider Puzzle',
                        text: ['Adjust sliders whose values add up through switch nodes until they hit a target. Each node has its own maximum: local constraints, one global total.'],
                        shot: { ...IMAGES.mathSlider, alt: 'Math Slider Puzzle: sliders connected to nodes showing values and a target' },
                    },
                    {
                        title: 'Liquid Pipe Puzzle',
                        text: ['Reorder pipe segments by drag and drop to connect the inlet to the outlet. Levels are procedurally generated.'],
                        shot: { ...IMAGES.liquidPipe, alt: 'Liquid Pipe Puzzle: pipe segments to reorder between an inlet and an outlet' },
                    },
                    {
                        title: 'Tube Puzzle',
                        text: ['Pour liquids between tubes to reach exact levels. It trains conservation of quantities without ever saying so.'],
                        shot: { ...IMAGES.tubePuzzle, alt: 'Tube Puzzle: four tubes with liquid levels and target thresholds' },
                    },
                ],
                note: 'These prototypes were meant to test mechanics and how readable they were, not to ship a finished game. On the technical side: levels described as ScriptableObjects (logic and content kept separate), scenes assembled at runtime, and player feedback (indicator lights, victory screen, levels colour-coded by difficulty).',
            },
            {
                period: 'Mar – Apr',
                title: 'Free rein',
                intro:
                    'Two two-week sessions with a single constraint: fun 2D games that need very little art. Each developer owned their own concept and shared work-in-progress versions for the whole team to test.',
                blocks: [
                    {
                        title: 'Go Deeper',
                        text: [
                            "A puzzle-platformer where the camera doesn't move: the depth does. A wall on one layer can be a passage on another, and a lever on layer 2 acts on layer 1. The background becomes the puzzle.",
                            'I took the concept from start to finish: paper sketches, rules, level design, then a playable prototype. Testing with the team showed the idea was well understood, and pointed out what needed work: visual feedback during layer changes.',
                        ],
                        shot: { ...IMAGES.goDeeper, alt: 'Go Deeper: a 2D level with several depth layers and a character' },
                    },
                    {
                        title: 'Road Light',
                        text: [
                            'A management game where you control a city\'s traffic lights to keep pedestrians safe. Except some cross on red, and some drivers run the lights.',
                            'The hardest part: believable pedestrians. At first they bunched up, blocked each other or froze at the lights. I simplified the movement model and adjusted the collisions: a bit less realistic, but playable.',
                        ],
                        shot: { ...IMAGES.roadLight, alt: 'Road Light: top-down view of roads, crossings, traffic lights and pedestrians' },
                    },
                ],
            },
            {
                period: 'Apr – Jun',
                title: "Looking for the studio's next game",
                intro: 'A collective exploration phase: several directions in parallel, mixing technical prototypes and game design thinking.',
                blocks: [
                    {
                        title: 'Detective game: an email inbox',
                        text: [
                            'A fake inbox with a real search engine: boolean queries (AND, OR, NOT, parentheses, "exact phrases"), results ranked by relevance, and search terms highlighted in the email.',
                            'Along the way, the founder decided to hide the subject, date and sender. Players have to investigate from the email content alone, and I adapted the tool to that new constraint.',
                        ],
                        shot: { ...IMAGES.emailClient, alt: 'Email Client: search bar with a boolean query, email list and highlighted terms' },
                    },
                    {
                        title: 'Light and cats',
                        text: ['Game design and interface research around light: each cat needs a certain light intensity to be happy. First level and UI sketches.'],
                        shot: { ...IMAGES.lightCats, alt: 'Sketch for the light and cats game: a top-down room with lamps and cats' },
                    },
                    {
                        title: 'Animation without art assets',
                        text: ['For a coffee-themed concept: shaders that animate liquid rising in a cup, without any dedicated artwork.'],
                    },
                ],
            },
        ],
        initiative: {
            title: "An initiative: redesigning the studio's website",
            text: [
                "On my own initiative, I proposed redesigning the studio's website. At first the founder didn't see the point: it wasn't a priority.",
                'So I put together my arguments (credibility with partners, recruiting, press) and presented them to the team. I got the green light, then designed a high-fidelity Figma prototype with a new visual identity on my own.',
            ],
        },
        hard: {
            title: 'What was hard',
            items: [
                {
                    title: 'Moving expectations',
                    text: "It wasn't always easy to know exactly what the founder expected. Quick sketches and prototypes let me check early instead of guessing.",
                },
                {
                    title: 'Learning fast',
                    text: 'I arrived with little game dev experience. I put in a lot of work outside office hours, before and during the internship, to become useful quickly.',
                },
                {
                    title: 'Seeing work set aside',
                    text: "In a studio that explores, many prototypes don't make the cut. It's frustrating, but that's how research works.",
                },
            ],
        },
        takeaway: {
            title: 'What I took away',
            text: [
                "This internship was an eye-opener. The moments I enjoyed most weren't the most technical ones: making a mechanic readable, adapting the inbox tool after feedback, designing the website prototype.",
                "That's what led me to the Master TECH: keep building things, but starting from people.",
            ],
            skillsTitle: 'Skills I developed',
            skills: ['Rapid prototyping', 'User testing', 'Level design', 'Unity 6 & C#', 'Shaders', 'High-fidelity Figma', 'Working in an international team', 'Arguing for an idea'],
        },
        cta: { text: "Interested? I'm looking for an M1 internship starting April 2027.", button: 'Get in touch' },
    },
}
