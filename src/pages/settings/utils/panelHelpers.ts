import type { ColorsPanelProps } from "../constants/types";
import { TAB_CONFIG, type TabItem } from "../constants";

export const createTabs = (t: any): TabItem[] => [
    { id: 'colors', label: t.colors, icon: TAB_CONFIG.colors, panel: 'colors-panel' },
    { id: 'typography', label: t.typography, icon: TAB_CONFIG.typography, panel: 'typography-panel' },
    { id: 'sizes', label: t.sizes, icon: TAB_CONFIG.sizes, panel: 'sizes-panel' },
    { id: 'language', label: t.language, icon: TAB_CONFIG.language, panel: 'language-panel' },
    { id: 'motion', label: t.motion, icon: TAB_CONFIG.motion, panel: 'motion-panel' },
];

export const getPresetNames = (t: ColorsPanelProps['t']) => ({
    'Purple Night': t.presetPurpleNight,
    'Ocean Blue': t.presetOceanBlue,
    'Sunset': t.presetSunset,
    'Forest Green': t.presetForestGreen,
    'Light Mode': t.presetLightMode,
});
