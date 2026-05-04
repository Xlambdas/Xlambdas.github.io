import { type SimNode } from "./simulation";

declare global {
    interface Window {
        __graphZoom?: (factor: number) => void;
        __graphReset?: () => void;
        __graphFocus?: (nodeId: string) => void;
    }
}

export function registerGraphControls(
    stateRef: React.MutableRefObject<{ tx: number; ty: number; scale: number }>,
    nodesRef: React.MutableRefObject<SimNode[]>
) {
    window.__graphZoom = (factor) => {
        stateRef.current.scale = Math.max(0.15, Math.min(6, stateRef.current.scale * factor));
    };
    window.__graphReset = () => {
        stateRef.current = { tx: 0, ty: 0, scale: 1 };
    };
    window.__graphFocus = (nodeId) => {
        const n = nodesRef.current.find(nd => nd.id === nodeId);
        if (n) {
            stateRef.current.tx = -n.x * stateRef.current.scale;
            stateRef.current.ty = -n.y * stateRef.current.scale;
        }
    };

    return () => {
        delete window.__graphZoom;
        delete window.__graphReset;
        delete window.__graphFocus;
    };
}