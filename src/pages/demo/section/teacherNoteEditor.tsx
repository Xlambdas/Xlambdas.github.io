import React, { useState } from "react";
import { type TeacherNote, saveNote } from "../data/teacherNotes";

interface TeacherNoteEditorProps {
    nodeId: string;
    nodeTitle: string;
    authorName: string;
    existingNote?: TeacherNote;
    onSave: () => void;
    onCancel: () => void;
}

export const TeacherNoteEditor: React.FC<TeacherNoteEditorProps> = ({
    nodeId, nodeTitle, authorName, existingNote, onSave, onCancel,
}) => {
    const [content, setContent] = useState(existingNote?.content ?? "");

    const handleSave = () => {
        if (content.trim().length === 0) return;
        saveNote({
            nodeId,
            authorName,
            content: content.trim(),
            createdAt: new Date().toISOString().split("T")[0],
        });
        onSave();
    };

    return (
        <div style={{
            background: "rgba(124,106,247,0.06)",
            border: "1px solid rgba(124,106,247,0.25)",
            borderRadius: 10, padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: 10,
        }}>
            <span style={{ color: "#a39af7", fontSize: 11, fontWeight: 500 }}>
                {existingNote ? "Modifier la note" : `Ajouter une note sur "${nodeTitle}"`}
            </span>
            <textarea
                autoFocus
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Ce que je veux que les étudiants retiennent de ce concept, ce que les manuels ne disent pas, une anecdote de recherche..."
                style={{
                    background: "#0d1117", border: "1px solid #30363d",
                    borderRadius: 8, padding: "12px 14px",
                    color: "#c9d1d9", fontSize: 12,
                    resize: "none", outline: "none",
                    minHeight: 100, lineHeight: 1.7,
                    fontFamily: "inherit", width: "100%",
                    boxSizing: "border-box",
                }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                    onClick={onCancel}
                    style={{
                        padding: "7px 14px", background: "transparent",
                        border: "1px solid #30363d", color: "#6e7681",
                        borderRadius: 7, fontSize: 11, cursor: "pointer",
                    }}
                >Annuler</button>
                <button
                    onClick={handleSave}
                    disabled={content.trim().length === 0}
                    style={{
                        padding: "7px 14px",
                        background: content.trim().length > 0
                            ? "rgba(124,106,247,0.2)" : "#21262d",
                        border: `1px solid ${content.trim().length > 0
                            ? "rgba(124,106,247,0.5)" : "#30363d"}`,
                        color: content.trim().length > 0 ? "#a39af7" : "#484f58",
                        borderRadius: 7, fontSize: 11, fontWeight: 500,
                        cursor: content.trim().length > 0 ? "pointer" : "not-allowed",
                    }}
                >Enregistrer</button>
            </div>
        </div>
    );
};