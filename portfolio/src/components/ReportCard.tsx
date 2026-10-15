import type { Content, Report } from '../content/types'
import { pathFor } from '../routes'

export function ReportCard({ t, report }: { t: Content; report: Report }) {
    const url = pathFor('report', t.lang, report.slug)
    return (
        <li className="card report-card">
            <p className="tag">
                {report.type} · {report.date}
                <span className={`status status-${report.status}`}>{t.work.status[report.status]}</span>
            </p>
            <h3><a href={url}>{report.title}</a></h3>
            <p>{report.summary}</p>
            <a className="read" href={url}>{t.work.read} <span aria-hidden="true">→</span></a>
        </li>
    )
}
