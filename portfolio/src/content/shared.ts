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

// width/height = real file size (prevents layout shift while loading)
export const IMAGES = {
    mathSlider: { src: img('math-slider'), width: 1600, height: 896 },
    liquidPipe: { src: img('liquid-pipe'), width: 1301, height: 732 },
    tubePuzzle: { src: img('tube-puzzle'), width: 1295, height: 733 },
    goDeeper: { src: img('go-deeper'), width: 1600, height: 873 },
    roadLight: { src: img('road-light'), width: 1600, height: 884 },
    emailClient: { src: img('email-client'), width: 1600, height: 893 },
    lightCats: { src: img('light-cats'), width: 1446, height: 1073 },
}
