// src/constants/home.config.ts

export const HOME_CONFIG = {
    maxSection: 2,
    scrollCooldown: 900,
    swipeThreshold: 50,
    mobileDpr: 0.8,
    desktopDprThresholds: {
        high: 2,
        highDpr: 1.2,
        medium: 1.5,
        mediumDpr: 1.1,
        low: 1,
    },
    loadingDelay: 200,
    animationDuration: 800,
    fpsWarningThreshold: 30,
    performanceCheckInterval: 1000,
    canvasOpacity: 0.6,
    deltaThreshold: 30,
} as const;