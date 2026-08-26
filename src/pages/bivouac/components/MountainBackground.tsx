import React from 'react';

export const MountainBackground: React.FC = () => (
    <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        top: '60px',
    }}>
        <svg
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
        >
            {/* Layer 5 — farthest, sharp alpine peaks */}
            <polygon
                points="0,800 0,460 80,420 160,340 240,390 340,260 420,310 520,220 620,280 720,200 820,260 920,230 1020,290 1120,210 1220,270 1320,240 1440,280 1440,800"
                fill="#354035"
                opacity="0.4"
            />
            {/* Layer 4 — still sharp, slightly softer */}
            <polygon
                points="0,800 0,520 100,470 230,390 380,450 500,340 660,410 790,300 930,380 1080,310 1220,390 1360,340 1440,370 1440,800"
                fill="#2f3a2f"
                opacity="0.55"
            />
            {/* Layer 3 — transitioning, peaks softening */}
            <polygon
                points="0,800 0,590 140,540 300,470 460,530 620,420 780,490 940,400 1100,470 1260,410 1440,460 1440,800"
                fill="#293029"
                opacity="0.7"
            />
            {/* Layer 2 — rounder, gentler hills */}
            <polygon
                points="0,800 0,670 180,630 360,600 540,640 720,580 900,630 1080,590 1260,630 1440,600 1440,800"
                fill="#242b24"
                opacity="0.85"
            />
            {/* Layer 1 — closest, fully rounded */}
            <path
                d="M0,800 L0,720 C120,700 240,680 360,690 C480,700 600,660 720,650 C840,640 960,660 1080,670 C1200,680 1320,665 1440,660 L1440,800 Z"
                fill="#1a1f1a"
            />
        </svg>
    </div>
);

// Previous version :
// const MountainBackground: React.FC = () => (
//     <div style={{
//         position: 'fixed',
//         inset: 0,
//         zIndex: 0,
//         pointerEvents: 'none',
//         top: '60px',
//     }}>
//         <svg
//             viewBox="0 0 1440 800"
//             preserveAspectRatio="xMidYMax slice"
//             xmlns="http://www.w3.org/2000/svg"
//             style={{ width: '100%', height: '100%' }}
//         >
//             {/* Layer 5 — farthest, sharp alpine peaks */}
//             {/* <polygon
//                 points="0,800 0,460 80,420 160,340 240,390 340,260 420,310 520,220 620,280 720,200 820,260 920,230 1020,290 1120,210 1220,270 1320,240 1440,280 1440,800"
//                 fill="#354035"
//                 opacity="0.2"
//             /> */}
//             {/* Layer 4 — still sharp, slightly softer */}
//             <polygon
//                 points="0,800 0,520 100,470 230,390 380,450 500,340 660,410 790,300 930,380 1080,310 1220,390 1360,340 1440,370 1440,800"
//                 fill="#2f3a2f"
//                 opacity="0.4"
//             />
//             {/* Layer 3 — transitioning, peaks softening */}
//             <polygon
//                 points="0,800 0,590 140,540 300,470 460,530 620,420 780,490 940,400 1100,470 1260,410 1440,460 1440,800"
//                 fill="#293029"
//                 opacity="0.55"
//             />
//             {/* Layer 2 — rounder, gentler hills */}
//             <polygon
//                 points="0,800 0,670 180,630 360,600 540,640 720,580 900,630 1080,590 1260,630 1440,600 1440,800"
//                 fill="#242b24"
//                 opacity="0.7"
//             />
//             <polygon
//                 points="0,800 0,700 180,620 400,680 620,590 840,660 1060,570 1280,650 1440,600 1440,800"
//                 fill="#1a1f1a"
//                 opacity="0.85"
//             />
//             {/* Layer 1 — closest, fully rounded, smooth hills */}
//             <path
//                 d="M0,800 L0,720 C120,700 240,680 360,690 C480,700 600,660 720,650 C840,640 960,660 1080,670 C1200,680 1320,665 1440,660 L1440,800 Z"
//                 fill="#1a1f1a"
//             />
//         </svg>
//     </div>
// );