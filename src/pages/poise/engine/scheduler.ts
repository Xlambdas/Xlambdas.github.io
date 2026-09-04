import type { CalendarEvent } from '../types/calendarEvent'
import type { Session } from '../types/session'
import type { SessionLog } from '../types/sessionLog'
import type { UserPreferences, ActivityWindow, Intensity } from '../types/preferences'
import type { RunConfig } from '../types/runConfig'
import type { SessionFeedback } from '../types/sessionFeedback'
import type { BodyArea } from '../types/exercise'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PlannedEvent {
    date: string
    type: 'session' | 'activity'
    refId: string
    source: 'planner'
    status: 'planned'
    windowId: string
    plannedKm?: number
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(d: Date, n: number): Date {
    const r = new Date(d)
    r.setDate(d.getDate() + n)
    return r
}

function dayIndex(dateStr: string): number {
    const [y, m, d] = dateStr.split('-').map(Number)
    const day = new Date(y, m - 1, d).getDay()
    return day === 0 ? 6 : day - 1
}

function hoursBetween(a: string, b: string): number {
    const [ay, am, ad] = a.split('-').map(Number)
    const [by, bm, bd] = b.split('-').map(Number)
    return (
        (new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime()) /
        (1000 * 60 * 60)
    )
}

// ── Intensity helpers ─────────────────────────────────────────────────────────

function exertionToIntensity(e: number): Intensity {
    if (e <= 2) return 'light'
    if (e <= 3) return 'medium'
    return 'hard'
}

function areasOverlap(a: BodyArea[], b: BodyArea[]): boolean {
    if (!a.length || !b.length) return false
    if (a.includes('full-body') || b.includes('full-body')) return true
    const upper: BodyArea[] = ['upper-body', 'chest', 'back', 'shoulders', 'arms', 'wrists']
    const lower: BodyArea[] = ['lower-body', 'legs', 'hips', 'ankles']
    if (a.some(x => upper.includes(x)) && b.some(x => upper.includes(x))) return true
    if (a.some(x => lower.includes(x)) && b.some(x => lower.includes(x))) return true
    return a.some(x => b.includes(x))
}

// ── Recovery check ────────────────────────────────────────────────────────────
// Checks BOTH completed historical events AND already-planned events in this run

interface RecentLoad {
    date: string
    windowId: string
    intensity: Intensity
    areas: BodyArea[]
    recoveryHours: { light: number; medium: number; hard: number }
}

function isBlockedByRecovery(
    date: string,
    targetWindow: ActivityWindow,
    recentLoads: RecentLoad[]
): { blocked: boolean; blockedAreas: BodyArea[] } {
    const load = targetWindow.muscleLoad
    if (!load || load.areas.length === 0) return { blocked: false, blockedAreas: [] }

    const blockedAreas: BodyArea[] = []

    for (const recent of recentLoads) {
        if (recent.date >= date) continue
        if (!areasOverlap(load.areas, recent.areas)) continue
        const elapsed = hoursBetween(recent.date, date)
        const needed = recent.recoveryHours[recent.intensity]
        if (elapsed < needed) {
            blockedAreas.push(...recent.areas)
        }
    }

    if (blockedAreas.length === 0) return { blocked: false, blockedAreas: [] }

    // Mobility/recovery windows are never blocked
    if (['mobility', 'recovery'].includes(targetWindow.category)) {
        return { blocked: false, blockedAreas }
    }

    return { blocked: true, blockedAreas }
}

// ── Build recent loads list ───────────────────────────────────────────────────

function buildRecentLoads(
    existingEvents: CalendarEvent[],
    plannedSoFar: PlannedEvent[],
    allWindows: ActivityWindow[],
    feedbacks: SessionFeedback[]
): RecentLoad[] {
    const loads: RecentLoad[] = []

    // From completed historical events
    for (const evt of existingEvents) {
        if (evt.status !== 'completed') continue
        if (evt.type !== 'session' && evt.type !== 'activity') continue
        const win = allWindows.find(w => w.id === (evt as any).windowId || w.id === evt.refId)
        if (!win?.muscleLoad) continue
        const fb = feedbacks.find(f => f.eventId === evt.id)
        const intensity: Intensity = fb
            ? exertionToIntensity(fb.perceivedExertion)
            : win.muscleLoad.defaultIntensity
        loads.push({
            date: evt.date,
            windowId: win.id,
            intensity,
            areas: win.muscleLoad.areas,
            recoveryHours: win.muscleLoad.recoveryHours,
        })
    }

    // From events already planned in this run (treat as default intensity)
    for (const p of plannedSoFar) {
        const win = allWindows.find(w => w.id === p.windowId)
        if (!win?.muscleLoad) continue
        loads.push({
            date: p.date,
            windowId: win.id,
            intensity: win.muscleLoad.defaultIntensity,
            areas: win.muscleLoad.areas,
            recoveryHours: win.muscleLoad.recoveryHours,
        })
    }

    return loads
}

// ── Session selection ─────────────────────────────────────────────────────────

function pickSession(
    window: ActivityWindow,
    availableMinutes: number,
    sessions: Session[],
    sessionLogs: SessionLog[],
    alreadyUsed: Set<string>
): Session | null {
    let candidates = sessions.filter(s => s.category === window.category)
    if (candidates.length === 0) return null

    candidates = candidates.filter(s => s.estimatedDuration <= availableMinutes)
    if (candidates.length === 0) return null

    if (window.targetAreas && window.targetAreas.length > 0) {
        const withMatch = candidates.filter(s =>
            window.targetAreas!.some(area => s.tags.includes(area))
        )
        if (withMatch.length > 0) candidates = withMatch
    }

    const preferred = window.preferredDuration ?? availableMinutes
    candidates.sort((a, b) =>
        Math.abs(a.estimatedDuration - preferred) - Math.abs(b.estimatedDuration - preferred)
    )

    const lastUsed = new Map<string, string>()
    for (const log of sessionLogs) {
        const ex = lastUsed.get(log.sessionId)
        if (!ex || log.startedAt > ex) lastUsed.set(log.sessionId, log.startedAt.slice(0, 10))
    }

    const topDur = candidates[0].estimatedDuration
    const top = candidates.filter(s => Math.abs(s.estimatedDuration - topDur) <= 5)
    top.sort((a, b) =>
        (lastUsed.get(a.id) ?? '1970').localeCompare(lastUsed.get(b.id) ?? '1970')
    )

    // Prefer not already used in this planning run, but allow reuse if no other option
    return top.find(s => !alreadyUsed.has(s.id)) ?? top[0] ?? null
}

function pickMobilitySession(
    availableMinutes: number,
    sessions: Session[],
    targetAreas: BodyArea[]
): Session | null {
    const mob = sessions.filter(
        s => ['mobility', 'recovery'].includes(s.category) && s.estimatedDuration <= availableMinutes
    )
    if (mob.length === 0) return null
    if (targetAreas.length > 0) {
        const match = mob.filter(s => targetAreas.some(a => s.tags.includes(a)))
        if (match.length > 0) return match[0]
    }
    return mob[0]
}

// ── Place one window on one date ──────────────────────────────────────────────

function placeWindow(
    date: string,
    window: ActivityWindow,
    maxMinutes: number,
    sessions: Session[],
    sessionLogs: SessionLog[],
    runConfigs: RunConfig[],
    alreadyUsedSessions: Set<string>,
    plannedEvents: PlannedEvent[],
    plannedDates: Set<string>
) {
    const session = pickSession(window, maxMinutes, sessions, sessionLogs, alreadyUsedSessions)
    if (session) {
        plannedEvents.push({
            date, type: 'session', refId: session.id,
            source: 'planner', status: 'planned', windowId: window.id,
        })
        alreadyUsedSessions.add(session.id)
    } else {
        const runCfg = runConfigs.find(r => r.name === window.name)
        plannedEvents.push({
            date, type: 'activity', refId: window.id,
            source: 'planner', status: 'planned', windowId: window.id,
            plannedKm: runCfg?.currentTargetKm,
        })
    }
    plannedDates.add(date)
}

// ── Main planner ──────────────────────────────────────────────────────────────

export function runPlanner(
    prefs: UserPreferences,
    existingEvents: CalendarEvent[],
    sessions: Session[],
    sessionLogs: SessionLog[],
    runConfigs: RunConfig[] = [],
    feedbacks: SessionFeedback[] = [],
    today: Date = new Date()
): PlannedEvent[] {
    const todayStr = toDateStr(today)
    const endDate = toDateStr(addDays(today, 14))

    const grid: string[] = []
    for (let i = 0; i <= 14; i++) grid.push(toDateStr(addDays(today, i)))

    // Lock days that already have manual or completed/skipped events
    const lockedDates = new Set<string>()
    for (const evt of existingEvents) {
        if (evt.date >= todayStr && (
            evt.source === 'manual' ||
            evt.status === 'completed' ||
            evt.status === 'skipped'
        )) {
            lockedDates.add(evt.date)
        }
    }

    const activeWindows = (prefs.activityWindows ?? [])
        .filter(w => w.active)
        // Most constrained (fewest allowed days) first
        .sort((a, b) => a.allowedDays.length - b.allowedDays.length)

    const plannedEvents: PlannedEvent[] = []
    const alreadyUsedSessions = new Set<string>()
    // Track per-date which window has already been placed
    const plannedDateWindows = new Map<string, Set<string>>()
    const plannedDates = new Set<string>()
    const mobilityNeeded = new Map<string, BodyArea[]>()

    function getPlannedWindowsForDate(date: string): Set<string> {
        if (!plannedDateWindows.has(date)) plannedDateWindows.set(date, new Set())
        return plannedDateWindows.get(date)!
    }

    // ── Pass 1: process each window across its eligible dates ─────────────────
    // Each window gets ONE slot per eligible date (not one slot total per date).
    // This means running (every day) and calisthenics (every day) can both place
    // on the same day IF duration allows — but we enforce one session per day
    // to avoid overloading. The most constrained windows win the slot.

    for (const window of activeWindows) {
        const eligibleDates = grid.filter(date => {
            if (date < todayStr || date > endDate) return false
            if (lockedDates.has(date)) return false
            // Date already has a different window — one session per day rule
            if (plannedDates.has(date)) return false
            const dayIdx = dayIndex(date)
            if (!window.allowedDays.includes(dayIdx)) return false
            const avail = prefs.availability[dayIdx]
            return avail?.available ?? false
        })

        for (const date of eligibleDates) {
            const dayIdx = dayIndex(date)
            const maxMinutes = prefs.availability[dayIdx]?.maxMinutes ?? 120

            // Build recent loads including what we've planned so far
            const recentLoads = buildRecentLoads(existingEvents, plannedEvents, activeWindows, feedbacks)
            const { blocked, blockedAreas } = isBlockedByRecovery(date, window, recentLoads)

            if (blocked) {
                // Record for mobility placement
                if (!mobilityNeeded.has(date)) mobilityNeeded.set(date, blockedAreas)
                continue
            }

            placeWindow(date, window, maxMinutes, sessions, sessionLogs, runConfigs, alreadyUsedSessions, plannedEvents, plannedDates)
            getPlannedWindowsForDate(date).add(window.id)
        }
    }

    // ── Pass 2: place mobility on blocked dates (same day first, next day after) ─

    for (const [blockedDate, areas] of mobilityNeeded) {
        // Try same day
        if (!plannedDates.has(blockedDate) && !lockedDates.has(blockedDate)) {
            const dayIdx = dayIndex(blockedDate)
            const avail = prefs.availability[dayIdx]
            if (avail?.available) {
                const mob = pickMobilitySession(avail.maxMinutes ?? 120, sessions, areas)
                if (mob) {
                    plannedEvents.push({
                        date: blockedDate, type: 'session', refId: mob.id,
                        source: 'planner', status: 'planned', windowId: 'mobility-recovery',
                    })
                    plannedDates.add(blockedDate)
                    continue
                }
            }
        }

        // Try next day
        const nextDay = toDateStr(addDays(new Date(blockedDate), 1))
        if (nextDay > endDate) continue
        if (plannedDates.has(nextDay) || lockedDates.has(nextDay)) continue
        const nextDayIdx = dayIndex(nextDay)
        const nextAvail = prefs.availability[nextDayIdx]
        if (!nextAvail?.available) continue
        const mob = pickMobilitySession(nextAvail.maxMinutes ?? 120, sessions, areas)
        if (!mob) continue
        plannedEvents.push({
            date: nextDay, type: 'session', refId: mob.id,
            source: 'planner', status: 'planned', windowId: 'mobility-recovery',
        })
        plannedDates.add(nextDay)
    }

    return plannedEvents.sort((a, b) => a.date.localeCompare(b.date))
}