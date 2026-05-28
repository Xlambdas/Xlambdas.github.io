// import { active } from 'd3';
import { Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackModal } from './modals';
import { FeedbackButton } from '../components';

type TabType = 'overview' | 'philosophy' | 'coming-soon' | 'for-teachers' | 'origine';

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
    origine: [
        { id: 'who-am-i', title: 'Qui suis-je ?' },
        { id: 'why-this-project', title: 'Pourquoi ce projet' },
        { id: 'how-its-built', title: 'Comment c\'est construit' },
        { id: 'what-i-believe', title: 'Ce que je crois' },
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
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const currentSections = sections[
        activeTab === 'coming-soon' ? 'coming_soon' :
            activeTab === 'for-teachers' ? 'for_teachers' :
                activeTab === 'origine' ? 'origine' :
                    activeTab
    ];


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
                                Un espace d'apprentissage interactif pour comprendre comment fonctionne réellement le cerveau en expérimentant directement ces principes dans l'interface. Les modules ne sont pas isolés : ils forment un graphe de connaissances où chaque concept s'appuie sur les précédents. Ce ne sont pas simplement des leçons qui s'enchaînent, mais une manière d'évoluer progressivement dans la complexité de ces concepts.
                            </p>
                        </section>

                        <section id="the-demo">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Cette démo
                            </h2>
                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Ce prototype fonctionne actuellement avec les données du navigateur (localStorage), autrement dit grâce aux cookies, afin de proposer une première expérience complète permettant de tester l'interface et les mécaniques d'apprentissage.
                            </p>
                            <div className="bg-[rgba(165,180,252,0.05)] border border-[#a5b4fc22] rounded-lg p-4">
                                <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Important :</strong> Les données sont réinitialisées lorsque le cache est vidé. Il s'agit d'un prototype conçu pour tester l'expérience utilisateur, et non d'une solution de production.
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
                                        Tester la démo auprès de différents profils d'utilisateurs. Recueillir les retours des étudiants et des enseignants. Valider que l'approche fonctionne réellement afin d'obtenir des sponsors et de réunir une équipe d'enseignants.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Moyen terme
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Développer une version complète avec de véritables comptes utilisateurs. Collaborer avec des enseignants afin de créer le meilleur contenu possible. Lancer une bêta privée.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Long terme
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Développer des applications mobiles iOS et Android. Étendre le projet à d'autres domaines. Construire une communauté d'apprentissage basée sur les retours des utilisateurs.
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
                                Une approche fondée sur la science
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                L’apprentissage n’est pas laissé au hasard : il est conçu à partir des principes connus de la cognition humaine. Ici, la science ne décrit pas seulement le contenu — elle guide la manière dont vous progressez.
                            </p>

                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Répétition espacée :</strong> Réviser au bon moment pour renforcer durablement la mémoire, juste avant l’oubli.
                                </li>

                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Graphe de connaissances :</strong> Apprendre en reliant les concepts entre eux, comme un réseau vivant qui structure la compréhension.
                                </li>

                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Entrelacement :</strong> Varier les types d’exercices pour développer une compréhension plus profonde et plus flexible.
                                </li>
                            </ul>
                        </section>

                        <section id="accessible">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Accessible à tous
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                La psychologie cognitive est souvent confinée aux milieux académiques. Pourtant, ses idées sont simples, surprenantes et profondément intuitives. Ce projet les rend accessibles à tous, sans prérequis et sans barrière financière.
                            </p>
                        </section>

                        <section id="personalized">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Apprentissage personnalisé
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Chaque esprit apprend différemment. L’expérience doit s’adapter à l’utilisateur, et non l’inverse.
                            </p>

                            <ul className="space-y-3 text-[#8b949e]">
                                {/* <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Sessions adaptatives :</strong> Le contenu s’ajuste à ton énergie, ton temps disponible et ton niveau de maîtrise.
                                </li> */}

                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Rythme libre :</strong> Tu avances à ton propre rythme, sans pression ni contrainte artificielle.
                                </li>
                            </ul>
                        </section>

                        <section id="playful">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Apprentissage narratif
                            </h2>

                            {/* <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                L’humain retient mieux ce qui a du sens et une histoire. L’apprentissage devient plus naturel lorsqu’il est incarné.
                            </p> */}

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                Chaque concept est relié à son origine : les chercheurs, les expériences et les idées qui les ont fait émerger. Miller et la mémoire de travail (7±2), Kahneman et les biais cognitifs, Ebbinghaus et l’oubli. Derrière chaque notion, il y a une histoire qui la rend vivante et mémorable.
                            </p>
                        </section>
                    </div>
                );

            case 'coming-soon':
                return (
                    <div className="space-y-16">
                        <section id="accounts">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4 flex items-center gap-3">
                                Comptes utilisateur réels
                                <span className="text-xs font-normal text-[#6e7681] border border-[#30363d] rounded-full px-2 py-0.5 whitespace-nowrap">
                                    Prévu Oct. 26
                                </span>
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                La version complète repose sur une véritable base de données. Tes progrès sont sauvegardés automatiquement, accessibles depuis n’importe quel appareil, avec des données privées et sécurisées.
                            </p>
                        </section>

                        <section id="social">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4 flex items-center gap-3">
                                Apprentissage social
                                <span className="text-xs font-normal text-[#6e7681] border border-[#30363d] rounded-full px-2 py-0.5 whitespace-nowrap">
                                    Prévu déc. 26
                                </span>
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Apprendre devient plus puissant lorsqu’il est partagé.
                            </p>

                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Classement entre amis :</strong> Compare tes progrès avec tes amis ou ta classe, de manière volontaire.
                                </li>

                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Apprentissage par les pairs :</strong> Ceux qui maîtrisent un concept peuvent l’expliquer et le transmettre aux autres.
                                </li>

                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Groupes d’étude :</strong> Collabore avec d’autres apprenants pour progresser ensemble.
                                </li>
                            </ul>
                        </section>

                        <section id="stories">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4 flex items-center gap-3">
                                Histoires & expériences
                                <span className="text-xs font-normal text-[#6e7681] border border-[#30363d] rounded-full px-2 py-0.5 whitespace-nowrap">
                                    Prévu Jan. 27
                                </span>
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Au-delà des concepts, découvre les histoires derrière les découvertes scientifiques : comment les chercheurs ont pensé, expérimenté et construit leurs idées.
                            </p>

                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Expériences interactives :</strong> Rejoue les expériences fondatrices pour comprendre concrètement les découvertes.
                                </li>

                                <li className="text-sm md:text-base leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Parcours de chercheurs :</strong> Découvre les parcours et les idées des scientifiques qui ont façonné le domaine.
                                </li>
                            </ul>
                        </section>

                        <section id="mobile">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4 flex items-center gap-3">
                                Applications mobiles
                                <span className="text-xs font-normal text-[#6e7681] border border-[#30363d] rounded-full px-2 py-0.5 whitespace-nowrap">
                                    Prévu Juin 27
                                </span>
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                iOS et Android. Un apprentissage accessible partout, à tout moment, dans une expérience mobile optimisée.
                            </p>
                        </section>

                        <section id="animations">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4 flex items-center gap-3">
                                Animations & feedback
                                <span className="text-xs font-normal text-[#6e7681] border border-[#30363d] rounded-full px-2 py-0.5 whitespace-nowrap">
                                    Prévu déc. 27
                                </span>
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                Chaque réussite est valorisée. Des animations fluides et un feedback immédiat renforcent la sensation de progression. Chaque interaction devient une étape visible dans ton apprentissage.
                            </p>
                        </section>

                        <section id="domains">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4 flex items-center gap-3">
                                Ouverture vers d’autres domaines
                                <span className="text-xs font-normal text-[#6e7681] border border-[#30363d] rounded-full px-2 py-0.5 whitespace-nowrap">
                                    Long terme
                                </span>
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Pour l’instant, le projet se concentre sur les sciences cognitives. Mais selon l’intérêt de la communauté, d’autres domaines pourraient être explorés :
                            </p>

                            <ul className="space-y-3 text-[#8b949e]">
                                <li className="text-sm md:text-base leading-relaxed">
                                    Sciences biologiques
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    Domaines médicaux
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    Compétences du quotidien basées sur la psychologie
                                </li>
                                <li className="text-sm md:text-base leading-relaxed">
                                    ...
                                </li>
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
                                Ce projet ne peut pas exister sans vous. Les enseignants comprennent comment les élèves apprennent réellement : quelles questions les font progresser, quels obstacles reviennent, et quand il faut être ludique ou rigoureux.
                            </p>

                            <div className="bg-[rgba(165,180,252,0.05)] border border-[#a5b4fc22] rounded-lg p-4">
                                <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                    Ensemble, nous pouvons construire une ressource d’apprentissage fondée sur les sciences cognitives : accessible, engageante et réellement efficace.
                                </p>
                            </div>
                        </section>

                        <section id="how-to-help">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-6">
                                Comment contribuer
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Tester la démo
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Utilisez-la avec vos élèves et observez leurs réactions. Qu’est-ce qui fonctionne bien ? Où rencontrent-ils des difficultés ?
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Créer du contenu
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Rédiger des leçons, des questions et des explications. Aider à structurer les concepts pour qu’ils s’enchaînent naturellement.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Partager votre expertise
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Apporter des expériences issues de la psychologie cognitive et les histoires derrière les découvertes. Comment les rendre plus vivantes et accessibles ?
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Orienter le projet
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Donner un retour sur les priorités, les améliorations et la direction générale. Votre regard est essentiel pour faire évoluer le projet.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="contact">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Contact
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-6">
                                Intéressé pour collaborer ou simplement en savoir plus sur le projet ?
                            </p>

                            <button
                                className="px-6 py-3 bg-linear-to-br from-[#a5b4fc22] to-[#a5b4fc18] border border-[#a5b4fc55] rounded-lg text-[#a5b4fc] font-bold text-sm md:text-base transition-all hover:from-[#a5b4fc33] hover:to-[#a5b4fc22] hover:border-[#a5b4fc88]"
                                // onClick={() => {
                                //     alert("Formulaire de contact à venir. Pour l’instant, vous pouvez me contacter par email.");
                                // }}
                                onClick={() => window.location.href = 'mailto:contact@xls-studio.com'}
                            >
                                Me contacter
                            </button>
                        </section>
                    </div>
                );

            case 'origine':
                return (
                    <div className="space-y-16">
                        <section id="who-am-i">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Qui suis-je ?
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Je m'appelle Corentin, étudiant en licence MIASHS à Bordeaux — un cursus à l’intersection des mathématiques, de l’informatique, de l’économie et des sciences humaines. Cette combinaison m’a naturellement conduit vers une question centrale : comprendre les systèmes complexes, qu’ils soient humains ou techniques.
                            </p>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                En 2026, j’ai effectué un stage de cinq mois en Croatie dans un studio de développement de jeux vidéo. Cette expérience m’a appris à concevoir des interfaces qui engagent réellement les utilisateurs — pas seulement des interfaces qui fonctionnent.
                            </p>
                        </section>

                        <section id="why-this-project">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Pourquoi ce projet
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Tout est parti d’une frustration simple : les sciences cognitives sont passionnantes, mais restent largement inaccessibles. Les ressources existent — manuels, articles, cours en ligne — mais elles informent plus qu’elles ne font réellement apprendre. Et informer n’est pas apprendre.
                            </p>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                Les principes comme la répétition espacée, le graphe de connaissances ou l’entrelacement sont connus depuis longtemps. Pourtant, très peu de plateformes les intègrent réellement dans leur structure d’apprentissage. J’ai voulu construire un système qui le fasse vraiment.
                            </p>

                            <div className="bg-[rgba(165,180,252,0.05)] border border-[#a5b4fc22] rounded-lg p-4">
                                <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                    <strong className="text-[#c9d1d9]">Idée centrale :</strong> apprendre comment fonctionne le cerveau, à travers une interface qui s’inspire de son fonctionnement.
                                </p>
                            </div>
                        </section>

                        <section id="how-its-built">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Construction du projet
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-6">
                                Ce projet est entièrement réalisé en solo — de la conception à l’implémentation. Chaque décision de design, chaque ligne de code et chaque choix pédagogique ont été pensés et construits indépendamment.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Stack technique
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        React, TypeScript, Tailwind CSS, React Router. Les données sont stockées en <strong>localStorage</strong> pour ce prototype — une base de données réelle est prévue pour la version complète.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#c9d1d9] mb-2">
                                        Approche
                                    </h3>
                                    <p className="text-sm md:text-base text-[#8b949e] leading-relaxed">
                                        Construire d’abord la mécanique d’apprentissage avant le contenu. Valider que le système fonctionne réellement avant d’investir dans la production de contenu. C’est précisément ce que permet cette démo.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="what-i-believe">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a5b4fc] mb-4">
                                Ce que je crois
                            </h2>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed mb-4">
                                L’apprentissage est souvent confondu avec la mémorisation. On lit, on surligne, on relit — puis on oublie. Parce que le cerveau n’est pas une éponge, mais un réseau qui se renforce par les connexions, la récupération active et l’espacement.
                            </p>

                            <p className="text-base md:text-lg text-[#8b949e] leading-relaxed">
                                Je crois qu’une plateforme bien conçue peut changer cela. Pas en rendant l’apprentissage plus simple, mais en le rendant plus efficace, plus honnête sur ses exigences, et suffisamment engageant pour donner envie d’y revenir.
                            </p>
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
                                {activeTab === 'overview' && 'Aperçu'}
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
                        {(['overview', 'philosophy', 'coming-soon', 'for-teachers', 'origine'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setActiveSection(sections[tab === 'coming-soon' ? 'coming_soon' : tab === 'for-teachers' ? 'for_teachers' : tab === 'origine' ? 'origine' : tab][0].id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setSidebarOpen(false);
                                }}
                                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab
                                        ? 'bg-[#a5b4fc22] border border-[#a5b4fc55] text-[#a5b4fc]'
                                        : 'bg-transparent border border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
                                    }`}
                            >
                                {tab === 'overview' && 'Aperçu'}
                                {tab === 'philosophy' && 'Philosophie'}
                                {tab === 'coming-soon' && 'À venir'}
                                {tab === 'for-teachers' && 'Enseignants'}
                                {tab === 'origine' && 'À l\'origine'}
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
                                {(['overview', 'philosophy', 'coming-soon', 'for-teachers', 'origine'] as TabType[]).map((tab) => (
                                    <div key={tab}>
                                        {/* Tab Header */}
                                        <button
                                            onClick={() => {
                                                const tabKey = tab === 'coming-soon' ? 'coming_soon' : tab === 'for-teachers' ? 'for_teachers' : tab === 'origine' ? 'origine' : tab;
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
                                            {tab === 'overview' && 'Aperçu'}
                                            {tab === 'philosophy' && 'Philosophie'}
                                            {tab === 'coming-soon' && 'À venir'}
                                            {tab === 'for-teachers' && 'Enseignants'}
                                            {tab === 'origine' && 'À l\'origine'}
                                        </button>

                                        {/* Subsections */}
                                        <div className="flex flex-col gap-1 pl-2 border-l border-[#30363d]">
                                            {sections[tab === 'coming-soon' ? 'coming_soon' : tab === 'for-teachers' ? 'for_teachers' : tab === 'origine' ? 'origine' : tab].map((section) => (
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
                                <li>
                                    <button onClick={() => { setActiveTab('origine'); setActiveSection('who-am-i'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs text-[#8b949e] hover:text-[#a5b4fc] transition-colors">
                                        À l'origine
                                    </button>
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

            {/* Feedback System */}
            <FeedbackButton onClick={() => setFeedbackOpen(true)} />

            {feedbackOpen && (
                <FeedbackModal onClose={() => setFeedbackOpen(false)} from="ProfilePage" />
            )}
        </div>
    );
};
