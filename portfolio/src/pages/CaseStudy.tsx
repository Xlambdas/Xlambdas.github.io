import type { Content } from '../content/types'
import { LINKS } from '../content/shared'
import { pathFor } from '../routes'
import { Shot } from '../components/Shot'

export function CaseStudy({ t }: { t: Content }) {
    const c = t.caseStudy

    return (
        <article className="case">
            <header className="case-hero wrap">
                <a className="back" href={pathFor('home', t.lang)}><span aria-hidden="true">←</span> {t.ui.backHome}</a>
                <p className="eyebrow">{c.tag}</p>
                <h1>{c.title}</h1>
                <dl className="facts-grid">
                    {c.facts.map((f) => (
                        <div key={f.label}>
                            <dt>{f.label}</dt>
                            <dd>{f.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="prose intro">
                    {c.intro.map((p) => <p key={p}>{p}</p>)}
                </div>
            </header>

            <section className="section wrap" aria-labelledby="method">
                <div className="method card">
                    <h2 id="method">{c.method.title}</h2>
                    <p>{c.method.text}</p>
                    <ol className="steps">
                        {c.method.steps.map((s) => (
                            <li key={s.title}>
                                <span className="step-title">{s.title}</span>
                                <span>{s.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {c.phases.map((phase, i) => (
                <section key={phase.title} className="section wrap phase" aria-labelledby={`phase-${i}`}>
                    <p className="phase-label">
                        <span className="phase-num">{i + 1}</span>
                        {phase.period}
                    </p>
                    <h2 id={`phase-${i}`}>{phase.title}</h2>
                    <p className="lead-sm">{phase.intro}</p>

                    <div className={`blocks ${phase.blocks.length === 3 ? 'blocks-3' : ''}`}>
                        {phase.blocks.map((b) => (
                            <div key={b.title} className={`block ${b.shot ? '' : 'block-text'}`}>
                                {b.shot && <Shot shot={b.shot} />}
                                <h3>{b.title}</h3>
                                {b.text.map((p) => <p key={p}>{p}</p>)}
                            </div>
                        ))}
                    </div>

                    {phase.note && <p className="note">{phase.note}</p>}
                </section>
            ))}

            <section className="section wrap" aria-labelledby="initiative">
                <div className="initiative card">
                    <h2 id="initiative">{c.initiative.title}</h2>
                    {c.initiative.text.map((p) => <p key={p}>{p}</p>)}
                    {c.initiative.items && (
                        <>
                            <h3 className="init-list-title">{c.initiative.listTitle}</h3>
                            <ul className="init-list">
                                {c.initiative.items.map((it) => <li key={it}>{it}</li>)}
                            </ul>
                        </>
                    )}
                    {c.initiative.shots && (
                        <div className="init-shots">
                            {c.initiative.shots.map((s) => <Shot key={s.src} shot={s} />)}
                        </div>
                    )}
                </div>
            </section>

            <section className="section wrap" aria-labelledby="hard">
                <h2 id="hard">{c.hard.title}</h2>
                <div className="hard-grid">
                    {c.hard.items.map((it) => (
                        <div key={it.title} className="card">
                            <h3>{it.title}</h3>
                            <p>{it.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section wrap" aria-labelledby="takeaway">
                <h2 id="takeaway">{c.takeaway.title}</h2>
                <div className="prose">
                    {c.takeaway.text.map((p) => <p key={p}>{p}</p>)}
                </div>
                <h3 className="chips-title">{c.takeaway.skillsTitle}</h3>
                <ul className="chips">
                    {c.takeaway.skills.map((s) => <li key={s}>{s}</li>)}
                </ul>
            </section>

            <section className="section wrap">
                <div className="contact card">
                    <p className="cta-text">{c.cta.text}</p>
                    <a className="btn btn-primary" href={`mailto:${LINKS.email}`}>{c.cta.button}</a>
                </div>
            </section>
        </article>
    )
}
