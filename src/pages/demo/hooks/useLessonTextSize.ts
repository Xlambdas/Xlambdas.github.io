import { useState, useEffect } from 'react';

export const useLessonTextSize = () => {
    const [textScale, setTextScale] = useState(() => {
        const saved = localStorage.getItem("lesson_textScale");
        return saved ? parseFloat(saved) : 1.0;
    });

    const updateTextScale = (scale: number) => {
        const newScale = Math.max(0.6, Math.min(1.5, scale));
        setTextScale(newScale);
        localStorage.setItem("lesson_textScale", newScale.toString());

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('lessonTextScaleChange', {
            detail: { scale: newScale }
        }));
    };

    // Listen for changes from other components
    useEffect(() => {
        const handleChange = (e: Event) => {
            const customEvent = e as CustomEvent<{ scale: number }>;
            if (customEvent.detail?.scale !== undefined) {
                setTextScale(customEvent.detail.scale);
            }
        };

        window.addEventListener('lessonTextScaleChange', handleChange);
        return () => window.removeEventListener('lessonTextScaleChange', handleChange);
    }, []);

    return { textScale, updateTextScale };
};