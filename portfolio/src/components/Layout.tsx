import type { ReactNode } from 'react'
import type { Content } from '../content/types'
import { LINKS } from '../content/shared'
import { pathFor, type PageKind } from '../routes'

interface Props {
    t: Content
    page: PageKind
    slug?: string
    children: ReactNode
}

export function Layout({ t, page, slug, children }: Props) {
    const other = t.lang === 'fr' ? 'en' : 'fr'
    const home = pathFor('home', t.lang)
    // On the case study, nav links point back to the home page sections
    const anchor = (id: string) => (page === 'home' ? `#${id}` : `${home}#${id}`)

    return (
        <>
            <a className="skip" href="#main">{t.ui.skip}</a>

            <header className="site-header">
                <div className="wrap header-inner">
                    <a className="brand" href={home}>Corentin Gassien</a>
                    <nav aria-label={t.lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
                        <ul className="nav">
                            <li><a href={anchor('about')}>{t.ui.nav.about}</a></li>
                            <li><a href={anchor('projects')}>{t.ui.nav.projects}</a></li>
                            <li><a href={pathFor('work', t.lang)} aria-current={page === 'work' || page === 'report' ? 'page' : undefined}>{t.ui.nav.work}</a></li>
                            <li><a href={anchor('path')}>{t.ui.nav.path}</a></li>
                            <li><a href={anchor('skills')}>{t.ui.nav.skills}</a></li>
                            <li><a href={anchor('contact')}>{t.ui.nav.contact}</a></li>
                        </ul>
                    </nav>

                    {/* Language toggle: a link styled as a switch. The knob sits on the current language
                        and slides toward the other one on hover / press. */}
                    <a
                        className={`lang-toggle is-${t.lang}`}
                        href={pathFor(page, other, slug)}
                        hrefLang={other}
                        aria-label={t.ui.switchLabel}
                    >
                        <span className="knob" aria-hidden="true" />
                        <span className="opt" aria-hidden="true">FR</span>
                        <span className="opt" aria-hidden="true">EN</span>
                    </a>
                </div>
            </header>

            <main id="main">{children}</main>

            <footer className="site-footer">
                <div className="wrap footer-inner">
                    <p>© 2026 Corentin Gassien</p>
                    <p className="muted">{t.ui.footer}</p>
                    <p>
                        <a href={LINKS.linkedin}>LinkedIn</a> · <a href={LINKS.github}>GitHub</a> · <a href={LINKS.xls}>xls-studio</a>
                    </p>
                </div>
            </footer>
        </>
    )
}
