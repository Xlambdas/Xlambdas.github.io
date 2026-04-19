// src/components/common/Carousel/Carousel.tsx
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../context/themeContext';
import { type CarouselProps } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const updateScrollButtons = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + offsetWidth < scrollWidth - 1);
    };

    const scrollLeft = () => {
        if (!scrollRef.current) return;
        setIsScrolling(true);
        const cardWidth = scrollRef.current.children[0].clientWidth + 32; // gap-8
        scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
        setTimeout(() => setIsScrolling(false), 500); // Adjust the timeout duration as needed
    };

    const scrollRight = () => {
        if (!scrollRef.current) return;
        setIsScrolling(true);
        const cardWidth = scrollRef.current.children[0].clientWidth + 32;
        scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        setTimeout(() => setIsScrolling(false), 500); // Adjust the timeout duration as needed
    };

    useEffect(() => {
        updateScrollButtons();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", updateScrollButtons);
        return () => el.removeEventListener("scroll", updateScrollButtons);
    }, []);

    return (
        <div className="relative h-full">
            {canScrollLeft && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-0.5 top-1/2 -translate-y-1/2 z-40 text-3xl transition hover:opacity-70"
                    style={{
                        color: theme.colors.primary,
                        backdropFilter: 'blur(2px)',
                        backgroundColor: 'rgba(11, 14, 22, 0.5)',
                        borderRadius: '0 20px 20px 0',
                        opacity: isScrolling ? 0 : 1,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: isScrolling ? 'none' : 'auto',
                    }}
                >
                    <ChevronLeft className="w-8 h-10 transition hover:scale-90" />
                </button>
            )}

            <div
                ref={scrollRef}
                className="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth gap-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>

            {canScrollRight && (
                <button
                    onClick={scrollRight}
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 z-40 transition hover:opacity-90"
                    style={{
                        color: theme.colors.primary,
                        backdropFilter: 'blur(2px)',
                        backgroundColor: 'rgba(11, 14, 22, 0.5)',
                        borderRadius: '20px 0 0 20px',
                        opacity: isScrolling ? 0 : 1,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: isScrolling ? 'none' : 'auto',
                    }}
                >
                    <ChevronRight className="w-8 h-10 transition hover:scale-90" />
                </button>
            )}
        </div>
    );
};