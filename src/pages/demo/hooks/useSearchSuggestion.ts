import { type NodeType, getVisibleIds, initialNodes } from "../data/graphData";

interface UseSearchSuggestionsParams {
    setSearchQuery: (q: string) => void;
    setSuggestions: (nodes: NodeType[]) => void;
}

export function useSearchSuggestions({
    setSearchQuery,
    setSuggestions,
}: UseSearchSuggestionsParams) {

    const visibleNodes = initialNodes.filter(n =>
        getVisibleIds(initialNodes).has(n.id)
    );

    const handleSearchChange = (q: string) => {
        setSearchQuery(q);
        window.__graphSearch?.(q);
        setSuggestions(
            q.length > 0
                ? visibleNodes
                    .filter(n => n.title.toLowerCase().includes(q.toLowerCase()))
                    .slice(0, 5)
                : []
        );
    };

    return { handleSearchChange, visibleNodes };
}