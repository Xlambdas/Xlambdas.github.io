import type { Lang, Meta } from '../content/types'
import { IMAGES, LINKS, SITE } from '../content/shared'
import { pathFor, type PageKind } from '../routes'

interface Props {
    meta: Meta
    lang: Lang
    page: PageKind
    slug?: string
}

// Rendered into <head> at build time. This is what Google reads first.
export function Head({ meta, lang, page, slug }: Props) {
    const url = SITE + pathFor(page, lang, slug)
    const fr = SITE + pathFor(page, 'fr', slug)
    const en = SITE + pathFor(page, 'en', slug)

    const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Corentin Gassien',
        url: SITE + pathFor('home', 'fr'),
        jobTitle: lang === 'fr' ? 'Étudiant en Master TECH (ergonomie, IHM)' : "Master's student in ergonomics & HCI",
        email: `mailto:${LINKS.email}`,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Université de Bordeaux' },
        knowsLanguage: ['fr', 'en', 'de', 'it'],
        address: { '@type': 'PostalAddress', addressRegion: 'Nouvelle-Aquitaine', addressCountry: 'FR' },
        sameAs: [LINKS.linkedin, LINKS.github],
    }

    return (
        <>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="author" content="Corentin Gassien" />
            <link rel="canonical" href={url} />
            <link rel="alternate" hrefLang="fr" href={fr} />
            <link rel="alternate" hrefLang="en" href={en} />
            <link rel="alternate" hrefLang="x-default" href={fr} />

            <meta property="og:type" content={page === 'home' ? 'profile' : 'article'} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={SITE + IMAGES.roadLight.src} />
            <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_GB'} />

            {page === 'home' && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
            )}
        </>
    )
}
