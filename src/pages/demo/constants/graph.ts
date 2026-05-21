import type { NodeType } from "../types/types";

export const NODE_RADIUS: Record<NodeType["type"], number> = {
    main: 8,
    folder: 6,
    file: 5,
};

export const LOCKED_COLOR = "#4b5563";
export const SELECTED_COLOR = "#fbbf24";
export const DRAGGING_COLOR = "#fb923c";
export const PULSE_DURATION = 2000;