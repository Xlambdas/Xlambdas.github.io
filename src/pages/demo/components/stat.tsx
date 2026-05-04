interface StatProps {
    value: number | string;
    label: string;
}

export const Stat: React.FC<StatProps> = ({ value, label }) => (
    <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ color: "#c9d1d9", fontSize: 15, fontWeight: 500 }}>{value}</div>
        <div style={{ color: "#484f58", fontSize: 10, marginTop: 1 }}>{label}</div>
    </div>
);