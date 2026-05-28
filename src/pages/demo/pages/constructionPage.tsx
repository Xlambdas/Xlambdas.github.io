import React from 'react';
import { useNavigate } from 'react-router-dom';

const constructionIcon = '/construction-stop-svgrepo-com.svg';

export const ConstructionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8">
                    <img
                        src={constructionIcon}
                        alt="En construction"
                        className="w-32 h-32 mx-auto"
                    />
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-bold text-[#c9d1d9] mb-4">
                    En construction
                </h1>

                <p className="text-lg text-[#8b949e] leading-relaxed mb-8">
                    Cette page est actuellement en cours de développement. Reviens bientôt pour découvrir les nouveautés !
                </p>

                {/* Return Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-[#a5b4fc22] to-[#a5b4fc18] border border-[#a5b4fc55] rounded-lg text-[#a5b4fc] font-bold text-sm md:text-base transition-all hover:from-[#a5b4fc33] hover:to-[#a5b4fc22] hover:border-[#a5b4fc88]"
                >
                    ← Retour
                </button>
            </div>
        </div>
    );
};