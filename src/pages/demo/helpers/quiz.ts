
import type { QuizQuestion } from "../types";

export const getQuizTypeLabel = (type: QuizQuestion["type"]): string => {
    const labels: Record<QuizQuestion["type"], string> = {
        multiple_choice: "Choix multiple",
        true_false: "Vrai ou Faux",
        ordering: "Ordre",
        match_pairs: "Association",
        word_bank: "Compléter",
        sentence: "Réponse libre",
    };
    return labels[type];
};

export const checkAnswer = (question: QuizQuestion, answer: any): boolean => {
    switch (question.type) {
        case "multiple_choice":
            return answer === question.correctIndex;
        case "true_false":
            return answer === question.correct;
        case "ordering":
            return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
        case "match_pairs":
            return Object.entries(answer as Record<number, number>).every(
                ([left, right]) => question.pairs[parseInt(left)].right === question.pairs[right].right
            );
        case "word_bank":
            return JSON.stringify(answer) === JSON.stringify(question.correctWords);
        case "sentence":
            return false; // Sentence is always marked as "needs review"
        default:
            return false;
    }
};

export const md = (text: string) =>
    text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .split("\n\n")
        .map(p => `<p style="margin:0 0 14px 0;line-height:1.85">${p}</p>`)
        .join("");