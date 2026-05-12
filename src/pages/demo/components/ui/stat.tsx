interface StatProps {
    value: number | string;
    label: string;
}

export const Stat: React.FC<StatProps> = ({ value, label }) => (
    <div style={{ flex: 1, textAlign: "center", padding: "2px 0" }}>
        <div style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 600 }}>{value}</div>
        <div style={{ color: "#484f58", fontSize: 9, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
);