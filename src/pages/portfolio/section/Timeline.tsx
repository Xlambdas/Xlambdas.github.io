import React, { useMemo, useState, useRef, useCallback } from 'react';
import type { TimelineProps, PeriodKey, ParsedEntry, LanedEntry } from '../constants';
import { TYPE_COLORS, TYPE_LABELS } from '../constants';
import { parseDate, fmtDecimal, entryColor, MONTH_ABBR } from '../helpers/timelineHelpers';
import type { EntryType } from '../../../locales/portfolio';
import { ABOVE_TYPES } from '../constants/types';


// Responsive config based on viewport width
const getResponsiveConfig = (width: number) => {
    if (width < 480) {
        // Mobile (< 480px)
        return {
            SVG_W: Math.min(width - 16, 340),
            RAIL_H: 8,
            BAR_H: 6,
            ROW_H: 24,
            TOP_PAD: 20,
            ABOVE: 2,
            BELOW: 2,
            TICK_FONT: 8,
            LABEL_FONT: 9,
            showTickLabels: true,
            showDatesOnHover: false,
        };
    } else if (width < 768) {
        // Tablet (480px - 768px)
        return {
            SVG_W: Math.min(width - 32, 500),
            RAIL_H: 9,
            BAR_H: 7,
            ROW_H: 28,
            TOP_PAD: 22,
            ABOVE: 2,
            BELOW: 2,
            TICK_FONT: 9,
            LABEL_FONT: 10,
            showTickLabels: true,
            showDatesOnHover: true,
        };
    } else {
        // Desktop (768px+)
        return {
            SVG_W: 680,
            RAIL_H: 10,
            BAR_H: 8,
            ROW_H: 30,
            TOP_PAD: 24,
            ABOVE: 3,
            BELOW: 3,
            TICK_FONT: 10,
            LABEL_FONT: 10,
            showTickLabels: true,
            showDatesOnHover: true,
        };
    }
};

