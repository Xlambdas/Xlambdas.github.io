// Everything that doesn't depend on the language.

export const SITE = 'https://xls-studio.com'
export const BASE = '/corentin-gassien/'

export const LINKS = {
    email: 'cogassien@hotmail.com',
    linkedin: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261',
    github: 'https://github.com/Xlambdas',
    xls: 'https://xls-studio.com/',
}

const img = (name: string) => `${BASE}img/${name}.webp`

// Report PDFs and their first-page images
export const DOCS = {
    ter: {
        href: `${BASE}docs/TER_Robots-sociaux-memoire-prospective.pdf`,
        pages: 45,
        cover: { src: `${BASE}img/docs/ter-cover.webp`, width: 640, height: 905 },
    },
    rireVirtuel: {
        href: `${BASE}docs/Synthese_Rire-virtuel_Corentin-Gassien.pdf`,
        pages: 6,
        cover: { src: `${BASE}img/docs/rire-virtuel-cover.webp`, width: 640, height: 905 },
    },
}

// width/height = real file size (prevents layout shift while loading)
export const IMAGES = {
    mathSlider: { src: img('math-slider'), width: 1600, height: 896 },
    liquidPipe: { src: img('liquid-pipe'), width: 1301, height: 732 },
    tubePuzzle: { src: img('tube-puzzle'), width: 1295, height: 733 },
    goDeeper: { src: img('go-deeper'), width: 1600, height: 873 },
    roadLight: { src: img('road-light'), width: 1600, height: 884 },
    emailClient: { src: img('email-client'), width: 1600, height: 893 },
    lightCats: { src: img('light-cats'), width: 1446, height: 1073 },
    bsgBrandBoard: { src: img('bsg-brand-board'), width: 696, height: 1202 },
    bsgColorResearch: { src: img('bsg-color-research'), width: 1334, height: 1174 },
}
