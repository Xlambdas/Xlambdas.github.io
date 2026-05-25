const TUTORIAL_COMPLETED_KEY = 'tutorial_completed';

export const shouldShowTutorial = (): boolean => {
    return localStorage.getItem(TUTORIAL_COMPLETED_KEY) !== 'true';
};

export const markTutorialComplete = (): void => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
};

export const resetTutorial = (): void => {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
};