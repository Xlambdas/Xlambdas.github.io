// Home/utils/dpr.ts
import { HOME_CONFIG } from '../../../constants/home.config.ts';

export const setDPRForDevice = (
    isTouchDevice: boolean,
    dprRef: React.MutableRefObject<number>
) => {
    const deviceDpr = window.devicePixelRatio || 1;

    if (isTouchDevice) {
        dprRef.current = HOME_CONFIG.mobileDpr;
    } else {
        const { highDpr, high, mediumDpr, medium, low } = HOME_CONFIG.desktopDprThresholds;
        if (deviceDpr > high) dprRef.current = highDpr;
        else if (deviceDpr > medium) dprRef.current = mediumDpr;
        else dprRef.current = low;
    }
};