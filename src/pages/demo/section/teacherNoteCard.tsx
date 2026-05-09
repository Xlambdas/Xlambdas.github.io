import React from "react";
import { type TeacherNote } from "../data/teacherNotes";

interface TeacherNoteCardProps {
    note: TeacherNote;
    onDelete?: () => void;
    isTeacher?: boolean;
}

export const TeacherNoteCard: React.FC<TeacherNoteCardProps> = ({ note, onDelete, isTeacher }) => (
    <div style={{
        background: "rgba(124,106,247,0.06)",
        border: "1px solid rgba(124,106,247,0.2)",
        borderLeft: "3px solid #7c6af7",
        borderRadius: 8, padding: "12px 14px",
        position: "relative",
    }}>
        <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 8,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(124,106,247,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#a39af7",
                }}>
                    {note.authorName.split(" ").pop()?.[0] ?? "?"}
                </div>
                <span style={{ color: "#a39af7", fontSize: 11, fontWeight: 500 }}>
                    {note.authorName}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#484f58", fontSize: 10 }}>
                    {new Date(note.createdAt).toLocaleDateString("fr-FR", {
                        month: "short", year: "numeric"
                    })}
                </span>
                {isTeacher && onDelete && (
                    <button
                        onClick={onDelete}
                        style={{
                            background: "none", border: "none",
                            color: "#484f58", cursor: "pointer",
                            fontSize: 14, lineHeight: 1, padding: 0,
                        }}
                    >×</button>
                )}
            </div>
        </div>
        <p style={{
            color: "#8b949e", fontSize: 12, lineHeight: 1.7,
            margin: 0, fontStyle: "italic",
        }}>
            "{note.content}"
        </p>
    </div>
);