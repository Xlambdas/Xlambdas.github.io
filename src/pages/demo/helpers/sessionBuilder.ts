import { initialNodes, getNodeCompletionPercent, isLessonCompleted, getDynamicNodes } from '../data/graphData';
import { getDueCards } from '../utils/srEngine';
import type { DailyPreferences } from '../pages/modals/moodModal';

export interface SessionBlock {
    type: 'lesson' | 'strengthen';
    block: any; // The actual Block content
    nodeId: string;
    lessonId?: string;
    questionId?: string;
    originalIndex?: number;
    color: string;
    nodeTitle: string;
    lessonTitle?: string;
}

// --- Session Building ---

export const buildDailySession = (preferences: DailyPreferences): SessionBlock[] => {
    const { mood, timeAvailable, goal } = preferences;

    console.log("🎯 === BUILDING DAILY SESSION ===");
    console.log("Mood:", mood);
    console.log("Time:", timeAvailable);
    console.log("Goal:", goal);

    // Calculate total capacity based on time
    let totalSlots = 10;
    if (timeAvailable === '5min') totalSlots = 8;
    else if (timeAvailable === '15min') totalSlots = 20;
    else if (timeAvailable === '30min') totalSlots = 40;
    else totalSlots = 80; // 1 hour+

    console.log("Base slots:", totalSlots);

    // Adjust for mood
    if (mood === 'tired' || mood === 'quick-win') {
        totalSlots = Math.max(5, Math.floor(totalSlots * 0.5));
    } else if (mood === 'energized') {
        totalSlots = Math.floor(totalSlots * 1.5);
    }

    console.log("After mood adjustment:", totalSlots);

    // Calculate lesson/strengthen ratio based on goal
    let lessonRatio = 0.5;
    if (goal === 'learn') {
        lessonRatio = 0.7;      // 70% lessons, 30% strengthen
    } else if (goal === 'review') {
        lessonRatio = 0.2;      // 20% lessons, 80% strengthen
    } else if (goal === 'practice') {
        lessonRatio = 0.4;      // 40% lessons, 60% strengthen
    } else if (goal === 'explore') {
        lessonRatio = 0.6;      // 60% lessons, 40% strengthen
    }

    const lessonCount = Math.floor(totalSlots * lessonRatio);
    const strengthenCount = totalSlots - lessonCount;

    console.log("Lesson ratio:", lessonRatio);
    console.log("Lesson slots:", lessonCount);
    console.log("Strengthen slots:", strengthenCount);

    // Get lesson blocks
    const lessonBlocks = getLessonBlocks(lessonCount, goal);
    console.log("Got lesson blocks:", lessonBlocks.length);

    // Get strengthen blocks
    const strengthenBlocks = getStrengthenBlocks(strengthenCount);
    console.log("Got strengthen blocks:", strengthenBlocks.length);

    // Interleave them
    const finalBlocks = interleaveBlocks(lessonBlocks, strengthenBlocks, lessonRatio);
    console.log("Final session:", finalBlocks.length, "blocks");
    console.log("=== SESSION BUILD COMPLETE ===");

    return finalBlocks;
};

// --- Get Lesson Blocks ---

export const getLessonBlocks = (count: number, goal: string): SessionBlock[] => {
    if (count === 0) return [];

    const blocks: SessionBlock[] = [];

    // Get dynamically unlocked nodes
    const dynamicNodes = getDynamicNodes();

    const visibleIds = new Set(
        dynamicNodes
            .filter(n => n.isUnlocked)
            .map(n => n.id)
    );

    console.log("📚 Dynamic nodes unlocked:", Array.from(visibleIds));

    // Find nodes with incomplete lessons
    const candidates = dynamicNodes
        .filter(node => {
            if ((node as any).type === 'profile') return false;
            if (!node.lessonPath || node.lessonPath.length === 0) return false;
            if (!visibleIds.has(node.id)) return false;

            const completion = getNodeCompletionPercent(node.id);

            if (goal === 'learn') {
                return completion < 50; // Prefer less-completed nodes
            } else if (goal === 'review') {
                // In-progress nodes, but if none exist, fallback to any incomplete
                return completion < 100; // Changed: was "completion > 0 && completion < 100"
            } else {
                return completion < 100; // Any incomplete
            }
        })
        .sort((a, b) => {
            const aComp = getNodeCompletionPercent(a.id);
            const bComp = getNodeCompletionPercent(b.id);

            if (goal === 'learn') {
                return aComp - bComp; // Less complete first
            } else {
                return bComp - aComp; // More complete first
            }
        });

    console.log("📚 Total nodes:", initialNodes.length);
    console.log("📚 Visible nodes:", visibleIds.size, Array.from(visibleIds));
    console.log("📚 After filters:", candidates.length, "candidate nodes");

    // Debug: Show why nodes were filtered out
    initialNodes.forEach(node => {
        const isProfile = (node as any).type === 'profile';
        const hasLessons = node.lessonPath && node.lessonPath.length > 0;
        const isVisible = visibleIds.has(node.id);
        const completion = getNodeCompletionPercent(node.id);

        let goalMatch = false;
        if (goal === 'learn') {
            goalMatch = completion < 50;
        } else if (goal === 'review') {
            goalMatch = completion > 0 && completion < 100;
        } else {
            goalMatch = completion < 100;
        }

        console.log(`  Node ${node.id}:`, {
            isProfile,
            hasLessons,
            isVisible,
            completion,
            goalMatch,
            PASSED: !isProfile && hasLessons && isVisible && goalMatch
        });
        });
    // Collect COMPLETE lessons (not fragments)
    for (const node of candidates) {
        if (blocks.length >= count) break;

        const color = (node as any).branchColor || '#a5b4fc';

        // Find next incomplete lesson
        for (const lesson of node.lessonPath) {
            if (blocks.length >= count) break;
            if (isLessonCompleted(node.id, lesson.id)) continue;

            // Add complete lesson if it fits
            const lessonBlocks = lesson.blocks;
            const remainingSlots = count - blocks.length;

            if (lessonBlocks.length <= remainingSlots) {
                // Fits completely - add all blocks
                lessonBlocks.forEach((block, index) => {
                    blocks.push({
                        type: 'lesson',
                        block,
                        nodeId: node.id,
                        lessonId: lesson.id,
                        originalIndex: index,
                        color,
                        nodeTitle: node.title,
                        lessonTitle: lesson.title,
                    });
                });
                console.log(`  ✓ Added lesson "${lesson.title}" (${lessonBlocks.length} blocks) from ${node.title}`);
                // Continue to next lesson (don't break - keep adding from this node)
            } else {
                // Lesson doesn't fit - try next node
                break;
            }
        }
    }

    console.log("📚 Total lesson blocks collected:", blocks.length);
    return blocks;
};

