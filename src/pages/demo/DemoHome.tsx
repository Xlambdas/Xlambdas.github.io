import { type NodeType } from './data/graphData';

// --- Hooks ---
import {
    useDemoHomeState,
    // SIZE_MAP,
    persist,
    useSearchSuggestions
} from './hooks';

// --- Layout components ---
import { TopBar } from "./components/ui/TopBar";
// import { BottomActions } from "./components/ui/BottomActions";

// --- Existing components ---
import DemoGraph from "./graphView/demoGraph";
import { Sidebar } from "./components/ui/sidebar";
import { Legend } from "./graphView/legend";
import { SettingsPanel } from "./components/settings";
import { FunFactModal } from "./sections/funFactModal";
import { TeacherLoginModal } from "./sections/teacherLoginModal";
import { ProfileNodeModal } from "./sections/ProfileNodeModal";

import { NodeCard } from "./components/node/nodeCard";
import { useEffect, useState } from 'react';
import { StrengthenModal } from './sections/strengthenModal';

// --- Feature flags ---
// const SHOW_FUN_FACT = true;
// const SHOW_STRENGTHEN = true;

// --- --- ---
export function DemoHome() {
    const state = useDemoHomeState();
    // const fs = SIZE_MAP[state.textSize];
    const [strengthenModalOpen, setStrengthenModalOpen] = useState(false);

    // Expose the function to open the strengthen modal globally
    useEffect(() => {
        window.__openStrengthenModal = () => setStrengthenModalOpen(true);
        return () => {
            window.__openStrengthenModal = undefined;
        };
    }, []);

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
                </div>
            </div>

            {/* --- Fullscreen overlays --- */}

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

            {strengthenModalOpen && (
                <StrengthenModal
                    onClose={() => setStrengthenModalOpen(false)}
                    onStartSession={() => {
                        setStrengthenModalOpen(false);
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