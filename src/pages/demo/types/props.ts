import type {
    NodeType, ContentBlock, TextSize, Lesson,
    QuizQuestion,
    SRRating,
} from "../types";


export interface DemoGraphProps {
    onSelectNode?: (node: NodeType | null) => void;
    refreshKey?: number;
    newlyUnlockedIds?: string[];
}

export interface BlockWithMetadata {
    block: ContentBlock;
    originalIndex: number;
    isRetry?: boolean;
}

export interface TopBarProps {
    collapsed: boolean;
    onCollapse: (val: boolean) => void;
    textSize: TextSize;
    settingsOpen: boolean;
    onSettingsToggle: () => void;

    // Search
    mobileSearch: boolean;
    setMobileSearch: (val: boolean) => void;
    searchQuery: string;
    suggestions: NodeType[];
    onSearchChange: (q: string) => void;
    onSuggestionSelect: (node: NodeType) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}

export interface BottomActionsProps {
    fontSize: number;
    showFunFact: boolean;
    showStrengthen: boolean;
    onFunFact: () => void;
    onStrengthen: () => void;
}

export interface NodePathSettingsProps {
    node: NodeType;
    onClose: () => void;
}

export interface NodeCardProps {
    node: NodeType | null;
    onClose: () => void;
    onOpenSettings: () => void;
    onOpenProfile: () => void;
    onOpenStrengthen: (nodeId: string) => void;
}

export interface SidebarProps {
    collapsed: boolean;
    onCollapse: () => void;
    onSelectNode: (node: NodeType) => void;
    textSize: TextSize;
    isTeacher: boolean;
    teacherName: string;
}

// -- honeyCombPath props --

export interface PathSection {
    node: NodeType;
    lessons: Lesson[];
}

export interface HoneycombPathProps {
    sections: PathSection[];
    currentNodeId: string;
    onLessonClick: (node: NodeType, lesson: Lesson, lessonIndex: number) => void;
    onPathSelect?: (nodeId: string) => void;
    pathOptions?: { nodeId: string; nodes: NodeType[] }[];
    selectedPaths?: Record<string, string>;
    scrollToLesson?: string;
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
}


// --- quiz props ---

export interface QuizInteractionProps {
    question: QuizQuestion;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
    submitted?: boolean;
    userAnswer?: any;
}

export interface QuizBlockPlayerProps {
    question: QuizQuestion;
    color: string;
    onComplete: (correct: boolean, rating: SRRating, userAnswer: any) => void;
    onExplain: (explanation: string) => void;
    isAnswered: boolean;
    reviewMode?: boolean;
    reviewData?: any;
    reviewCorrect?: boolean;
    onContinue?: () => void;
    onPrevious?: () => void;
}


// --- Lessons props ---

export interface LessonProgressBarProps {
    blocks: ContentBlock[];
    currentIndex: number;
    color: string;
}

export interface LessonPlayerProps {
    // Generic props (used by both)
    title: string;
    subtitle?: string;
    blocks: ContentBlock[];
    color: string;
    totalBlocks?: number; // For progress display
    onComplete: () => void;
    onClose: () => void;

    // Optional lesson-specific props
    node?: NodeType;
    lesson?: Lesson;
    showCompletionScreen?: boolean; // Show badge/node completion
}

export interface ExplanationModalProps {
    explanation: string;
    onClose: () => void;
}

export interface BlockRendererProps {
    block: ContentBlock;
    color: string;
    nodeId: string;
    onQuizComplete: (correct: boolean, rating: SRRating, userAnswer: any) => void;
    onExplain: (explanation: string) => void;
    isAnswered: boolean;
    isRetry?: boolean;
    reviewMode?: boolean;
    reviewAnswer?: any;
    reviewCorrect?: boolean;
    onContinue?: () => void;
    onPrevious?: () => void;
    canContinue?: boolean;
    buttonLabel?: string;
}

export interface SettingsPanelProps {
    onClose: () => void;
    textSize: "S" | "M" | "L";
    onTextSizeChange: (size: "S" | "M" | "L") => void;
    isTeacher: boolean;
    onTeacherToggle: () => void;
    teacherName: string;
}

export interface ProfileNodeModalProps {
    onClose: () => void;
    onOpenStrengthen: () => void;
}

// --- strengthen props ---

export interface StrengthenModalProps {
    onClose: () => void;
    onStartSession: () => void;
    nodeId?: string;
    nodeName?: string;
}

export interface StrengthenSettings {
    sessionLength: number; // number of cards
    includeNew: boolean;
    focusWeak: boolean;
    selectedTopics: string[]; // node IDs
}

export interface BlockWithMetadata {
    block: ContentBlock;
    originalIndex: number;
    isRetry?: boolean;  // Mark cards that were re-added
}

export interface StrengthenBlockMetadata {
    block: ContentBlock;
    originalIndex: number;
    questionId: string;  // Store the full question ID
    nodeId: string;      // Store the node ID
    isRetry?: boolean;
}