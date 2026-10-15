import type { Content } from '../content/types'
import { ReportCard } from '../components/ReportCard'

export function Work({ t }: { t: Content }) {
    return (
        <section className="case-hero wrap" aria-labelledby="work-title">
            <p className="eyebrow">Corentin Gassien</p>
            <h1 id="work-title">{t.work.title}</h1>
            <p className="lead">{t.work.intro}</p>
            <ul className="report-grid">
                {t.work.reports.map((r) => <ReportCard key={r.slug} t={t} report={r} />)}
            </ul>
        </section>
    )
}
