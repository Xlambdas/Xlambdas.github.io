import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SkillsProps, SkillCategory } from '../constants';

export const Skills: React.FC<SkillsProps> = ({ t }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
        new Set([0]) // Expand first category by default
    );

    // Transform translation data into component format
    const skillCategories: SkillCategory[] = Object.entries(t.skills.categories).map(
        ([key, category]) => ({
            key,
            title: category.title,
            description: category.description,
            subcategories: Object.entries(category.subcategories).map(
                ([, subData]) => ({
                    name: subData.name,
                    skills: subData.skills,
                })
            ),
        })
    );

    const toggleCategory = (index: number) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <section
            className="min-h-screen py-10 sm:py-16 lg:py-20 px-3 sm:px-6 flex items-center"
            role="region"
            aria-label={t.skills.ariaLabel}
        >
            <div className="max-w-4xl mx-auto w-full min-w-0">
                {/* Section Title */}
                <h2
                    className="text-3xl sm:text-5xl lg:text-6xl font-light italic mb-4 sm:mb-8"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                    }}
                >
                    {t.skills.title}
                </h2>

                {/* Section Description */}
                <p
                    className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 lg:mb-16 opacity-80"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-secondary)',
                    }}
                >
                    {t.skills.description}
                </p>

                {/* Skills Categories */}
                <div className="space-y-2 sm:space-y-4 lg:space-y-6">
                    {skillCategories.map((category, categoryIndex) => {
                        const isExpanded = expandedCategories.has(categoryIndex);

                        return (
                            <div
                                key={category.key}
                                className="border border-current rounded transition-all duration-200"
                                style={{
                                    borderColor: 'var(--color-primary-transparent)',
                                }}
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(categoryIndex)}
                                    className="w-full px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-2 sm:gap-4 hover:opacity-80 transition-opacity"
                                    style={{
                                        color: 'var(--color-primary)',
                                        fontFamily: 'var(--font-secondary)',
                                    }}
                                    aria-expanded={isExpanded}
                                >
                                    <div className="flex-1 text-left min-w-0">
                                        <h3 className="text-base sm:text-lg lg:text-xl font-light mb-0.5 sm:mb-2">
                                            {category.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm opacity-60 hidden sm:block">
                                            {category.description}
                                        </p>
                                    </div>

                                    <div
                                        className="shrink-0 transition-transform duration-200"
                                        style={{
                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    >
                                        <ChevronDown size={16} className="sm:w-5 sm:h-5" />
                                    </div>
                                </button>

                                {/* Category Content */}
                                {isExpanded && (
                                    <div
                                        className="border-t px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-6"
                                        style={{
                                            borderColor: 'var(--color-primary-transparent)',
                                        }}
                                    >
                                        {category.subcategories.map((subcategory, subIndex) => (
                                            <div key={subIndex}>
                                                <h4
                                                    className="text-sm sm:text-base lg:text-base font-light mb-2 sm:mb-3 opacity-70"
                                                    style={{
                                                        color: 'var(--color-primary)',
                                                        fontFamily: 'var(--font-secondary)',
                                                    }}
                                                >
                                                    {subcategory.name}
                                                </h4>

                                                {/* Skills Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-3">
                                                    {subcategory.skills.map((skill, skillIndex) => (
                                                        <div
                                                            key={skillIndex}
                                                            className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border rounded text-xs sm:text-sm font-light transition-all duration-200 hover:opacity-100 truncate"
                                                            style={{
                                                                color: 'var(--color-primary)',
                                                                fontFamily: 'var(--font-secondary)',
                                                                borderColor: 'var(--color-primary-transparent)',
                                                                opacity: 0.85,
                                                            }}
                                                        >
                                                            {skill}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Additional Note */}
                <p
                    className="text-xs sm:text-sm mt-8 sm:mt-12 lg:mt-16 opacity-60"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-secondary)',
                    }}
                >
                    {t.skills.finalNote}
                </p>
            </div>
        </section>
    );
};