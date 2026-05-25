// --- general types ---

export type TextSize = "S" | "M" | "L";

// --- Quiz question types ---

export type MultipleChoiceQuestion = {
    type: "multiple_choice";
    question: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
};

export type TrueFalseQuestion = {
    type: "true_false";
    question: string;
    correct: boolean;
    explanation: string;
};

export type OrderingQuestion = {
    type: "ordering";
    question: string;
    items: string[];
    correctOrder: number[]; // indices of items in correct order
    explanation: string;
};

export type MatchPairsQuestion = {
    type: "match_pairs";
    question: string;
    pairs: { left: string; right: string }[];
    explanation: string;
};

export type WordBankQuestion = {
    type: "word_bank";
    question: string;          // use ___ for blank
    sentence: string;          // full sentence with ___ blanks
    bank: string[];            // all words including distractors
    correctWords: string[];    // words that fill blanks in order
    explanation: string;
};

export type SentenceQuestion = {
    type: "sentence";
    question: string;
    placeholder: string;
    modelAnswer: string;       // shown after, not auto-graded
    explanation: string;
};

export type QuizQuestion =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | OrderingQuestion
    | MatchPairsQuestion
    | WordBankQuestion
    | SentenceQuestion;

// --- Spaced repetition ---

export type SRCard = {
    questionId: string;        // Format: "nodeId::questionId" (e.g., "psychologie::intro_q1")
    nodeId: string;            // The node this question belongs to
    interval: number;          // days until next review
    easeFactor: number;        // SM-2 ease factor, starts at 2.5
    dueDate: string;           // ISO date string
    repetitions: number;       // number of times reviewed
};

export type SRRating = "forgot" | "almost" | "perfect";

// --- Lesson content blocks ---

export type ExplanationBlock = {
    type: "explanation";
    title?: string;
    content: string;           // markdown-ish, supports **bold** and *italic*
};

export type VignetteBlock = {
    type: "vignette";
    title: string;             // e.g. "Paris, 1956"
    content: string;           // narrative in second person
};

export type QuizBlock = {
    type: "quiz";
    question?: QuizQuestion;
    questionId?: string;
};

export type RecapBlock = {
    type: "recap";
    points: string[];          // bullet list of key takeaways
};

export type ContentBlock =
    | ExplanationBlock
    | VignetteBlock
    | QuizBlock
    | RecapBlock;

// --- Lesson ---

export type LessonType =
    | "explanation"   // text + inline quizzes
    | "vignette"      // narrative story
    | "recap"         // review of previous lessons
    | "video"         // youtube / notebookLM
    | "quiz"          // pure quiz session
    | "final_quiz";   // pure quiz session with all questions from previous lessons for spaced repetition

export type Lesson = {
    id: string;
    title: string;
    type: LessonType;
    isOptional?: boolean;
    estimatedMinutes: number;
    blocks: ContentBlock[];    // ordered content blocks
    videoUrl?: string;         // for type "video"
};

// --- Badge ---

export type BadgeLevel = "bronze" | "silver" | "gold";

export type Badge = {
    id: string;
    nodeId: string;
    icon: string;              // emoji for now
    name: string;
    description: string;
    levels: {
        bronze: string;        // condition description
        silver: string;
        gold: string;
    };
};

export type EarnedBadge = {
    badgeId: string;
    nodeId: string;
    level: BadgeLevel;
    earnedAt: string;          // ISO date
};

// --- Node ---

export type NodeQuestion = {
    id: string;              // Unique question ID
    lessonId: string;        // Which lesson it belongs to
    blockIndex: number;      // Position in lesson blocks
    question: QuizQuestion;  // The actual question
};

export type typesFR = {
    profile: "profil";
    domain: "domaine";
    topic: "sujet";
    concept: "concept";
    subconcept: "sous-concept";
};

export type NodeType = {
    id: string;
    title: string;

    // graph visual (keep for d3)
    type: "profile" | "domain" | "topic" | "concept" | "subconcept";
    links: string[];

    // lock state — computed dynamically, don't set manually except for root nodes
    isUnlocked: boolean;

    // prerequisites — all must be completed before this node unlocks
    prerequisites: string[];

    branchColor: string;

    // content
    hook?: string;
    shortDescription?: string;
    questions?: NodeQuestion[]; // for quick quiz access without loading lessons
    lessonPath: Lesson[];      // ordered list of lessons (hexagons in the path)
    badge?: Badge;

    // optional branches (shown as separate hexagon cluster)
    optionalLessonPath?: Lesson[];

    // graph position hints (d3 will override)
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
};

// --- User progress ---

export type LessonProgress = {
    nodeId: string;
    lessonId: string;
    completedAt: string;
    quizScores: Record<string, SRRating>; // questionId → rating
};

export type UserProfile = {
    name: string;
    avatarEmoji: string;
    joinDate: string;
};

export type LessonStatus = "completed" | "current" | "locked";
export type ConfirmState = "idle" | "confirming" | "done";
export type Phase = "playing" | "completed";


// --- Helper types for working with questions ---

export type QuestionReference = {
    nodeId: string;
    questionId: string;
};

export type QuestionWithMetadata = {
    id: string;              // Full ID: "nodeId::questionId"
    nodeId: string;
    lessonId: string;
    blockIndex: number;
    question: QuizQuestion;
    // Derived fields for display
    questionText: string;
    answerText: string;
};