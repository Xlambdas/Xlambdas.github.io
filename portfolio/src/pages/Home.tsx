import type { Content, TimelineItem } from '../content/types'
import { LINKS } from '../content/shared'
import { pathFor } from '../routes'
import { Shot } from '../components/Shot'
import { ReportCard } from '../components/ReportCard'

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
    return (
        <div className="timeline">
            <h3>{title}</h3>
            <ol>
                {items.map((it) => (
                    <li key={it.title}>
                        <span className="period">{it.period}</span>
                        <span className="tl-title">{it.title}</span>
                        <span className="muted tl-place">{it.place}</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export function Home({ t }: { t: Content }) {
    const h = t.home
    const caseUrl = pathFor('case', t.lang)

    return (
        <>
            {/* Hero */}
            <section className="hero wrap" aria-labelledby="name">
                <p className="eyebrow">{h.eyebrow}</p>
                <h1 id="name">Corentin Gassien</h1>
                <p className="lead">{h.lead}</p>

                <div className="status" role="note">
                    <span className="status-label"><span className="dot" aria-hidden="true" />{h.status.label}</span>
                    <p className="status-title">{h.status.title}</p>
                    <p>{h.status.text}</p>
                </div>

                <div className="actions">
                    <a className="btn btn-primary" href={`mailto:${LINKS.email}`}>{h.ctaContact}</a>
                    <a className="btn" href={h.cvHref} download>{h.ctaCv}</a>
                </div>
            </section>

            {/* About */}
            <section id="about" className="section wrap" aria-labelledby="about-title">
                <h2 id="about-title">{h.about.title}</h2>
                <div className="about">
                    <div className="prose">
                        {h.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
                    </div>
                    <ul className="facts">
                        {h.about.facts.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="section wrap" aria-labelledby="projects-title">
                <h2 id="projects-title">{h.projects.title}</h2>

                <article className="featured card">
                    <a className="featured-media" href={caseUrl} tabIndex={-1} aria-hidden="true">
                        <Shot shot={h.projects.featured.shot} />
                    </a>
                    <div className="featured-body">
                        <p className="tag">{h.projects.featured.tag}</p>
                        <h3><a href={caseUrl}>{h.projects.featured.title}</a></h3>
                        <p>{h.projects.featured.text}</p>
                        <a className="btn btn-primary" href={caseUrl}>{h.projects.featured.cta} <span aria-hidden="true">→</span></a>
                    </div>
                </article>

                <ul className="mini-grid">
                    {h.projects.others.map((p) => (
                        <li key={p.title} className="card mini">
                            <p className="tag">{p.tag}</p>
                            <h3>{p.title}</h3>
                            <p>{p.text}</p>
                            {p.link && <a href={p.link.href}>{p.link.label} <span aria-hidden="true">{p.link.href.startsWith('http') ? '↗' : '→'}</span></a>}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Academic work (latest 3, full list on its own page) */}
            <section id="work" className="section wrap" aria-labelledby="work-title">
                <h2 id="work-title">{t.work.homeTitle}</h2>
                <ul className="report-grid">
                    {t.work.reports.slice(0, 3).map((r) => <ReportCard key={r.slug} t={t} report={r} />)}
                </ul>
                <p className="see-all"><a className="btn" href={pathFor('work', t.lang)}>{t.work.seeAll} <span aria-hidden="true">→</span></a></p>
            </section>

            {/* Background */}
            <section id="path" className="section wrap" aria-labelledby="path-title">
                <h2 id="path-title">{h.path.title}</h2>
                <div className="two-col">
                    <Timeline title={h.path.educationTitle} items={h.path.education} />
                    <Timeline title={h.path.workTitle} items={h.path.work} />
                </div>
            </section>

            {/* Skills */}
            <section id="skills" className="section wrap" aria-labelledby="skills-title">
                <h2 id="skills-title">{h.skills.title}</h2>
                <div className="skills-grid">
                    {h.skills.groups.map((g) => (
                        <div key={g.title} className="card">
                            <h3>{g.title}</h3>
                            <ul className="chips">
                                {g.items.map((s) => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="section wrap" aria-labelledby="contact-title">
                <div className="contact card">
                    <h2 id="contact-title">{h.contact.title}</h2>
                    <p>{h.contact.text}</p>
                    <ul className="contact-links">
                        {h.contact.links.map((l) => (
                            <li key={l.href}><a href={l.href}>{l.label}</a></li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    )
}
