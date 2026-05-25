import React from 'react';

interface LegendItemProps {
    label: string;
    color: string;
    shape: 'circle' | 'hexagon' | 'diamond' | 'star';
    filled: boolean;
    transparency?: boolean;
}

const LegendItem: React.FC<LegendItemProps> = ({ label, color, shape, filled, transparency = false }) => {
    const size = 28;
    const center = size / 2;
    const radius = 10;

    const getPath = () => {
        if (shape === 'circle') {
            return `M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
        } else if (shape === 'hexagon') {
            // Hexagon path
            const points: [number, number][] = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const px = center + radius * Math.cos(angle);
                const py = center + radius * Math.sin(angle);
                points.push([px, py]);
            }
            return `M ${points[0][0]},${points[0][1]} ${points.slice(1).map(p => `L ${p[0]},${p[1]}`).join(' ')} Z`;
        } else if (shape === 'diamond') {
            // Diamond (rotated square)
            return `M ${center},${center - radius} L ${center + radius},${center} L ${center},${center + radius} L ${center - radius},${center} Z`;
        } else if (shape === 'star') {
            // 10-pointed star (decagon)
            const points: [number, number][] = [];
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI / 5) * i - Math.PI / 10;
                const px = center + radius * Math.cos(angle);
                const py = center + radius * Math.sin(angle);
                points.push([px, py]);
            }
            return `M ${points[0][0]},${points[0][1]} ${points.slice(1).map(p => `L ${p[0]},${p[1]}`).join(' ')} Z`;
        }
        return '';
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
        }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
                <path
                    d={getPath()}
                    fill={filled ? (transparency ? `${color}dd` : color) : '#1c2128'}
                    stroke={filled ? '#0b0f14' : '#30363d'}
                    strokeWidth={filled ? 1 : 0.5}
                />
            </svg>
            <span style={{
                color: '#c9d1d9',
                fontSize: 12,
                fontWeight: 400,
            }}>
                {label}
            </span>
        </div>
    );
};

export const GraphLegend: React.FC = () => {
    return (
        <div
            className="hidden sm:block"
            style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                zIndex: 10,
                background: 'rgba(22,27,34,0.95)',
                border: '1px solid #21262d',
                borderRadius: 10,
                padding: '12px 14px',
                backdropFilter: 'blur(8px)',
            }}
        >
            <div style={{
                color: '#8b949e',
                fontSize: 11,
                marginBottom: 8,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}>
                États
            </div>

            <LegendItem
                label="Verrouillé"
                color="#30363d"
                shape="circle"
                filled={false}
            />

            <LegendItem
                label="Débloqué"
                color="#30363d"
                shape="star"
                filled={false}
            />

            <LegendItem
                label="Commencé"
                color="#a5b4fc"
                shape="hexagon"
                filled={true}
                transparency={true}
            />

            <LegendItem
                label="Terminé"
                color="#a5b4fc"
                shape="diamond"
                filled={true}
            />
        </div>
    );
};