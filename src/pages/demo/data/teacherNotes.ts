export type TeacherNote = {
    nodeId: string;
    authorName: string;
    content: string;
    createdAt: string;
};

// Pre-seeded demo notes so professors see the vision immediately
export const DEFAULT_NOTES: TeacherNote[] = [
    {
        nodeId: "A",
        authorName: "Prof. Lemaire",
        content: "Ce que les manuels ne disent pas sur la mémoire de travail : la limite de 7 est une moyenne qui cache une variance énorme entre individus. J'ai passé 4 ans à étudier ces différences interindividuelles. Ce qui est stable, c'est la structure — pas le chiffre.",
        createdAt: "2026-03-12",
    },
    {
        nodeId: "I",
        authorName: "Prof. Rousseau",
        content: "L'effet de test est selon moi le résultat le plus sous-exploité de toute la psychologie cognitive appliquée à l'éducation. Nous le savons depuis 1909 (Gates). Un siècle plus tard, la plupart des étudiants relisent encore leurs cours. C'est un problème de transmission, pas de connaissance.",
        createdAt: "2026-04-01",
    },
];

const STORAGE_KEY = "teacher_notes";

export const getNotes = (): TeacherNote[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        // seed with defaults on first load
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
        return DEFAULT_NOTES;
    }
    return JSON.parse(raw);
};

export const getNotesForNode = (nodeId: string): TeacherNote[] =>
    getNotes().filter(n => n.nodeId === nodeId);

export const saveNote = (note: TeacherNote): void => {
    const notes = getNotes().filter(
        n => !(n.nodeId === note.nodeId && n.authorName === note.authorName)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...notes, note]));
};

export const deleteNote = (nodeId: string, authorName: string): void => {
    const notes = getNotes().filter(
        n => !(n.nodeId === nodeId && n.authorName === authorName)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const TEACHER_PASSWORD = "miashsbdx2026";