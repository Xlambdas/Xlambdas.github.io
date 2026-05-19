import { type NodeType } from './data/graphData';

// --- Hooks ---
import {
    useDemoHomeState,
    // SIZE_MAP,
    persist,
    useLessonFlow,
    useSearchSuggestions
} from './hooks';

// --- Layout components ---
import { TopBar } from "./components/ui/TopBar";
// import { BottomActions } from "./components/ui/BottomActions";

// --- Existing components ---
import DemoGraph from "./graphView/demoGraph";
import { Sidebar } from "./components/ui/sidebar";
import { Legend } from "./graphView/legend";
// import { NodePanel } from "./components/node/nodePanel";
import { SettingsPanel } from "./components/settings";
import { FunFactModal } from "./sections/funFactModal";
import { TeacherLoginModal } from "./sections/teacherLoginModal";
import { LessonPathView } from "./sections/lessonPathView";
import { LessonPlayer } from "./components/lessons/lessonPlayer";
import { StrengthenSession } from "./sections/strengthenSession";
import { ProfileView } from "./sections/profileView";
import { initialNodes } from "./data/graphData";
import { ProfileNodeModal } from "./sections/ProfileNodeModal";

import { NodeCard } from "./components/node/nodeCard";

// --- Feature flags ---
// const SHOW_FUN_FACT = true;
// const SHOW_STRENGTHEN = true;

