export { };

declare global {
    interface Window {
        __graphZoom?: (factor: number) => void;
        __graphReset?: () => void;
        __graphFocus?: (nodeId: string) => void;
        __graphSearch?: (query: string) => void;
        __graphStrengthen?: () => void;
        __openStrengthenModal?: () => void;
    }
}