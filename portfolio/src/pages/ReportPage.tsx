import type { Content, Report } from '../content/types'
import { pathFor } from '../routes'

export function ReportPage({ t, report }: { t: Content; report: Report }) {
    const l = t.work.labels
    return (
        <article className="case report">
            <header className="case-hero wrap">
                <a className="back" href={pathFor('work', t.lang)}><span aria-hidden="true">←</span> {t.work.backToList}</a>
                <p className="eyebrow">{report.type}</p>
                <h1>{report.title}</h1>
                {report.subtitle && <p className="lead">{report.subtitle}</p>}

                <dl className="facts-grid">
                    <div>
                        <dt>{l.authors}</dt>
                        <dd>{report.authors.join(', ')}</dd>
                    </div>
                    <div>
                        <dt>{l.course}</dt>
                        <dd>{report.course}</dd>
                    </div>
                    <div>
                        <dt>{l.date}</dt>
                        <dd>{report.date}</dd>
                    </div>
                    <div>
                        <dt>{l.status}</dt>
                        <dd><span className={`status status-${report.status}`}>{t.work.status[report.status]}</span></dd>
                    </div>
                </dl>

                {report.question && (
                    <div className="question">
                        <p className="tag">{l.question}</p>
                        <p className="question-text">{report.question}</p>
                    </div>
                )}
                {report.basedOn && (
                    <p className="note"><strong>{l.basedOn} :</strong> {report.basedOn}</p>
                )}
            </header>

            <div className="wrap report-body">
                {report.sections.map((s) => (
                    <section key={s.title} className="report-section">
                        <h2>{s.title}</h2>
                        {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                        {s.items && (
                            <ul className="report-list">
                                {s.items.map((it) => <li key={it}>{it}</li>)}
                            </ul>
                        )}
                    </section>
                ))}

                {report.acknowledgements && (
                    <section className="report-section">
                        <h2>{l.acknowledgements}</h2>
                        <p>{report.acknowledgements}</p>
                    </section>
                )}

                {report.pdf && (
                    <p><a className="btn" href={report.pdf.href} download>{report.pdf.label}</a></p>
                )}
            </div>
        </article>
    )
}
