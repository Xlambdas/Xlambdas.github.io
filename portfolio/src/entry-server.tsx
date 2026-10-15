// Build-time only: turns each route into static HTML. No React is shipped to the browser.
import { renderToStaticMarkup } from 'react-dom/server'
import { fr } from './content/fr'
import { en } from './content/en'
import { ROUTES, type Route } from './routes'
import { Head } from './components/Head'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { CaseStudy } from './pages/CaseStudy'
import { Work } from './pages/Work'
import { ReportPage } from './pages/ReportPage'

export { ROUTES }

export function render(route: Route) {
    const t = route.lang === 'fr' ? fr : en
    const report = route.slug ? t.work.reports.find((r) => r.slug === route.slug) : undefined
    if (route.page === 'report' && !report) throw new Error(`No ${route.lang} report for slug "${route.slug}"`)

    const meta =
        route.page === 'home' ? t.home.meta
        : route.page === 'case' ? t.caseStudy.meta
        : route.page === 'work' ? t.work.meta
        : { title: `${report!.title} — Corentin Gassien`, description: report!.summary }

    const body =
        route.page === 'home' ? <Home t={t} />
        : route.page === 'case' ? <CaseStudy t={t} />
        : route.page === 'work' ? <Work t={t} />
        : <ReportPage t={t} report={report!} />

    const head = renderToStaticMarkup(<Head meta={meta} lang={route.lang} page={route.page} slug={route.slug} />)
    const html = renderToStaticMarkup(
        <Layout t={t} page={route.page} slug={route.slug}>
            {body}
        </Layout>,
    )

    return { head, html, lang: route.lang }
}