export const Timeline: React.FC<TimelineProps> = ({ t }) => {
    const tl = t.timeline;
    if (!tl) return null;

    const [hoveredKey, setHoveredKey] = useState<number | null>(null);
    const [period, setPeriod] = useState<PeriodKey>('1y');
    const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(680);

    // Track container width for responsiveness
    React.useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        updateWidth();
        const resizeObserver = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    const config = useMemo(() => getResponsiveConfig(containerWidth), [containerWidth]);

    const now = useMemo(() => {
        const d = new Date();
        return d.getFullYear() + d.getMonth() / 12;
    }, []);

    // Parse entries (cast type from translation)
    const allEntries: ParsedEntry[] = useMemo(() => {
        if (!tl.entries) return [];
        return Object.entries(tl.entries).map(([k, v]) => {
            const end = parseDate(v.endDate);
            const start = v.startDate ? parseDate(v.startDate) : end;
            return {
                key: Number(k),
                ...v,
                type: ((v as any).type as EntryType) || 'other',
                startDecimal: start,
                endDecimal: end,
                isEvent: !v.startDate,
            };
        });
    }, [tl.entries]);

    // Used types for legend
    const usedTypes = useMemo(() => {
        const seen = new Set<EntryType>();
        allEntries.forEach(e => {
            if (e.type) seen.add(e.type);
        });
        return Array.from(seen);
    }, [allEntries]);

    // Axis bounds
    const { axisMin, axisMax } = useMemo(() => {
        if (!allEntries.length) return { axisMin: now - 1, axisMax: now + 0.5 };
        const allStarts = allEntries.map(e => e.startDecimal);
        const allEnds = allEntries.map(e => e.endDecimal);
        const dataMin = Math.min(...allStarts, now - 0.5);
        const dataMax = Math.max(...allEnds, now + 0.25);
        const PAD = 0.3;
        if (period === 'all') return { axisMin: dataMin - PAD, axisMax: dataMax + PAD };
        const yrs = period === '1y' ? 1 : period === '3y' ? 3 : 5;
        return { axisMin: now - yrs, axisMax: now + PAD };
    }, [period, now, allEntries]);

    // Visible entries
    const entries = useMemo(
        () => allEntries.filter(e => e.endDecimal >= axisMin && e.startDecimal <= axisMax),
        [allEntries, axisMin, axisMax]
    );

    // ── Layout constants (responsive) ──────────────────────────────────
    const SVG_W = config.SVG_W;
    const RAIL_H = config.RAIL_H;
    const BAR_H = config.BAR_H;
    const ROW_H = config.ROW_H;
    const TOP_PAD = config.TOP_PAD;
    const ABOVE = config.ABOVE;
    const BELOW = config.BELOW;

    const AXIS_Y = TOP_PAD + ABOVE * ROW_H + 16;
    const TICK_LABEL_Y = AXIS_Y + RAIL_H / 2 + 14;
    const SVG_H = AXIS_Y + RAIL_H / 2 + BELOW * ROW_H + 36;

    const toX = useCallback(
        (d: number) => ((d - axisMin) / (axisMax - axisMin)) * SVG_W,
        [axisMin, axisMax, SVG_W]
    );
    const nowX = toX(now);

    // Ticks (adapted for smaller screens)
    const ticks = useMemo(() => {
        const span = axisMax - axisMin;
        const out: { d: number; label: string; major: boolean }[] = [];

        if (span <= 1.5) {
            const startY = Math.floor(axisMin);
            const step = containerWidth < 480 ? 3 : 1; // Show fewer ticks on mobile
            for (let mo = 0; mo <= 30; mo += step) {
                const y = startY + Math.floor(mo / 12);
                const m = mo % 12;
                const d = y + m / 12;
                if (d < axisMin || d > axisMax) continue;
                out.push({ d, label: m === 0 ? String(y) : MONTH_ABBR[m], major: m === 0 });
            }
        } else if (span <= 8) {
            const skipMonths = containerWidth < 480 ? 2 : 1;
            for (let y = Math.floor(axisMin); y <= Math.ceil(axisMax); y++) {
                for (let mi = 0; mi < 4; mi += skipMonths) {
                    const m = mi * 3;
                    const d = y + m / 12;
                    if (d < axisMin || d > axisMax) continue;
                    out.push({ d, label: m === 0 && config.showTickLabels ? String(y) : '', major: m === 0 });
                }
            }
        } else {
            for (let y = Math.ceil(axisMin); y <= Math.floor(axisMax); y++) {
                out.push({ d: y, label: String(y), major: true });
            }
        }
        return out;
    }, [axisMin, axisMax, containerWidth, config.showTickLabels]);

    // Lane assignment — education above, everything else below
    const laned: LanedEntry[] = useMemo(() => {
        const aboveEnd = new Array(ABOVE).fill(-Infinity);
        const belowEnd = new Array(BELOW).fill(-Infinity);

        return entries.map(entry => {
            const clearAt = entry.endDecimal + 0.15;
            const isAbove = ABOVE_TYPES.has(entry.type ?? 'other');
            const preferredEnds = isAbove ? aboveEnd : belowEnd;
            const preferredSide: 'above' | 'below' = isAbove ? 'above' : 'below';

            for (let i = 0; i < preferredEnds.length; i++) {
                if (preferredEnds[i] <= entry.startDecimal) {
                    preferredEnds[i] = clearAt;
                    return { ...entry, lane: i, side: preferredSide };
                }
            }

            // Overflow: bump into the last lane anyway
            preferredEnds[preferredEnds.length - 1] = clearAt;
            return { ...entry, lane: preferredEnds.length - 1, side: preferredSide };
        });
    }, [entries, ABOVE, BELOW]);

    // Y positions
    const barTop = (lane: number, side: 'above' | 'below'): number => {
        if (side === 'above') {
            return AXIS_Y - RAIL_H / 2 - BAR_H - lane * ROW_H - 4;
        }
        return AXIS_Y + RAIL_H / 2 + lane * ROW_H + (ROW_H - BAR_H) / 2 + 4;
    };

    const stemEnd = (side: 'above' | 'below') =>
        side === 'above' ? AXIS_Y - RAIL_H / 2 : AXIS_Y + RAIL_H / 2;

    // Mouse
    const onMouseMove = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            if (!svgRef.current) return;
            const r = svgRef.current.getBoundingClientRect();
            setTooltip({
                x: ((e.clientX - r.left) / r.width) * SVG_W,
                y: ((e.clientY - r.top) / r.height) * SVG_H,
            });
        },
        [SVG_W, SVG_H]
    );

    const hov = laned.find(e => e.key === hoveredKey) ?? null;

    const PERIODS: { key: PeriodKey; label: string }[] = [
        { key: '1y', label: '1 yr' },
        { key: '3y', label: '3 yrs' },
        { key: '5y', label: '5 yrs' },
        { key: 'all', label: 'All' },
    ];

    return (
        <section
            className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex items-center"
            role="region"
            aria-label={tl.ariaLabel}
        >
            <div className="max-w-5xl mx-auto w-full" ref={containerRef}>

                {/* Title */}
                <h2
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light italic mb-4 sm:mb-6 lg:mb-8"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-primary)' }}
                >
                    {tl.title}
                </h2>

                {/* Description */}
                <p
                    className="text-sm sm:text-base lg:text-lg mb-8 lg:mb-10 opacity-80"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)' }}
                >
                    {tl.description}
                </p>

                {/* Controls row: period buttons + legend */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">

                    {/* Period buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {PERIODS.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setPeriod(key)}
                                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-light uppercase transition-all duration-200"
                                style={{
                                    fontFamily: 'var(--font-secondary)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid',
                                    borderColor: period === key
                                        ? 'var(--color-primary)'
                                        : 'var(--color-primary-transparent)',
                                    opacity: period === key ? 1 : 0.5,
                                    letterSpacing: '0.1em',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Type legend */}
                    {usedTypes.length > 0 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                            {usedTypes.map(type => (
                                <span
                                    key={type}
                                    className="flex items-center gap-1 sm:gap-1.5 text-xs font-light"
                                    style={{
                                        color: 'var(--color-primary)',
                                        fontFamily: 'var(--font-secondary)',
                                        opacity: 0.75,
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 16,
                                            height: 5,
                                            borderRadius: 2.5,
                                            backgroundColor: TYPE_COLORS[type],
                                            opacity: 0.85,
                                        }}
                                    />
                                    <span className="hidden sm:inline">{TYPE_LABELS[type]}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gantt SVG — responsive wrapper */}
                <div className="relative w-full overflow-x-auto mb-6 sm:mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
                    <svg
                        ref={svgRef}
                        width="100%"
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                            display: 'block',
                            overflow: 'visible',
                            minWidth: `${SVG_W}px`,
                        }}
                        onMouseMove={onMouseMove}
                        onMouseLeave={() => {
                            setHoveredKey(null);
                            setTooltip(null);
                        }}
                        aria-hidden="true"
                        onClick={() => setSelectedKey(null)}
                    >
                        {/* ── Tick marks ───────────────────────────────── */}
                        {ticks.map((tick, i) => {
                            const x = toX(tick.d);
                            if (x < -2 || x > SVG_W + 2) return null;
                            return (
                                <g key={i}>
                                    {/* Tick line — short, centered on rail */}
                                    <line
                                        x1={x}
                                        y1={AXIS_Y - (tick.major ? 6 : 3)}
                                        x2={x}
                                        y2={AXIS_Y + (tick.major ? 6 : 3)}
                                        stroke="var(--color-primary)"
                                        strokeOpacity={tick.major ? 0.35 : 0.15}
                                        strokeWidth={tick.major ? 1 : 0.5}
                                    />
                                    {/* Label — centered, just below rail */}
                                    {tick.label && (
                                        <text
                                            x={x}
                                            y={TICK_LABEL_Y}
                                            textAnchor="middle"
                                            style={{
                                                fill: 'var(--color-primary)',
                                                fontFamily: 'var(--font-secondary)',
                                                fontSize: `${config.TICK_FONT}px`,
                                                opacity: tick.major ? 0.5 : 0.25,
                                            }}
                                        >
                                            {tick.label}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* ── Axis rail ────────────────────────────────── */}
                        {/* Outer pill */}
                        <rect
                            x={0}
                            y={AXIS_Y - RAIL_H / 2}
                            width={SVG_W}
                            height={RAIL_H}
                            rx={RAIL_H / 2}
                            fill="var(--color-primary)"
                            fillOpacity="0.08"
                            stroke="var(--color-primary)"
                            strokeOpacity="0.12"
                            strokeWidth="0.5"
                        />
                        {/* Inner bright line */}
                        <rect
                            x={0}
                            y={AXIS_Y - 1.5}
                            width={SVG_W}
                            height={3}
                            rx={1.5}
                            fill="var(--color-primary)"
                            fillOpacity="0.2"
                        />

                        {/* ── Now line ─────────────────────────────────── */}
                        {nowX >= -2 && nowX <= SVG_W + 2 && (
                            <>
                                <line
                                    x1={nowX}
                                    y1={TOP_PAD}
                                    x2={nowX}
                                    y2={AXIS_Y + RAIL_H / 2 + BELOW * ROW_H + 10}
                                    stroke="var(--color-primary)"
                                    strokeOpacity="0.25"
                                    strokeWidth="1"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={nowX}
                                    y={TOP_PAD - 6}
                                    textAnchor="middle"
                                    style={{
                                        fill: 'var(--color-primary)',
                                        fontFamily: 'var(--font-secondary)',
                                        fontSize: '9px',
                                        letterSpacing: '0.1em',
                                        opacity: 0.45,
                                    }}
                                >
                                    now
                                </text>
                                {/* Dot on rail */}
                                <circle
                                    cx={nowX}
                                    cy={AXIS_Y}
                                    r={3.5}
                                    fill="var(--color-primary)"
                                    fillOpacity="0.5"
                                />
                            </>
                        )}

                        {/* ── Entries ──────────────────────────────────── */}
                        {laned.map(entry => {
                            const x1 = Math.max(0, toX(entry.startDecimal));
                            const x2 = Math.min(SVG_W, toX(entry.endDecimal));
                            const w = Math.max(x2 - x1, 4);
                            const midX = (x1 + x2) / 2;
                            const by = barTop(entry.lane, entry.side);
                            const barMidY = by + BAR_H / 2;
                            const sy2 = stemEnd(entry.side);
                            const stemX = entry.isEvent ? midX : x1 + Math.min(14, w / 2);
                            const sy1 = entry.side === 'above' ? by + BAR_H : by;
                            const isHov = hoveredKey === entry.key || selectedKey === entry.key;
                            const color = entryColor(entry.type);

                            const labelY =
                                entry.side === 'above' ? by - 5 : by + BAR_H + 13;

                            return (
                                <g
                                    key={entry.key}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredKey(entry.key)}
                                    onMouseLeave={() => setHoveredKey(null)}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setSelectedKey(prev =>
                                            prev === entry.key ? null : entry.key
                                        );
                                    }}
                                >
                                    {/* Stem */}
                                    <line
                                        x1={stemX}
                                        y1={sy1}
                                        x2={stemX}
                                        y2={sy2}
                                        stroke={color}
                                        strokeOpacity={isHov ? 0.7 : 0.25}
                                        strokeWidth={isHov ? 1 : 0.5}
                                        strokeDasharray={entry.isEvent ? '2 2' : undefined}
                                    />

                                    {entry.isEvent ? (
                                        /* ── Diamond (event) ── */
                                        <>
                                            <rect
                                                x={midX - 5}
                                                y={barMidY - 5}
                                                width={10}
                                                height={10}
                                                transform={`rotate(45 ${midX} ${barMidY})`}
                                                fill={isHov ? color : 'none'}
                                                stroke={color}
                                                strokeOpacity={isHov ? 1 : 0.65}
                                                strokeWidth={isHov ? 1.5 : 1}
                                            />
                                            <text
                                                x={midX}
                                                y={labelY}
                                                textAnchor="middle"
                                                style={{
                                                    fill: color,
                                                    fontFamily: 'var(--font-secondary)',
                                                    fontSize: `${config.LABEL_FONT}px`,
                                                    fontStyle: 'italic',
                                                    opacity: isHov ? 1 : 0.55,
                                                }}
                                            >
                                                {entry.title.length > 18
                                                    ? entry.title.slice(0, 16) + '…'
                                                    : entry.title}
                                            </text>
                                        </>
                                    ) : (
                                        /* ── Status bar (range) ── */
                                        <>
                                            {/* Pill bar */}
                                            <rect
                                                x={x1}
                                                y={by}
                                                width={w}
                                                height={BAR_H}
                                                rx={BAR_H / 2}
                                                fill={color}
                                                fillOpacity={isHov ? 0.35 : 0.18}
                                                stroke={color}
                                                strokeOpacity={isHov ? 1 : 0.5}
                                                strokeWidth={isHov ? 1.5 : 0.75}
                                            />
                                            {/* Label above / below bar */}
                                            <text
                                                x={midX}
                                                y={labelY}
                                                textAnchor="middle"
                                                style={{
                                                    fill: color,
                                                    fontFamily: 'var(--font-secondary)',
                                                    fontSize: `${config.LABEL_FONT}px`,
                                                    opacity: isHov ? 1 : 0.65,
                                                    fontWeight: 300,
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                {containerWidth < 480
                                                    ? entry.title.length > 16
                                                        ? entry.title.slice(0, 14) + '…'
                                                        : entry.title
                                                    : entry.title.length > 26
                                                        ? entry.title.slice(0, 24) + '…'
                                                        : entry.title}
                                            </text>
                                            {/* Date range — shown only on hover */}
                                            {config.showDatesOnHover && (
                                                <text
                                                    x={x1}
                                                    y={
                                                        entry.side === 'above'
                                                            ? by - 17
                                                            : by + BAR_H + 26
                                                    }
                                                    style={{
                                                        fill: color,
                                                        fontFamily: 'var(--font-secondary)',
                                                        fontSize: '9px',
                                                        opacity: isHov ? 0.55 : 0,
                                                        letterSpacing: '0.03em',
                                                    }}
                                                >
                                                    {fmtDecimal(entry.startDecimal)} →{' '}
                                                    {fmtDecimal(entry.endDecimal)}
                                                </text>
                                            )}
                                        </>
                                    )}
                                </g>
                            );
                        })}

                        {/* ── Tooltip ──────────────────────────────────── */}
                        {hov && tooltip && (() => {
                            const color = entryColor(hov.type);
                            const TW = containerWidth < 480 ? 180 : 216;
                            const P = 11;

                            const desc =
                                hov.description.length > 100
                                    ? hov.description.slice(0, 98) + '…'
                                    : hov.description;
                            const lines: string[] = [];
                            let buf = '';
                            const maxChars = containerWidth < 480 ? 28 : 34;
                            desc.split(' ').forEach(w => {
                                if ((buf + w).length > maxChars) {
                                    lines.push(buf.trim());
                                    buf = '';
                                }
                                buf += w + ' ';
                            });
                            if (buf.trim()) lines.push(buf.trim());

                            const TH =
                                P * 2 + 16 + 13 + (hov.type ? 13 : 0) + lines.length * 13 + 6;

                            let tx = tooltip.x + 14;
                            let ty = tooltip.y - TH - 10;
                            if (tx + TW > SVG_W - 4) tx = tooltip.x - TW - 14;
                            if (ty < 4) ty = tooltip.y + 16;

                            let row = 0;
                            const line = (
                                text: string,
                                opts: {
                                    dy?: number;
                                    italic?: boolean;
                                    opacity?: number;
                                    size?: number;
                                    mono?: boolean;
                                    color?: string;
                                } = {}
                            ) => {
                                const y = ty + P + 14 + row * 13 + (opts.dy ?? 0);
                                row++;
                                return (
                                    <text
                                        x={tx + P}
                                        y={y}
                                        style={{
                                            fill: opts.color ?? 'var(--color-primary)',
                                            fontFamily: opts.mono
                                                ? 'var(--font-mono, monospace)'
                                                : opts.italic
                                                    ? 'var(--font-primary)'
                                                    : 'var(--font-secondary)',
                                            fontSize: `${opts.size ?? 10}px`,
                                            fontStyle: opts.italic ? 'italic' : 'normal',
                                            opacity: opts.opacity ?? 0.85,
                                        }}
                                    >
                                        {text}
                                    </text>
                                );
                            };

                            return (
                                <g style={{ pointerEvents: 'none' }}>
                                    {/* Accent left border */}
                                    <rect
                                        x={tx}
                                        y={ty}
                                        width={3}
                                        height={TH}
                                        rx={1.5}
                                        fill={color}
                                        fillOpacity="0.8"
                                    />
                                    <rect
                                        x={tx}
                                        y={ty}
                                        width={TW}
                                        height={TH}
                                        rx={4}
                                        fill="var(--color-background)"
                                        stroke={color}
                                        strokeOpacity="0.3"
                                        strokeWidth="0.75"
                                    />
                                    {/* Title */}
                                    {line(
                                        hov.title.length > 28
                                            ? hov.title.slice(0, 26) + '…'
                                            : hov.title,
                                        { italic: true, size: 12, opacity: 1 }
                                    )}
                                    {/* Dates */}
                                    {line(
                                        `${hov.startDate}${hov.endDate ? ' → ' + hov.endDate : ''
                                        }`,
                                        { mono: true, opacity: 0.4, size: 9 }
                                    )}
                                    {/* Type badge text */}
                                    {hov.type &&
                                        line(TYPE_LABELS[hov.type], {
                                            color,
                                            opacity: 0.8,
                                            size: 9,
                                        })}
                                    {/* Description */}
                                    {lines.map((l, li) => (
                                        <React.Fragment key={li}>
                                            {line(l, { opacity: 0.6 })}
                                        </React.Fragment>
                                    ))}
                                </g>
                            );
                        })()}
                    </svg>
                </div>

                {/* ── Chart footer note ──────────────────────────────────── */}
                {(tl as any).chartNote && (
                    <p
                        className="mt-3 sm:mt-4 text-xs opacity-40 font-light"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-secondary)',
                            letterSpacing: '0.03em',
                        }}
                    >
                        {(tl as any).chartNote}
                    </p>
                )}

                {/* ── Accessible entry list ─────────────────────────────── */}
                <ul
                    className="mt-8 sm:mt-10 lg:mt-12"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-secondary)',
                    }}
                >
                    {[...allEntries]
                        .sort((a, b) => b.startDecimal - a.startDecimal)
                        .map(entry => {
                            const color = entryColor(entry.type);
                            const isHov =
                                hoveredKey === entry.key || selectedKey === entry.key;
                            return (
                                <li
                                    key={entry.key}
                                    className="grid gap-3 sm:gap-4 py-3 sm:py-4 border-t transition-opacity duration-150"
                                    style={{
                                        borderColor: 'var(--color-primary-transparent)',
                                        gridTemplateColumns:
                                            containerWidth < 480
                                                ? '1fr'
                                                : '6.5rem 1fr',
                                        opacity:
                                            hoveredKey === null && selectedKey === null
                                                ? 1
                                                : isHov
                                                    ? 1
                                                    : 0.35,
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={() => setHoveredKey(entry.key)}
                                    onMouseLeave={() => setHoveredKey(null)}
                                    onClick={() =>
                                        setSelectedKey(prev =>
                                            prev === entry.key ? null : entry.key
                                        )
                                    }
                                >
                                    {/* Date column — stacked on mobile */}
                                    <div
                                        className="text-xs font-mono opacity-40 leading-relaxed"
                                        style={{
                                            gridColumn: containerWidth < 480 ? '1 / -1' : undefined,
                                        }}
                                    >
                                        {entry.startDate}
                                        {entry.endDate && (
                                            <>
                                                <br />
                                                <span>→ {entry.endDate}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-sm font-light">
                                                {entry.title}
                                            </span>
                                            {entry.type && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-md font-medium whitespace-nowrap"
                                                    style={{
                                                        backgroundColor: color,
                                                        color: '#000',
                                                        fontSize: '10px',
                                                        opacity: 0.85,
                                                    }}
                                                >
                                                    {TYPE_LABELS[entry.type]}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-light leading-relaxed opacity-55">
                                            {entry.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                </ul>

            </div>
        </section>
    );
};

export const Timeline_save: React.FC<TimelineProps> = ({ t }) => {
    const tl = t.timeline;
    if (!tl) return null;

    const [hoveredKey, setHoveredKey] = useState<number | null>(null);
    const [period, setPeriod] = useState<PeriodKey>('all');
    const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
    const [selectedKey, setSelectedKey] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const now = useMemo(() => {
        const d = new Date();
        return d.getFullYear() + d.getMonth() / 12;
    }, []);

    // Parse entries (cast type from translation)
    const allEntries: ParsedEntry[] = useMemo(() => {
        if (!tl.entries) return [];
        return Object.entries(tl.entries).map(([k, v]) => {
            const end = parseDate(v.endDate);
            const start = v.startDate ? parseDate(v.startDate) : end;
            return {
                key: Number(k), ...v,
                type: ((v as any).type as EntryType) || 'other',
                startDecimal: start,
                endDecimal: end,
                isEvent: !v.startDate,
            };
        });
    }, [tl.entries]);

    // Used types for legend
    const usedTypes = useMemo(() => {
        const seen = new Set<EntryType>();
        allEntries.forEach(e => { if (e.type) seen.add(e.type); });
        return Array.from(seen);
    }, [allEntries]);

    // Axis bounds
    const { axisMin, axisMax } = useMemo(() => {
        if (!allEntries.length) return { axisMin: now - 1, axisMax: now + 0.5 };
        const allStarts = allEntries.map(e => e.startDecimal);
        const allEnds = allEntries.map(e => e.endDecimal);
        const dataMin = Math.min(...allStarts, now - 0.5);
        const dataMax = Math.max(...allEnds, now + 0.25);
        const PAD = 0.3;
        if (period === 'all') return { axisMin: dataMin - PAD, axisMax: dataMax + PAD };
        const yrs = period === '1y' ? 1 : period === '3y' ? 3 : 5;
        return { axisMin: now - yrs, axisMax: now + PAD };
    }, [period, now, allEntries]);

    // Visible entries
    const entries = useMemo(
        () => allEntries.filter(e => e.endDecimal >= axisMin && e.startDecimal <= axisMax),
        [allEntries, axisMin, axisMax]
    );

    // ── Layout constants ──────────────────────────────────────────────────────
    const SVG_W = 680;
    const RAIL_H = 10;      // thick pill rail
    const BAR_H = 8;      // slim status-bar style entries
    const ROW_H = 30;      // vertical spacing per lane
    const ABOVE = 3;
    const BELOW = 3;

    // Axis sits in the vertical center of the SVG
    // Above area: ABOVE * ROW_H + top padding
    const TOP_PAD = 24;    // space above top entries for labels
    const AXIS_Y = TOP_PAD + ABOVE * ROW_H + 16; // where rail center sits
    const TICK_LABEL_Y = AXIS_Y + RAIL_H / 2 + 14; // just below rail
    const SVG_H = AXIS_Y + RAIL_H / 2 + BELOW * ROW_H + 36;

    const toX = useCallback(
        (d: number) => ((d - axisMin) / (axisMax - axisMin)) * SVG_W,
        [axisMin, axisMax]
    );
    const nowX = toX(now);

    // Ticks
    const ticks = useMemo(() => {
        const span = axisMax - axisMin;
        const out: { d: number; label: string; major: boolean }[] = [];
        if (span <= 1.5) {
            const startY = Math.floor(axisMin);
            for (let mo = 0; mo <= 30; mo++) {
                const y = startY + Math.floor(mo / 12);
                const m = mo % 12;
                const d = y + m / 12;
                if (d < axisMin || d > axisMax) continue;
                out.push({ d, label: m === 0 ? String(y) : MONTH_ABBR[m], major: m === 0 });
            }
        } else if (span <= 8) {
            for (let y = Math.floor(axisMin); y <= Math.ceil(axisMax); y++) {
                for (const m of [0, 3, 6, 9]) {
                    const d = y + m / 12;
                    if (d < axisMin || d > axisMax) continue;
                    out.push({ d, label: m === 0 ? String(y) : '', major: m === 0 });
                }
            }
        } else {
            for (let y = Math.ceil(axisMin); y <= Math.floor(axisMax); y++) {
                out.push({ d: y, label: String(y), major: true });
            }
        }
        return out;
    }, [axisMin, axisMax]);

    // Lane assignment — education above, everything else below
    const laned: LanedEntry[] = useMemo(() => {
        const aboveEnd = new Array(ABOVE).fill(-Infinity);
        const belowEnd = new Array(BELOW).fill(-Infinity);

        return entries.map(entry => {
            const clearAt = entry.endDecimal + 0.15;
            const isAbove = ABOVE_TYPES.has(entry.type ?? 'other');
            const preferredEnds = isAbove ? aboveEnd : belowEnd;
            const preferredSide: 'above' | 'below' = isAbove ? 'above' : 'below';

            for (let i = 0; i < preferredEnds.length; i++) {
                if (preferredEnds[i] <= entry.startDecimal) {
                    preferredEnds[i] = clearAt;
                    return { ...entry, lane: i, side: preferredSide };
                }
            }

            // Overflow: bump into the last lane anyway
            preferredEnds[preferredEnds.length - 1] = clearAt;
            return { ...entry, lane: preferredEnds.length - 1, side: preferredSide };
        });
    }, [entries]);

    // Y positions
    const barTop = (lane: number, side: 'above' | 'below'): number => {
        if (side === 'above') {
            // lane 0 = closest to axis, going up
            return AXIS_Y - RAIL_H / 2 - BAR_H - lane * ROW_H - 4;
        }
        return AXIS_Y + RAIL_H / 2 + lane * ROW_H + (ROW_H - BAR_H) / 2 + 4;
    };

    const stemEnd = (side: 'above' | 'below') =>
        side === 'above' ? AXIS_Y - RAIL_H / 2 : AXIS_Y + RAIL_H / 2;

    // Mouse
    const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const r = svgRef.current.getBoundingClientRect();
        setTooltip({
            x: ((e.clientX - r.left) / r.width) * SVG_W,
            y: ((e.clientY - r.top) / r.height) * SVG_H,
        });
    }, [SVG_H]);

    const hov = laned.find(e => e.key === hoveredKey) ?? null;

    const PERIODS: { key: PeriodKey; label: string }[] = [
        { key: '1y', label: '1 yr' },
        { key: '3y', label: '3 yrs' },
        { key: '5y', label: '5 yrs' },
        { key: 'all', label: 'All' },
    ];

    return (
        <section
            className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 flex items-center"
            role="region"
            aria-label={tl.ariaLabel}
        >
            <div className="max-w-5xl mx-auto w-full">

                {/* Title */}
                <h2
                    className="text-4xl sm:text-5xl lg:text-6xl font-light italic mb-6 sm:mb-8"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-primary)' }}
                >
                    {tl.title}
                </h2>

                {/* Description */}
                <p
                    className="text-base sm:text-lg mb-10 opacity-80"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)' }}
                >
                    {tl.description}
                </p>

                {/* Controls row: period buttons + legend */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

                    {/* Period buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {PERIODS.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setPeriod(key)}
                                className="px-4 py-1.5 text-xs font-light uppercase transition-all duration-200"
                                style={{
                                    fontFamily: 'var(--font-secondary)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid',
                                    borderColor: period === key
                                        ? 'var(--color-primary)'
                                        : 'var(--color-primary-transparent)',
                                    opacity: period === key ? 1 : 0.5,
                                    letterSpacing: '0.1em',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Type legend */}
                    {usedTypes.length > 0 && (
                        <div className="flex flex-wrap gap-3 items-center">
                            {usedTypes.map(type => (
                                <span
                                    key={type}
                                    className="flex items-center gap-1.5 text-xs font-light"
                                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)', opacity: 0.75 }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 20,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: TYPE_COLORS[type],
                                            opacity: 0.85,
                                        }}
                                    />
                                    {TYPE_LABELS[type]}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gantt SVG */}
                <div className="relative w-full">
                    <svg
                        ref={svgRef}
                        width="100%"
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        style={{ display: 'block', overflow: 'visible' }}
                        onMouseMove={onMouseMove}
                        onMouseLeave={() => { setHoveredKey(null); setTooltip(null); }}
                        aria-hidden="true"
                        onClick={() => setSelectedKey(null)}
                    >
                        {/* ── Tick marks ───────────────────────────────── */}
                        {ticks.map((tick, i) => {
                            const x = toX(tick.d);
                            if (x < -2 || x > SVG_W + 2) return null;
                            return (
                                <g key={i}>
                                    {/* Tick line — short, centered on rail */}
                                    <line
                                        x1={x} y1={AXIS_Y - (tick.major ? 6 : 3)}
                                        x2={x} y2={AXIS_Y + (tick.major ? 6 : 3)}
                                        stroke="var(--color-primary)"
                                        strokeOpacity={tick.major ? 0.35 : 0.15}
                                        strokeWidth={tick.major ? 1 : 0.5}
                                    />
                                    {/* Label — centered, just below rail */}
                                    {tick.label && (
                                        <text
                                            x={x}
                                            y={TICK_LABEL_Y}
                                            textAnchor="middle"
                                            style={{
                                                fill: 'var(--color-primary)',
                                                fontFamily: 'var(--font-secondary)',
                                                fontSize: '10px',
                                                opacity: tick.major ? 0.5 : 0.25,
                                            }}
                                        >
                                            {tick.label}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* ── Axis rail ────────────────────────────────── */}
                        {/* Outer pill */}
                        <rect
                            x={0} y={AXIS_Y - RAIL_H / 2}
                            width={SVG_W} height={RAIL_H}
                            rx={RAIL_H / 2}
                            fill="var(--color-primary)"
                            fillOpacity="0.08"
                            stroke="var(--color-primary)"
                            strokeOpacity="0.12"
                            strokeWidth="0.5"
                        />
                        {/* Inner bright line */}
                        <rect
                            x={0} y={AXIS_Y - 1.5}
                            width={SVG_W} height={3}
                            rx={1.5}
                            fill="var(--color-primary)"
                            fillOpacity="0.2"
                        />

                        {/* ── Now line ─────────────────────────────────── */}
                        {nowX >= -2 && nowX <= SVG_W + 2 && (
                            <>
                                <line
                                    x1={nowX} y1={TOP_PAD}
                                    x2={nowX} y2={AXIS_Y + RAIL_H / 2 + BELOW * ROW_H + 10}
                                    stroke="var(--color-primary)"
                                    strokeOpacity="0.25"
                                    strokeWidth="1"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={nowX} y={TOP_PAD - 6}
                                    textAnchor="middle"
                                    style={{
                                        fill: 'var(--color-primary)',
                                        fontFamily: 'var(--font-secondary)',
                                        fontSize: '9px',
                                        letterSpacing: '0.1em',
                                        opacity: 0.45,
                                    }}
                                >
                                    now
                                </text>
                                {/* Dot on rail */}
                                <circle
                                    cx={nowX} cy={AXIS_Y} r={3.5}
                                    fill="var(--color-primary)" fillOpacity="0.5"
                                />
                            </>
                        )}

                        {/* ── Entries ──────────────────────────────────── */}
                        {laned.map(entry => {
                            const x1 = Math.max(0, toX(entry.startDecimal));
                            const x2 = Math.min(SVG_W, toX(entry.endDecimal));
                            const w = Math.max(x2 - x1, 4);
                            const midX = (x1 + x2) / 2;
                            const by = barTop(entry.lane, entry.side);
                            const barMidY = by + BAR_H / 2;
                            const sy2 = stemEnd(entry.side);
                            const stemX = entry.isEvent ? midX : x1 + Math.min(14, w / 2);
                            const sy1 = entry.side === 'above' ? by + BAR_H : by;
                            const isHov = hoveredKey === entry.key || selectedKey === entry.key;
                            const color = entryColor(entry.type);

                            // Label sits opposite to axis (above bar if above, below bar if below)
                            const labelY = entry.side === 'above'
                                ? by - 5
                                : by + BAR_H + 13;

                            return (
                                <g
                                    key={entry.key}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredKey(entry.key)}
                                    onMouseLeave={() => setHoveredKey(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedKey(prev => prev === entry.key ? null : entry.key);
                                    }}
                                >
                                    {/* Stem */}
                                    <line
                                        x1={stemX} y1={sy1}
                                        x2={stemX} y2={sy2}
                                        stroke={color}
                                        strokeOpacity={isHov ? 0.7 : 0.25}
                                        strokeWidth={isHov ? 1 : 0.5}
                                        strokeDasharray={entry.isEvent ? '2 2' : undefined}
                                    />

                                    {entry.isEvent ? (
                                        /* ── Diamond (event) ── */
                                        <>
                                            <rect
                                                x={midX - 5} y={barMidY - 5}
                                                width={10} height={10}
                                                transform={`rotate(45 ${midX} ${barMidY})`}
                                                fill={isHov ? color : 'none'}
                                                stroke={color}
                                                strokeOpacity={isHov ? 1 : 0.65}
                                                strokeWidth={isHov ? 1.5 : 1}
                                            />
                                            <text
                                                x={midX}
                                                y={labelY}
                                                textAnchor="middle"
                                                style={{
                                                    fill: color,
                                                    fontFamily: 'var(--font-secondary)',
                                                    fontSize: '10px',
                                                    fontStyle: 'italic',
                                                    opacity: isHov ? 1 : 0.55,
                                                }}
                                            >
                                                {entry.title}
                                            </text>
                                        </>
                                    ) : (
                                        /* ── Status bar (range) ── */
                                        <>
                                            {/* Pill bar */}
                                            <rect
                                                x={x1} y={by}
                                                width={w} height={BAR_H}
                                                rx={BAR_H / 2}
                                                fill={color}
                                                fillOpacity={isHov ? 0.35 : 0.18}
                                                stroke={color}
                                                strokeOpacity={isHov ? 1 : 0.5}
                                                strokeWidth={isHov ? 1.5 : 0.75}
                                            />
                                            {/* Label above / below bar */}
                                            <text
                                                x={midX}
                                                y={labelY}
                                                textAnchor="middle"
                                                style={{
                                                    fill: color,
                                                    fontFamily: 'var(--font-secondary)',
                                                    fontSize: '10px',
                                                    opacity: isHov ? 1 : 0.65,
                                                    fontWeight: 300,
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                {entry.title.length > 26
                                                    ? entry.title.slice(0, 24) + '…'
                                                    : entry.title}
                                            </text>
                                            {/* Date range — shown only on hover */}
                                            <text
                                                x={x1}
                                                y={entry.side === 'above' ? by - 17 : by + BAR_H + 26}
                                                style={{
                                                    fill: color,
                                                    fontFamily: 'var(--font-secondary)',
                                                    fontSize: '9px',
                                                    opacity: isHov ? 0.55 : 0,
                                                    letterSpacing: '0.03em',
                                                }}
                                            >
                                                {fmtDecimal(entry.startDecimal)} → {fmtDecimal(entry.endDecimal)}
                                            </text>
                                        </>
                                    )}
                                </g>
                            );
                        })}

                        {/* ── Tooltip ──────────────────────────────────── */}
                        {hov && tooltip && (() => {
                            const color = entryColor(hov.type);
                            const TW = 216;
                            const P = 11;

                            const desc = hov.description.length > 100
                                ? hov.description.slice(0, 98) + '…'
                                : hov.description;
                            const lines: string[] = [];
                            let buf = '';
                            desc.split(' ').forEach(w => {
                                if ((buf + w).length > 34) { lines.push(buf.trim()); buf = ''; }
                                buf += w + ' ';
                            });
                            if (buf.trim()) lines.push(buf.trim());

                            const TH = P * 2 + 16 + 13 + (hov.type ? 13 : 0) + lines.length * 13 + 6;

                            let tx = tooltip.x + 14;
                            let ty = tooltip.y - TH - 10;
                            if (tx + TW > SVG_W - 4) tx = tooltip.x - TW - 14;
                            if (ty < 4) ty = tooltip.y + 16;

                            let row = 0;
                            const line = (text: string, opts: {
                                dy?: number; italic?: boolean; opacity?: number;
                                size?: number; mono?: boolean; color?: string;
                            } = {}) => {
                                const y = ty + P + 14 + row * 13 + (opts.dy ?? 0);
                                row++;
                                return (
                                    <text
                                        x={tx + P} y={y}
                                        style={{
                                            fill: opts.color ?? 'var(--color-primary)',
                                            fontFamily: opts.mono
                                                ? 'var(--font-mono, monospace)'
                                                : opts.italic
                                                    ? 'var(--font-primary)'
                                                    : 'var(--font-secondary)',
                                            fontSize: `${opts.size ?? 10}px`,
                                            fontStyle: opts.italic ? 'italic' : 'normal',
                                            opacity: opts.opacity ?? 0.85,
                                        }}
                                    >
                                        {text}
                                    </text>
                                );
                            };

                            return (
                                <g style={{ pointerEvents: 'none' }}>
                                    {/* Accent left border */}
                                    <rect x={tx} y={ty} width={3} height={TH} rx={1.5} fill={color} fillOpacity="0.8" />
                                    <rect
                                        x={tx} y={ty} width={TW} height={TH} rx={4}
                                        fill="var(--color-background)"
                                        stroke={color} strokeOpacity="0.3" strokeWidth="0.75"
                                    />
                                    {/* Title */}
                                    {line(hov.title.length > 28 ? hov.title.slice(0, 26) + '…' : hov.title,
                                        { italic: true, size: 12, opacity: 1 })}
                                    {/* Dates */}
                                    {line(`${hov.startDate}${hov.endDate ? ' → ' + hov.endDate : ''}`,
                                        { mono: true, opacity: 0.4, size: 9 })}
                                    {/* Type badge text */}
                                    {hov.type && line(TYPE_LABELS[hov.type], { color, opacity: 0.8, size: 9 })}
                                    {/* Description */}
                                    {lines.map((l, li) => (
                                        <React.Fragment key={li}>
                                            {line(l, { opacity: 0.6 })}
                                        </React.Fragment>
                                    ))}
                                </g>
                            );
                        })()}
                    </svg>
                </div>

                {/* ── Chart footer note ──────────────────────────────────── */}
                {(tl as any).chartNote && (
                    <p
                        className="mt-4 text-xs opacity-40 font-light"
                        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.03em' }}
                    >
                        {(tl as any).chartNote}
                    </p>
                )}

                {/* ── Accessible entry list ─────────────────────────────── */}
                <ul
                    className="mt-12"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)' }}
                >
                    {[...allEntries].sort((a, b) => b.startDecimal - a.startDecimal).map(entry => {
                        const color = entryColor(entry.type);
                        const isHov = hoveredKey === entry.key || selectedKey === entry.key;
                        return (
                            <li
                                key={entry.key}
                                className="grid gap-4 py-4 border-t transition-opacity duration-150"
                                style={{
                                    borderColor: 'var(--color-primary-transparent)',
                                    gridTemplateColumns: '6.5rem 1fr',
                                    opacity: (hoveredKey === null && selectedKey === null) || isHov ? 1 : 0.35,
                                    cursor: 'default',
                                }}
                                onMouseEnter={() => setHoveredKey(entry.key)}
                                onMouseLeave={() => setHoveredKey(null)}
                                onClick={() => setSelectedKey(prev => prev === entry.key ? null : entry.key)}
                            >
                                {/* Date column */}
                                <div className="text-xs font-mono opacity-40 pt-0.5 leading-relaxed">
                                    {entry.startDate}
                                    {entry.endDate && <><br /><span>→ {entry.endDate}</span></>}
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-light">{entry.title}</span>
                                        {entry.type && (
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-md font-medium"
                                                style={{
                                                    backgroundColor: color,
                                                    color: '#000',
                                                    fontSize: '10px',
                                                    opacity: 0.85,
                                                }}
                                            >
                                                {TYPE_LABELS[entry.type]}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-light leading-relaxed opacity-55">
                                        {entry.description}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>

            </div>
        </section>
    );
};