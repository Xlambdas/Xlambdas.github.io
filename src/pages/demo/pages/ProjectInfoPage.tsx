// import { active } from 'd3';
import { Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TabType = 'overview' | 'philosophy' | 'coming-soon' | 'for-teachers';

const sections = {
    overview: [
        { id: 'what-is-it', title: 'C\'est quoi ?' },
        { id: 'the-demo', title: 'Cette démo' },
        { id: 'goals', title: 'Objectifs' },
    ],
    philosophy: [
        { id: 'science-based', title: 'Basé sur la science' },
        { id: 'accessible', title: 'Accessible à tous' },
        { id: 'personalized', title: 'Personnalisé' },
        { id: 'playful', title: 'Ludique & Narratif' },
    ],
    coming_soon: [
        { id: 'accounts', title: 'Comptes utilisateur réels' },
        { id: 'animations', title: 'Animations & Feedback' },
        { id: 'social', title: 'Apprentissage social' },
        { id: 'stories', title: 'Stories & Expériences' },
        { id: 'mobile', title: 'Applications mobiles' },
        { id: 'domains', title: 'Autres domaines' },
    ],
    for_teachers: [
        { id: 'why-collaborate', title: 'Pourquoi collaborer ?' },
        { id: 'how-to-help', title: 'Comment m\'aider' },
        { id: 'contact', title: 'Contact' },
    ],
};

const BrainIcon = "/brain_light.svg";

const KnowledgeGraphVisualization = () => {
    return (
        <svg width="100%" height="300" viewBox="0 0 600 300" className="max-w-full">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Neural connections */}
            <line x1="150" y1="100" x2="300" y2="150" stroke="#a5b4fc" strokeWidth="2" opacity="0.3" />
            <line x1="300" y1="150" x2="450" y2="100" stroke="#a5b4fc" strokeWidth="2" opacity="0.3" />
            <line x1="300" y1="150" x2="300" y2="250" stroke="#a5b4fc" strokeWidth="2" opacity="0.3" />
            <line x1="150" y1="100" x2="450" y2="100" stroke="#a5b4fc" strokeWidth="2" opacity="0.3" />
            <line x1="150" y1="100" x2="300" y2="250" stroke="#a5b4fc" strokeWidth="2" opacity="0.3" />
            <line x1="450" y1="100" x2="300" y2="250" stroke="#a5b4fc" strokeWidth="2" opacity="0.3" />

            {/* Center - Brain Icon */}
            <g transform="translate(300, 150)">
                <circle cx="0" cy="0" r="25" fill="#a5b4fc" filter="url(#glow)" opacity="0.95" />
                <image
                    href={BrainIcon}
                    x="-16"
                    y="-16"
                    width="32"
                    height="32"
                    preserveAspectRatio="xMidYMid meet"
                />
            </g>

            {/* Top Left Node - Topic Icon */}
            <circle cx="150" cy="100" r="15" fill="#a5b4fc" opacity="0.6" />
            <g transform="translate(150, 100)">
                <g transform="scale(0.55)">
                    <path d="M-11 -11h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3h-7z" stroke="#0b0f14" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 -11h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#0b0f14" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>

            {/* Top Right Node - Concept Icon */}
            <circle cx="450" cy="100" r="15" fill="#a5b4fc" opacity="0.6" />
            <g transform="translate(450, 100)">
                <g transform="scale(0.55)">
                    <path d="M0 -11l3.09 6.26L11 -2.73l-5 4.87 1.18 6.88L0 5.77l-6.18 3.25L-4 1.14 -9 -3.73l6.91-1.01L0 -11z" stroke="#0b0f14" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>

            {/* Bottom Node - Folder Icon */}
            <circle cx="300" cy="250" r="15" fill="#a5b4fc" opacity="0.6" />
            <g transform="translate(300, 250)">
                <g transform="scale(0.55)">
                    <path d="M11 8a2 2 0 0 1-2 2H-11a2 2 0 0 1-2-2V-8a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="#0b0f14" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>

            {/* Side nodes - Small circles */}
            <circle cx="80" cy="150" r="12" fill="#a5b4fc" opacity="0.4" />
            <circle cx="520" cy="150" r="12" fill="#a5b4fc" opacity="0.4" />
            <circle cx="300" cy="50" r="12" fill="#a5b4fc" opacity="0.4" />
        </svg>
    );
};


