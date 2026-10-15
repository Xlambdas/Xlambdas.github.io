import type { Lang } from './content/types'
import { BASE } from './content/shared'
import { fr } from './content/fr'

export type PageKind = 'home' | 'case' | 'work' | 'report'

export interface Route {
    path: string // public URL, always ends with "/"
    lang: Lang
    page: PageKind
    slug?: string // for report pages
}

// Base path of each page type, per language
const PATHS: Record<Exclude<PageKind, 'report'>, Record<Lang, string>> = {
    home: { fr: BASE, en: `${BASE}en/` },
    case: { fr: `${BASE}projets/big-small-games/`, en: `${BASE}en/projects/big-small-games/` },
    work: { fr: `${BASE}travaux/`, en: `${BASE}en/academic-work/` },
}

export const pathFor = (page: PageKind, lang: Lang, slug?: string): string =>
    page === 'report' ? `${PATHS.work[lang]}${slug}/` : PATHS[page][lang]

// Report slugs are the same in both languages (taken from the FR content)
const slugs = fr.work.reports.map((r) => r.slug)

export const ROUTES: Route[] = (['fr', 'en'] as Lang[]).flatMap((lang) => [
    { path: pathFor('home', lang), lang, page: 'home' as const },
    { path: pathFor('case', lang), lang, page: 'case' as const },
    { path: pathFor('work', lang), lang, page: 'work' as const },
    ...slugs.map((slug) => ({ path: pathFor('report', lang, slug), lang, page: 'report' as const, slug })),
])
