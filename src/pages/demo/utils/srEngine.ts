import type { SRCard, SRRating } from "../types/types";

// --- Storage ---

const KEY = "sr_cards";

const today = () => new Date().toISOString().split("T")[0];

export const getAllCards = (): SRCard[] =>
    JSON.parse(localStorage.getItem(KEY) ?? "[]");

export const saveCards = (cards: SRCard[]): void =>
    localStorage.setItem(KEY, JSON.stringify(cards));

// --- SM-2 algorithm ---
// Converts a qualitative rating into a numeric score (0–5) then applies
// the SM-2 ease/interval update rules.

const SCORE: Record<SRRating, number> = {
    forgot: 0,
    almost: 3,
    perfect: 5,
};

export const updateCard = (card: SRCard, rating: SRRating): SRCard => {
    const q = SCORE[rating];
    let { easeFactor, interval, repetitions } = card;

    if (q < 3) {
        // Failed — reset to beginning
        repetitions = 0;
        interval = 1;
    } else {
        // Passed — advance interval
        interval =
            repetitions === 0 ? 1 :
                repetitions === 1 ? 6 :
                    Math.round(interval * easeFactor);

        easeFactor = Math.max(
            1.3,
            easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        );
        repetitions += 1;
    }

    const due = new Date();
    due.setDate(due.getDate() + interval);

    return {
        ...card,
        interval,
        easeFactor,
        repetitions,
        dueDate: due.toISOString().split("T")[0],
    };
};

// --- Card management ---

export const upsertCard = (
    questionId: string,
    nodeId: string,
    rating: SRRating,
): void => {
    const cards = getAllCards();
    const existing = cards.find(c => c.questionId === questionId);

    if (existing) {
        saveCards(cards.map(c =>
            c.questionId === questionId ? updateCard(c, rating) : c
        ));
    } else {
        const fresh: SRCard = {
            questionId,
            nodeId,
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            dueDate: today(),
        };
        saveCards([...cards, updateCard(fresh, rating)]);
    }
};

// --- Due card queries ---

export const getDueCards = (nodeId?: string): SRCard[] =>
    getAllCards()
        .filter(c => c.dueDate <= today() && (!nodeId || c.nodeId === nodeId))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

export const getDueCount = (nodeId?: string): number =>
    getDueCards(nodeId).length;

export const isNodeBranchBlocked = (nodeId: string): boolean =>
    getDueCards(nodeId).length > 0;

// --- Badge level inference ---
// Bronze = completed (default)
// Silver = avg ease factor ≥ 2.0
// Gold   = avg ease factor ≥ 2.5 AND no overdue cards

export const computeBadgeLevel = (nodeId: string): "bronze" | "silver" | "gold" => {
    const cards = getAllCards().filter(c => c.nodeId === nodeId);
    if (cards.length === 0) return "bronze";

    const avgEase = cards.reduce((s, c) => s + c.easeFactor, 0) / cards.length;

    if (avgEase >= 2.5 && getDueCards(nodeId).length === 0) return "gold";
    if (avgEase >= 2.0) return "silver";
    return "bronze";
};