// --- --- ---
export function DemoHome() {
    const state = useDemoHomeState();
    // const fs = SIZE_MAP[state.textSize];

    const { openLesson, handleLessonComplete, handleLessonClose } = useLessonFlow({
        activeLesson: state.activeLesson,
        setActiveLesson: state.setActiveLesson,
        setPathNode: state.setPathNode,
        setActiveNode: state.setActiveNode,
        setRefreshKey: state.setRefreshKey,
        setNewlyUnlockedIds: state.setNewlyUnlockedIds,
    });

    const { handleSearchChange } = useSearchSuggestions({
        setSearchQuery: state.setSearchQuery,
        setSuggestions: state.setSuggestions,
    });

    // --- Handlers ---
    const handleNodeSelect = (node: NodeType | null) => {
        state.setActiveNode(node);
    };

    const handleCollapse = (val: boolean) => {
        state.setCollapsed(val);
        persist("graph_collapsed", String(val));
    };

    const handleTextSize = (size: typeof state.textSize) => {
        state.setTextSize(size);
        persist("graph_textSize", size);
    };

    const handleSuggestionSelect = (node: NodeType) => {
        state.setSearchQuery(node.title);
        window.__graphSearch?.(node.title);
        window.__graphFocus?.(node.id);
        // state.setPreviewNode(node);
        state.setActiveNode(node);
        state.setSuggestions([]);
        state.setMobileSearch(false);
    };

    // --- Render ---
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f14] font-sans fixed inset-0" style={{ height: "100dvh" }}>

            {/* --- Sidebar (desktop only) --- */}
            <div className="hidden sm:block">
                <Sidebar
                    collapsed={state.collapsed}
                    onCollapse={() => handleCollapse(true)}
                    onSelectNode={state.setActiveNode}
                    textSize={state.textSize}
                    isTeacher={state.isTeacher}
                    teacherName={state.teacherName}
                />
            </div>

            {/* --- Main column --- */}
            <div className="flex flex-col flex-1 overflow-hidden min-w-0 h-full">

                <TopBar
                    collapsed={state.collapsed}
                    onCollapse={() => handleCollapse(false)}
                    textSize={state.textSize}
                    settingsOpen={state.settingsOpen}
                    onSettingsToggle={() => state.setSettingsOpen(v => !v)}
                    mobileSearch={state.mobileSearch}
                    setMobileSearch={state.setMobileSearch}
                    searchQuery={state.searchQuery}
                    suggestions={state.suggestions}
                    onSearchChange={handleSearchChange}
                    onSuggestionSelect={handleSuggestionSelect}
                    searchInputRef={state.searchInputRef as React.RefObject<HTMLInputElement>}
                />

                {/* Canvas area */}
                <div className="flex-1 overflow-hidden relative h-0" style={{ marginTop: 58 }}>
                    <DemoGraph
                        onSelectNode={handleNodeSelect}
                        refreshKey={state.refreshKey}
                        newlyUnlockedIds={state.newlyUnlockedIds}
                    />

                    {/* Overlays inside canvas */}
                    {/* <NodePanel
                        node={state.selectedNode}
                        onClose={() => state.setSelectedNode(null)}
                        textSize={state.textSize}
                    /> */}
                    <div className='hidden sm:block'>
                        <Legend textSize={state.textSize} />
                    </div>

                    {state.settingsOpen && (
                        <SettingsPanel
                            onClose={() => state.setSettingsOpen(false)}
                            textSize={state.textSize}
                            onTextSizeChange={handleTextSize}
                            isTeacher={state.isTeacher}
                            teacherName={state.teacherName}
                            onTeacherToggle={() => {
                                if (state.isTeacher) {
                                    state.setIsTeacher(false);
                                    state.setTeacherName("");
                                    localStorage.removeItem("teacher_mode");
                                    localStorage.removeItem("teacher_name");
                                } else {
                                    state.setSettingsOpen(false);
                                    state.setShowTeacherLogin(true);
                                }
                            }}
                        />
                    )}

                    {/* <BottomActions
                        fontSize={fs}
                        showFunFact={SHOW_FUN_FACT}
                        showStrengthen={SHOW_STRENGTHEN}
                        onFunFact={() => state.setFunFactOpen(true)}
                        onStrengthen={() => {
                            state.setStrengthenNodeId(undefined);
                            state.setStrengthenOpen(true);
                        }}
                    /> */}
                </div>
            </div>

            {/* --- Fullscreen overlays --- */}

            {/* <NodePreviewPanel
                node={state.previewNode}
                onClose={() => state.setPreviewNode(null)}
                onOpenPath={openPath}
            /> */}

            {/* Node card or Profile modal */}
            {state.activeNode && (state.activeNode as any).kind === "profile" ? (
                <ProfileNodeModal
                    onClose={() => state.setActiveNode(null)}
                    onOpenStrengthen={() => {
                        state.setActiveNode(null);
                        state.setStrengthenNodeId(undefined);
                        state.setStrengthenOpen(true);
                    }}
                />
            ) : state.activeNode ? (
                <NodeCard
                    node={state.activeNode}
                    onClose={() => state.setActiveNode(null)}
                    onOpenSettings={() => state.setSettingsOpen(true)}
                    onOpenProfile={() => { state.setActiveNode(null); state.setProfileOpen(true); }}
                    onOpenStrengthen={(nodeId) => {
                        state.setActiveNode(null);
                        state.setStrengthenNodeId(nodeId);
                        state.setStrengthenOpen(true);
                    }}
                />
            ) : null}

            {state.pathNode && (
                <LessonPathView
                    node={state.pathNode}
                    onClose={() => state.setPathNode(null)}
                    onStartLesson={openLesson}
                    onOpenStrengthen={(nodeId) => {
                        state.setPathNode(null);
                        state.setStrengthenNodeId(nodeId);
                        state.setStrengthenOpen(true);
                    }}
                />
            )}

            {state.activeLesson && (
                <LessonPlayer
                    node={state.activeLesson.node}
                    lesson={state.activeLesson.lesson}
                    lessonIndex={state.activeLesson.index}
                    onComplete={handleLessonComplete}
                    onClose={handleLessonClose}
                />
            )}

            {state.funFactOpen && (
                <FunFactModal
                    onClose={() => state.setFunFactOpen(false)}
                    onNavigate={(node) => {
                        state.setFunFactOpen(false);
                        state.setActiveNode(node);
                        window.__graphFocus?.(node.id);
                    }}
                />
            )}

            {state.strengthenOpen && (
                <StrengthenSession
                    nodeId={state.strengthenNodeId}
                    onClose={() => {
                        state.setStrengthenOpen(false);
                        state.setRefreshKey(k => k + 1);
                    }}
                />
            )}

            {state.profileOpen && (
                <ProfileView
                    onClose={() => state.setProfileOpen(false)}
                    onNavigate={(nodeId) => {
                        state.setProfileOpen(false);
                        const node = initialNodes.find(n => n.id === nodeId);
                        if (node) {
                            state.setActiveNode(node);
                            window.__graphFocus?.(nodeId);
                        }
                    }}
                    onOpenStrengthen={() => {
                        state.setStrengthenNodeId(undefined);
                        state.setStrengthenOpen(true);
                    }}
                />
            )}

            {state.showTeacherLogin && (
                <TeacherLoginModal
                    onSuccess={(name) => {
                        state.setIsTeacher(true);
                        state.setTeacherName(name);
                        state.setShowTeacherLogin(false);
                        persist("teacher_mode", "true");
                        persist("teacher_name", name);
                    }}
                    onClose={() => state.setShowTeacherLogin(false)}
                />
            )}
        </div>
    );
}