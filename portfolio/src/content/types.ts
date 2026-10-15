export type Lang = 'fr' | 'en'

export interface Link {
    label: string
    href: string
}

export interface Meta {
    title: string
    description: string
}

export interface TimelineItem {
    period: string
    title: string
    place: string
}

export interface Shot {
    src: string
    width: number
    height: number
    alt: string
    caption?: string
}

export interface MiniProject {
    tag: string
    title: string
    text: string
    link?: Link
}

export interface CaseBlock {
    title: string
    text: string[]
    shot?: Shot
}

export interface CasePhase {
    period: string
    title: string
    intro: string
    blocks: CaseBlock[]
    note?: string
}

export type ReportStatus = 'done' | 'ongoing' | 'rewriting'

export interface ReportSection {
    title: string
    paragraphs?: string[]
    items?: string[]
}

export interface Report {
    slug: string // same in FR and EN, used in the URL
    type: string
    course: string
    date: string
    status: ReportStatus
    title: string
    subtitle?: string
    authors: string[]
    summary: string // shown on cards
    question?: string
    basedOn?: string
    sections: ReportSection[]
    acknowledgements?: string
    pdf?: Link
}

export interface Content {
    lang: Lang
    ui: {
        skip: string
        nav: { about: string; projects: string; work: string; path: string; skills: string; contact: string }
        switchLabel: string
        footer: string
        univ: string
        programme: string
        backHome: string
    }
    home: {
        meta: Meta
        eyebrow: string
        lead: string
        status: { label: string; title: string; text: string }
        ctaContact: string
        ctaCv: string
        cvHref: string
        about: { title: string; paragraphs: string[]; facts: string[] }
        projects: {
            title: string
            featured: { tag: string; title: string; text: string; cta: string; shot: Shot }
            others: MiniProject[]
        }
        path: {
            title: string
            educationTitle: string
            education: TimelineItem[]
            workTitle: string
            work: TimelineItem[]
        }
        skills: { title: string; groups: { title: string; items: string[] }[] }
        contact: { title: string; text: string; links: Link[] }
    }
    work: {
        meta: Meta
        title: string
        intro: string
        homeTitle: string
        seeAll: string
        read: string
        backToList: string
        status: Record<ReportStatus, string>
        labels: { course: string; date: string; status: string; authors: string; question: string; basedOn: string; acknowledgements: string }
        reports: Report[]
    }
    caseStudy: {
        meta: Meta
        tag: string
        title: string
        facts: { label: string; value: string }[]
        intro: string[]
        method: { title: string; text: string; steps: { title: string; text: string }[] }
        phases: CasePhase[]
        initiative: { title: string; text: string[] }
        hard: { title: string; items: { title: string; text: string }[] }
        takeaway: { title: string; text: string[]; skillsTitle: string; skills: string[] }
        cta: { text: string; button: string }
    }
}
