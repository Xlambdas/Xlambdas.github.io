import type { DailyPreferences } from "../pages/modals/moodModal";

const STORAGE_KEY = "daily_preferences";
const FIRST_VISIT_KEY = "first_visit_ever";

interface StoredPreferences extends DailyPreferences {
    date: string;
    timestamp: number;
}

export const shouldShowDailyMood = (): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;

    try {
        const data: StoredPreferences = JSON.parse(stored);
        const today = new Date().toDateString();
        const storedDate = new Date(data.timestamp).toDateString();

        // Show if it's a different day
        return today !== storedDate;
    } catch {
        return true;
    }
};

export const saveDailyPreferences = (preferences: DailyPreferences): void => {
    const data: StoredPreferences = {
        ...preferences,
        date: new Date().toISOString(),
        timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTodayPreferences = (): DailyPreferences | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
        const data: StoredPreferences = JSON.parse(stored);
        const today = new Date().toDateString();
        const storedDate = new Date(data.timestamp).toDateString();

        if (today === storedDate) {
            return {
                mood: data.mood,
                timeAvailable: data.timeAvailable,
                goal: data.goal,
            };
        }
        return null;
    } catch {
        return null;
    }
};

// Session recommendations based on preferences
export const getSessionRecommendations = (preferences: DailyPreferences) => {
    const { mood, timeAvailable, goal } = preferences;

    // Determine session length
    let recommendedQuestions = 10;
    let recommendedDuration = "normale";

    if (timeAvailable === "5min") {
        recommendedQuestions = 5;
        recommendedDuration = "courte";
    } else if (timeAvailable === "15min") {
        recommendedQuestions = 10;
        recommendedDuration = "moyenne";
    } else if (timeAvailable === "30min") {
        recommendedQuestions = 15;
        recommendedDuration = "longue";
    } else {
        recommendedQuestions = 20;
        recommendedDuration = "intensive";
    }

    // Adjust based on mood
    if (mood === "tired" || mood === "quick-win") {
        recommendedQuestions = Math.max(3, Math.floor(recommendedQuestions * 0.6));
    } else if (mood === "energized") {
        recommendedQuestions = Math.floor(recommendedQuestions * 1.2);
    }

    // Content focus based on goal
    let contentFocus = "";
    if (goal === "review") {
        contentFocus = "Priorité aux révisions et concepts déjà vus";
    } else if (goal === "learn") {
        contentFocus = "Focus sur les nouveaux concepts";
    } else if (goal === "practice") {
        contentFocus = "Entraînement intensif et exercices";
    } else {
        contentFocus = "Exploration libre du graphe";
    }

    return {
        recommendedQuestions,
        recommendedDuration,
        contentFocus,
        energyLevel: mood,
    };
};

// First time ever tracking
export const isFirstVisitEver = (): boolean => {
    return !localStorage.getItem(FIRST_VISIT_KEY);
};

export const markFirstVisitComplete = (): void => {
    localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
};

// Select appropriate node and lesson based on preferences
export const selectSessionNode = (preferences: DailyPreferences) => {
    const { goal } = preferences;

    // Get nodes based on completion status
    const completedNodes: string[] = JSON.parse(localStorage.getItem("completed_nodes") || "[]");
    // const completedLessons: string[] = JSON.parse(localStorage.getItem("completed_lessons") || "[]");

    // Import nodes (you'll need to import initialNodes)
    // This is a simplified version - you may need to adjust based on your actual node structure

    let candidateNodes: any[] = [];

    if (goal === "review") {
        // Find nodes with completed lessons for review
        candidateNodes = completedNodes.map(id => {
            // Find node by id from initialNodes
            return { id }; // Simplified
        });
    } else if (goal === "learn") {
        // Find nodes that are unlocked but not completed
        // Simplified - you'll need actual logic here
        candidateNodes = [];
    } else if (goal === "practice" || goal === "explore") {
        // Mix of both
        candidateNodes = [];
    }

    // Return first available node (you can make this smarter)
    return candidateNodes.length > 0 ? candidateNodes[0].id : null;
};

// Store session configuration for the lesson page to use
export const setSessionConfig = (preferences: DailyPreferences) => {
    const recommendations = getSessionRecommendations(preferences);
    const config = {
        maxQuestions: recommendations.recommendedQuestions,
        energyLevel: preferences.mood,
        goal: preferences.goal,
        timestamp: Date.now(),
    };
    localStorage.setItem("current_session_config", JSON.stringify(config));
};

export const getSessionConfig = () => {
    const stored = localStorage.getItem("current_session_config");
    if (!stored) return null;

    try {
        const config = JSON.parse(stored);
        // Clear after reading
        localStorage.removeItem("current_session_config");
        return config;
    } catch {
        return null;
    }
};