// --- Get Strengthen Blocks ---

export const getStrengthenBlocks = (count: number): SessionBlock[] => {
    if (count === 0) return [];

    const blocks: SessionBlock[] = [];

    // Get dynamically unlocked nodes
    const dynamicNodes = getDynamicNodes();

    const visibleIds = new Set(
        dynamicNodes
            .filter(n => n.isUnlocked)
            .map(n => n.id)
    );

    // Get all due cards
    const dueCards = getDueCards();
    console.log("💪 Total due cards:", dueCards.length);

    // Convert due cards to SessionBlocks
    for (const card of dueCards.slice(0, count)) {
        const nodeId = card.nodeId;
        const node = dynamicNodes.find(n => n.id === nodeId);

        if (!node || !visibleIds.has(nodeId)) {
            console.log(`  ❌ Skipped card ${card.questionId}: node not found or locked`);
            continue;
        }

        const color = (node as any).branchColor || '#a5b4fc';

        // Find the question in node.questions
        if (node.questions) {
            const nodeQuestion = node.questions.find(nq =>
                `${nodeId}::${nq.id}` === card.questionId
            );

            if (nodeQuestion) {
                blocks.push({
                    type: 'strengthen',
                    block: {
                        type: 'quiz',
                        question: nodeQuestion.question,
                    },
                    nodeId: nodeId,
                    questionId: card.questionId,
                    color,
                    nodeTitle: node.title,
                });
                console.log(`  ✓ Added strengthen block for ${card.questionId}`);
            } else {
                console.log(`  ❌ Question not found: ${card.questionId} in node ${nodeId}`);
            }
        } else {
            console.log(`  ❌ Node ${nodeId} has no questions array`);
        }
    }

    console.log("💪 Total strengthen blocks collected:", blocks.length);
    return blocks;
};

// --- Interleave Blocks ---

export const interleaveBlocks = (
    lessonBlocks: SessionBlock[],
    strengthenBlocks: SessionBlock[],
    lessonRatio: number
): SessionBlock[] => {
    const result: SessionBlock[] = [];

    // If no lessons or no strengthen, just return what we have
    if (lessonBlocks.length === 0) return strengthenBlocks;
    if (strengthenBlocks.length === 0) return lessonBlocks;

    // Calculate how often to insert strengthen blocks
    // If lessonRatio = 0.7, we want ~3 lessons for every 1 strengthen
    const lessonInterval = Math.ceil(1 / (1 - lessonRatio));

    let lessonIndex = 0;
    let strengthenIndex = 0;

    console.log("🔀 Interleaving with interval:", lessonInterval);

    while (lessonIndex < lessonBlocks.length || strengthenIndex < strengthenBlocks.length) {
        // Add lesson blocks
        for (let i = 0; i < lessonInterval && lessonIndex < lessonBlocks.length; i++) {
            result.push(lessonBlocks[lessonIndex++]);
        }

        // Add one strengthen block
        if (strengthenIndex < strengthenBlocks.length) {
            result.push(strengthenBlocks[strengthenIndex++]);
        }
    }

    console.log("🔀 Interleaved:", result.length, "blocks");
    return result;
};

// --- Session Storage ---

export const storeSession = (blocks: SessionBlock[]): void => {
    sessionStorage.setItem('daily_session', JSON.stringify(blocks));
};

export const getStoredSession = (): SessionBlock[] | null => {
    const stored = sessionStorage.getItem('daily_session');
    return stored ? JSON.parse(stored) : null;
};

export const clearStoredSession = (): void => {
    sessionStorage.removeItem('daily_session');
};