export const ProjectInfoPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [activeSection, setActiveSection] = useState('what-is-it');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentSections = sections[activeTab === 'coming-soon' ? 'coming_soon' : activeTab === 'for-teachers' ? 'for_teachers' : activeTab];


    useEffect(() => {
        const handleScroll = () => {
            const offset = 320;

            for (const section of currentSections) {
                const el = document.getElementById(section.id);
                if (!el) continue;

                const top = el.getBoundingClientRect().top;
                if (top <= offset + 10) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentSections]);

    const handleSectionClick = (id: string) => {
        setActiveSection(id);
        setSidebarOpen(false);
        const element = document.getElementById(id);
        if (!element) return;

        const isMobile = window.innerWidth < 768;
        const headerOffset = isMobile ? 90 : 150;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-16">
                        <section id="what-is-it">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                C'est quoi ?
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                Un espace d'apprentissage interactif pour apprendre comment fonctionne vraiment le cerveau en expérimentant directement ces principes dans l'interface. Les modules ne sont pas isolés — ils forment un graphe de connaissances où chaque concept est construit sur les précédents. Ce ne sont pas simplement des lecons qui se suivent mais un moyen d´évoluer dans la complexité de l´ensemble de ces concepts petit a petit.
                            </p>
                        </section>

                        <section id="the-demo">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Cette démo
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Ce prototype fonctionne actuellement avec les données du navigateur (localStorage) - en d´autres termes ceci fonctionne grace aux cookies - dans l´objectif d´obtenir une première expérience complète permettant de tester l'interface et les mécaniques d'apprentissage.
                            </p>
                            <div className="bg-[rgba(165,180,252,0.05)] border border-[#a5b4fc22] rounded-lg p-4">
                                <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Important :</strong> Les données se réinitialisent en vidant le cache. C'est un prototype pour tester l'UX, pas une solution production.
                                </p>
                            </div>
                        </section>

                        <section id="goals">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-6">
                                Mes objectifs
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Court terme (prochaines semaines)
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Tester la démo avec différents types d´utilisateurs. Recueillir les retours des étudiants et des enseignants. Valider que l'approche fonctionne réellement, pour pouvoir obtenir des sponsors et réunir une éauipe de professeurs. 
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Moyen terme
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Développer la version complète avec comptes utilisateurs réels. Collaborer avec les enseignants pour créer le meilleur contenu possible. Lancer une beta privée.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Long terme
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Applications mobiles iOS/Android. Expansion à d'autres domaines. Communauté d'apprentissage basée sur les retours.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                );

            case 'philosophy':
                return (
                    <div className="space-y-16">
                        <section id="science-based">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Basé sur la science
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Les principes cognitifs ne sont pas juste le sujet — ils structurent l'apprentissage lui-même.
                            </p>
                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Répétition espacée :</strong> Les révisions sont plannifiées selon l'intervalle d'oubli optimal
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Graphe de connaissances :</strong> Les connexions entre concepts renforcent la compréhension
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Entrelacement :</strong> Les sessions mélangent différents types d'apprentissage pour éviter la mémorisation superficielle
                                </li>
                            </ul>
                        </section>

                        <section id="accessible">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Accessible à tous
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                La psychologie cognitive est fascinante, mais elle reste souvent enfermée dans les universités. Il y a des faits amusants, des découvertes surprenantes, des expériences ludiques — avant les détails académiques. Ce projet les rend accessibles à tous, gratuitement.
                            </p>
                        </section>

                        <section id="personalized">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Personnalisé
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Nous sommes tous différents. L'apprentissage devrait l'être aussi.
                            </p>
                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Sessions adaptées :</strong> Ton humeur et ton temps disponible changent la longueur et la difficulté
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Ton rythme :</strong> Explore au rythme que tu veux. Pas de deadline, pas de pression
                                </li>
                            </ul>
                        </section>

                        <section id="playful">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Ludique & Narratif
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Pourquoi arrêtons-nous de jouer en grandissant ? L'apprentissage peut être fun.
                            </p>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                Les histoires rendent l'apprentissage mémorable. Au lieu d'abstractions sèches, tu découvres comment les chercheurs ont trouvé chaque concept. George Miller et la limite 7±2 de la mémoire. Les expériences de Kahneman. Les découvertes d'Ebbinghaus. Des gens, des histoires, des enjeux.
                            </p>
                        </section>
                    </div>
                );

            case 'coming-soon':
                return (
                    <div className="space-y-16">
                        <section id="accounts">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Comptes utilisateur réels
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                La version complète utilise une vraie base de données. Tes progrès sont sauvegardés. Tu peux accéder depuis n'importe quel appareil. Données sécurisées et privées.
                            </p>
                        </section>

                        <section id="animations">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Animations & Feedback
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                Une réponse correcte mérite une célébration. Des animations fluides qui renforcent le feedback positif. Chaque interaction raconte une histoire de progression.
                            </p>
                        </section>

                        <section id="social">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Apprentissage social
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                L'apprentissage est meilleur quand tu le partages.
                            </p>
                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Leaderboard avec amis :</strong> Voir les progrès de ta classe ou de tes amis (volontairement)
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Enseignement par les pairs :</strong> Ceux qui ont complété une leçon peuvent expliquer leurs découvertes aux autres
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Groupes d'étude :</strong> Collaborer avec d'autres apprenants
                                </li>
                            </ul>
                        </section>

                        <section id="stories">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Stories & Expériences
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Au-delà des leçons, plonge dans les histoires de découvertes scientifiques. Comprendre comment les chercheurs ont pensé, expérimenté, découvert.
                            </p>
                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Expériences interactives :</strong> Rejoue les expériences classiques pour comprendre les découvertes
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Biographies de chercheurs :</strong> Découvre les histoires fascinantes des neuroscientifiques qui ont changé le domaine
                                </li>
                            </ul>
                        </section>

                        <section id="mobile">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Applications mobiles
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                iOS et Android. L'apprentissage partout, n'importe quand. Applications natives optimisées pour le mobile.
                            </p>
                        </section>

                        <section id="domains">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Autres domaines
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Pour l'instant, je me concentre sur la psychologie cognitive. Mais si la communauté est intéressée, je pourrais explorer :
                            </p>
                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">Sciences biologiques</li>
                                <li className="text-sm md:text-base leading-relaxed">Neurosciences</li>
                                <li className="text-sm md:text-base leading-relaxed">Domaines médicaux</li>
                                <li className="text-sm md:text-base leading-relaxed">Compétences de vie quotidienne basées sur la psychologie</li>
                            </ul>
                        </section>
                    </div>
                );

            case 'for-teachers':
                return (
                    <div className="space-y-16">
                        <section id="why-collaborate">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Pourquoi collaborer ?
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Ce projet a besoin de vous. Les enseignants comprennent comment les élèves apprennent réellement. Vous savez quelles questions poser, quels pièges éviter, quand être ludique et quand être rigoureux.
                            </p>
                            <div className="bg-[rgba(165,180,252,0.05)] border border-[#a5b4fc22] rounded-lg p-4">
                                <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                    Ensemble, nous pouvons créer la meilleure ressource d'apprentissage basée sur les sciences cognitives. Accessible, ludique, efficace.
                                </p>
                            </div>
                        </section>

                        <section id="how-to-help">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-6">
                                Comment m'aider
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Tester la démo
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Utilisez-la avec vos élèves. Quel est leur retour ? Qu'est-ce qui marche ? Qu'est-ce qui manque ?
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Créer du contenu
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Écrire des leçons, des questions, des explications. Aider à structurer le contenu pour que les concepts s'enchaînent logiquement.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Partager vos histoires
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Les expériences classiques de la psychologie cognitive. Les chercheurs qui les ont découvertes. Comment les enseigner de façon ludique ?
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Me conseiller
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Sur les priorités, les améliorations, la direction à prendre. Votre expertise est inestimable.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="contact">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Contact
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-6">
                                Intéressé pour collaborer ? Avez-vous des questions sur le projet ?
                            </p>
                            <button
                                className="px-6 py-3 bg-linear-to-br from-[#a5b4fc22] to-[#a5b4fc18] border border-[#a5b4fc55] rounded-lg text-[#a5b4fc] font-bold text-sm md:text-base transition-all hover:from-[#a5b4fc33] hover:to-[#a5b4fc22] hover:border-[#a5b4fc88]"
                                onClick={() => {
                                    alert('Formulaire de contact à venir. Pour l\'instant, contactez-moi via email.');
                                }}
                            >
                                Contactez-moi
                            </button>
                        </section>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0f14]">
            {/* Header */}
            <header className="sticky top-0 z-100 border-b border-[#21262d] bg-[#161b22]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
                    <div className="flex items-center justify-between mb-0 md:mb-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-transparent border border-[#30363d] rounded-lg text-[#8b949e] text-xs md:text-sm font-semibold hover:border-[#8b949e] hover:text-[#c9d1d9] transition-all flex items-center gap-2"
                        >
                            ← Retour
                        </button>

                        <h1 className="text-xl md:text-2xl font-bold text-[#c9d1d9]">
                            <span className="md:hidden">
                                {activeTab === 'overview' && 'Overview'}
                                {activeTab === 'philosophy' && 'Philosophie'}
                                {activeTab === 'coming-soon' && 'À venir'}
                                {activeTab === 'for-teachers' && 'Enseignants'}
                            </span>
                            <span className="hidden md:inline">
                                À propos du projet
                            </span>
                        </h1>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden px-4 py-2 bg-transparent border border-[#30363d] rounded-lg text-[#8b949e]"
                        >
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div className="hidden md:block w-40" />
                    </div>

                    {/* Tab Navigation */}
                    <div className="hidden md:flex gap-2 overflow-x-auto border-t border-[#21262d] pt-4 -mx-2 px-2 sm:px-6 md:px-0 md:mx-0 justify-center">
                        {(['overview', 'philosophy', 'coming-soon', 'for-teachers'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setActiveSection(sections[tab === 'coming-soon' ? 'coming_soon' : tab === 'for-teachers' ? 'for_teachers' : tab][0].id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setSidebarOpen(false);
                                }}
                                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab
                                        ? 'bg-[#a5b4fc22] border border-[#a5b4fc55] text-[#a5b4fc]'
                                        : 'bg-transparent border border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
                                    }`}
                            >
                                {tab === 'overview' && 'Overview'}
                                {tab === 'philosophy' && 'Philosophie'}
                                {tab === 'coming-soon' && 'À venir'}
                                {tab === 'for-teachers' && 'Enseignants'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-linear-to-br from-[#a5b4fc08] to-transparent border-b border-[#21262d] px-4 sm:px-6 md:px-8 py-12 md:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c9d1d9] mb-4 leading-tight">
                                Un nouvel espace pour apprendre
                            </h2>
                            <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                Basé sur les sciences cognitives. Accessible à tous. Ludique et personnalisé pour explorez comment fonctionne vraiment votre cerveau.
                            </p>
                        </div>
                        <KnowledgeGraphVisualization />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Sidebar Navigation - Mobile */}
                    {sidebarOpen && (
                        <aside className="md:hidden fixed inset-0 top-17  z-40 bg-[#0b0f14] border-t border-[#21262d] overflow-y-auto">
                            <nav className="flex flex-col gap-4 p-4">
                                {(['overview', 'philosophy', 'coming-soon', 'for-teachers'] as TabType[]).map((tab) => (
                                    <div key={tab}>
                                        {/* Tab Header */}
                                        <button
                                            onClick={() => {
                                                const tabKey = tab === 'coming-soon' ? 'coming_soon' : tab === 'for-teachers' ? 'for_teachers' : tab;
                                                const firstSection = sections[tabKey][0];
                                                setActiveTab(tab);
                                                setActiveSection(firstSection.id);
                                                setSidebarOpen(false);
                                                setTimeout(() => handleSectionClick(firstSection.id), 50);
                                            }}
                                            className={`w-full px-3 py-2 rounded-md text-left text-sm font-semibold transition-all mb-2 ${activeTab === tab
                                                    ? 'bg-[#a5b4fc22] border border-[#a5b4fc55] text-[#a5b4fc]'
                                                    : 'bg-transparent border border-transparent text-[#c9d1d9] hover:text-[#a5b4fc]'
                                                }`}
                                        >
                                            {tab === 'overview' && 'Overview'}
                                            {tab === 'philosophy' && 'Philosophie'}
                                            {tab === 'coming-soon' && 'À venir'}
                                            {tab === 'for-teachers' && 'Enseignants'}
                                        </button>

                                        {/* Subsections */}
                                        <div className="flex flex-col gap-1 pl-2 border-l border-[#30363d]">
                                            {sections[tab === 'coming-soon' ? 'coming_soon' : tab === 'for-teachers' ? 'for_teachers' : tab].map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => {
                                                        setActiveTab(tab);
                                                        setActiveSection(section.id);
                                                        setSidebarOpen(false);

                                                        setTimeout(() => handleSectionClick(section.id), 50); // wait for tab content to render
                                                    }}
                                                    className={`px-3 py-2 rounded-md text-left text-xs font-medium transition-all ${activeSection === section.id
                                                            ? 'bg-[#a5b4fc15] border border-[#a5b4fc33] text-[#a5b4fc]'
                                                            : 'bg-transparent border border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
                                                        }`}
                                                >
                                                    {section.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </aside>
                    )}

                    {/* Sidebar Navigation - Desktop */}
                    <aside className="hidden md:block sticky top-38 h-fit">
                        <nav className="flex flex-col gap-2">
                            {currentSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section.id)}
                                    className={`px-3 py-2 rounded-md text-left text-sm font-medium transition-all ${activeSection === section.id
                                            ? 'bg-[#a5b4fc15] border border-[#a5b4fc33] text-[#a5b4fc]'
                                            : 'bg-transparent border border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#a5b4fc08]'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-3">
                        {renderContent()}
                    </main>
                </div>
            </div>

            {/* Footer CTA */}
            <section className="bg-linear-to-br from-[#a5b4fc08] to-transparent border-t border-[#21262d] px-4 sm:px-6 md:px-8 py-12 md:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-linear-to-br from-[#a5b4fc08] to-[#a5b4fc04] border border-[#a5b4fc22] rounded-xl p-6 md:p-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#c9d1d9] mb-4">
                            Prêt à explorer ?
                        </h2>
                        <p className="text-sm md:text-base text-[#8b949e] mb-6 leading-relaxed">
                            Cette démo est un prototype. Testez-la, donnez votre avis. Si vous êtes enseignant et voulez collaborer, contactez-moi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/demoHome')}
                                className="px-6 py-3 bg-linear-to-br from-[#a5b4fc22] to-[#a5b4fc18] border border-[#a5b4fc55] rounded-lg text-[#a5b4fc] text-sm md:text-base font-bold transition-all hover:from-[#a5b4fc33] hover:to-[#a5b4fc22] hover:border-[#a5b4fc88]"
                            >
                                Retour à la démo
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('for-teachers');
                                    setActiveSection('why-collaborate');
                                    window.scrollTo(0, 0);
                                }}
                                className="px-6 py-3 bg-transparent border border-[#30363d] rounded-lg text-[#8b949e] text-sm md:text-base font-bold transition-all hover:border-[#8b949e] hover:text-[#c9d1d9]"
                            >
                                Pour les enseignants
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#161b22] border-t border-[#21262d] px-4 sm:px-6 md:px-8 py-6 md:py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-x-[10%] gap-y-6 mb-4 md:mb-8">
                        {/* About */}
                        <div className="w-32 md:w-40">
                            <h3 className="text-sm font-semibold text-[#c9d1d9] mb-4">À propos</h3>
                            <ul className="space-y-1 md:space-y-2">
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); setActiveSection('overview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Aperçu
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('philosophy'); setActiveSection('philosophy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Philosophie
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('coming-soon'); setActiveSection('coming-soon'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        À venir
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Collaboration */}
                        <div className="w-32 md:w-40">
                            <h3 className="text-sm font-semibold text-[#c9d1d9] mb-4">Collaboration</h3>
                            <ul className="space-y-1 md:space-y-2">
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('for-teachers'); setActiveSection('why-collaborate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Pourquoi collaborer
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('for-teachers'); setActiveSection('how-to-help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Comment m'aider
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('for-teachers'); setActiveSection('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>


                        {/* Connect */}
                        <div className="w-32 md:w-40">
                            <h3 className="text-sm font-semibold text-[#c9d1d9] mb-4">Rester connecté</h3>
                            <ul className="space-y-1 md:space-y-2">
                                <li>
                                    <a href="https://www.linkedin.com/in/corentin-gassien-1b7289261/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Linkedin
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/Xlambdas" target="_blank" rel="noopener noreferrer" className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:contact@xls-studio.com" className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        Email
                                    </a>
                                </li>
                            </ul>
                        </div>


                        {/* Legal */}
                        <div className="md:hidden w-32 md:w-40">
                            {/* <h3 className="text-sm font-semibold text-[#c9d1d9] mb-4">Légal</h3>
                        <ul className="space-y-1 md:space-y-2">
                            <li>
                                <a href="#" className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                    Conditions d'utilisation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                    Politique de confidentialité
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                    Mentions légales
                                </a>
                            </li>
                        </ul> */}
                        </div>
                    </div>


                    {/* Footer Bottom */}
                    <div className="border-t border-[#21262d] pt-4 md:pt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <a href="#" className="text-xs text-[#6e7681]">
                                © 2026 XLS.Studio - Cognitive Learning Platform. <br /> Tous droits réservés.
                            </a>
                            <p className="text-xs text-[#6e7681]">
                                Pour rendre l'apprentissage accessible a tous !
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
