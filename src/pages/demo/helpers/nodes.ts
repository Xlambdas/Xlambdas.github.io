import type { Lesson, NodeType } from "../types/types";
import { initialNodes, getDynamicNodes, getNodeCompletionPercent, isLessonCompleted } from "../data/graphData";
import { getAllQuestions, getAllCards } from "../utils/srEngine";

export const findParent = (nodeId: string) =>
    initialNodes.find(n => n.links.includes(nodeId));

// Check if we should go back to home
export const shouldNavigateToHome = (): boolean => {
    // Check if we came from a lesson completion/close
    const fromLesson = sessionStorage.getItem('from_lesson');
    if (fromLesson === 'true') {
        sessionStorage.removeItem('from_lesson'); // Clear the flag
        return true;
    }
    return false;
};

// Build the complete path tree - traverse backwards to root, then forwards
export const buildPathTree = (startNode: NodeType, selectedPaths: Record<string, string> = {}): {
    sections: Array<{ node: NodeType; lessons: Lesson[] }>;
    pathOptions: Array<{ nodeId: string; nodes: NodeType[] }>;
} => {
    const sections: Array<{ node: NodeType; lessons: Lesson[] }> = [];
    const pathOptions: Array<{ nodeId: string; nodes: NodeType[] }> = [];
    const dynamicNodes = getDynamicNodes();

    // Step 1: Traverse backwards to find root
    const pathToRoot: NodeType[] = [];
    let currentNode: NodeType | undefined = startNode;

    while (currentNode) {
        pathToRoot.unshift(currentNode); // Add to beginning
        const parent = findParent(currentNode.id);
        if (parent && !pathToRoot.some(n => n.id === parent.id)) {
            currentNode = parent;
        } else {
            currentNode = undefined; // Reached root
        }
    }

    // Step 2: Traverse forwards from root following selected paths
    const traverse = (node: NodeType) => {
        // Add current node's lessons as a section
        if (node.lessonPath && node.lessonPath.length > 0) {
            sections.push({
                node,
                lessons: node.lessonPath,
            });
        }

        // Get next nodes
        const nextNodeIds = node.links || [];
        const nextNodes = nextNodeIds
            .map(id => dynamicNodes.find(n => n.id === id))
            .filter(Boolean) as NodeType[];

        if (nextNodes.length > 0) {
            // Add path options
            pathOptions.push({
                nodeId: node.id,
                nodes: nextNodes,
            });

            // Determine which path to follow
            let selectedNode: NodeType | undefined;

            if (selectedPaths[node.id]) {
                // Use user's selection
                selectedNode = nextNodes.find(n => n.id === selectedPaths[node.id]);
            } else {
                // Check if we're on the path to startNode
                const nodeIndexInPath = pathToRoot.findIndex(n => n.id === node.id);
                if (nodeIndexInPath !== -1 && nodeIndexInPath < pathToRoot.length - 1) {
                    // We're on the path to startNode, follow it
                    const nextInPath = pathToRoot[nodeIndexInPath + 1];
                    selectedNode = nextNodes.find(n => n.id === nextInPath?.id);
                }
                // else: not on path and no selection -> stop here
            }

            // Continue traversing only if a path was selected
            if (selectedNode) {
                traverse(selectedNode);
            }
        }
    };

    // Start from root
    if (pathToRoot.length > 0) {
        traverse(pathToRoot[0]);
    }

    return { sections, pathOptions };
};

// Get selected paths from localStorage
export const getSelectedPaths = (): Record<string, string> => {
    try {
        return JSON.parse(localStorage.getItem("selected_paths") || "{}");
    } catch {
        return {};
    }
};

// Save selected path
export const saveSelectedPath = (parentNodeId: string, selectedNodeId: string) => {
    const paths = getSelectedPaths();
    paths[parentNodeId] = selectedNodeId;
    localStorage.setItem("selected_paths", JSON.stringify(paths));
};


export const getStats = (node: NodeType): { label: string; value: string | number }[] => {
    const type = (node as any).type ?? "concept";
    const pct = getNodeCompletionPercent(node.id);

    // Helper to check if a question's lesson is COMPLETED (not just accessible)
    const isQuestionAccessible = (question: any, nodeId: string) => {
        if (!question) return false;

        const targetNode = getDynamicNodes().find(n => n.id === nodeId);
        if (!targetNode?.lessonPath) return false;

        const lesson = targetNode.lessonPath.find(l => l.id === question.lessonId);
        if (!lesson) return false;

        // Question is only accessible if its lesson is COMPLETED
        return isLessonCompleted(nodeId, question.lessonId);
    };

    switch (type) {
        case "domain":
        case "topic": {
            const children = getDynamicNodes().filter(n =>
                node.links.includes(n.id)
            );
            const totalLessons = children.reduce(
                (s, n) => s + (n.lessonPath?.length ?? 0), 0
            );

            // Count questions from this node + children, filtered by accessibility
            const allQuestions = getAllQuestions();

            const totalQuestions = allQuestions.filter(q =>
                q.nodeId === node.id && isQuestionAccessible(q, node.id)
            ).length;
            // Count due cards (only from accessible questions)
            const allCards = getAllCards();
            const today = new Date().toISOString().split("T")[0];

            const totalDue = allCards.filter(c =>
                c.nodeId === node.id &&
                c.dueDate <= today &&
                isQuestionAccessible(allQuestions.find(q => q.id === c.questionId), node.id)
            ).length;

            if (pct === 0) {
                return [
                    { label: type === "domain" ? "Sujets" : "Concepts", value: children.length },
                    { label: "Questions", value: "--" },
                    { label: "À réviser", value: "--" },
                ];
            }

            if (pct === 100) {
                return [
                    { label: type === "domain" ? "Sujets" : "Concepts", value: children.length },
                    { label: "Questions", value: totalQuestions },
                    { label: "À réviser", value: totalDue },
                ];
            }

            if (totalDue > 0) {
                return [
                    { label: type === "domain" ? "Sujets" : "Concepts", value: children.length },
                    // { label: "Questions", value: totalQuestions },
                    { label: "À réviser", value: `${totalDue}/${totalQuestions}` },
                    { label: "Progression", value: `${pct}%` },
                ];
            }


            return [
                { label: type === "domain" ? "Sujets" : "Concepts", value: children.length },
                { label: "Leçons", value: totalLessons },
                { label: "Progression", value: `${pct}%` },
            ];
        }
        case "concept":
        case "subconcept":
        default: {
            const lessons = node.lessonPath?.length ?? 0;

            // Count only accessible questions for this node
            const allQuestions = getAllQuestions();
            const questions = allQuestions.filter(q =>
                q.nodeId === node.id && isQuestionAccessible(q, node.id)
            ).length;

            // Count only due cards from accessible questions
            const allCards = getAllCards();
            const today = new Date().toISOString().split("T")[0];
            const dueForNode = allCards.filter(c =>
                c.nodeId === node.id &&
                c.dueDate <= today &&
                isQuestionAccessible(allQuestions.find(q => q.id === c.questionId), node.id)
            ).length;

            if (pct === 100) {
                return [
                    { label: "Leçons", value: lessons },
                    { label: "Questions", value: questions },
                    { label: "À réviser", value: dueForNode },
                ];
            }


            if (dueForNode > 0) {
                return [
                    { label: "Leçons", value: lessons },
                    { label: "À réviser", value: `${dueForNode}/${questions}` },
                    { label: "Progression", value: `${pct}%` },
                ];
            }

            return [
                { label: "Leçons", value: lessons },
                { label: "Questions", value: questions },
                { label: "Progression", value: `${pct}%` },
            ];
        }
    }
};