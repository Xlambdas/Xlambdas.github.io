// src/projects/data/projectsData.ts
import { type Project } from "../components";
import GOLImage from "/img/GOL_playerPage.png";

export const projects: Project[] = [
    {
        id: 1,
        title: "Game Of Life",
        subtitle: "Obsidian Plugin",
        description: `A modern web extension built with React and Node.js. Plugin for the application '© Obsidian'. \n\nTrack quests, earn levels, and gamify your existence inside Obsidian. \nBuilt for those who seek mastery...`,
        status: "soon-release",
        link:"https://github.com/Xlambdas/Game-of-life-obsi-plugin-",
        img: GOLImage,
    },
    {
        id: 2,
        title: "Cognitive Science DB",
        subtitle: "Knowledge Exploration",
        description: "Cognitive Science Database, and learning environment. \n\nCognitive science explores the nature of thought, learning, and mental organization, drawing from psychology, neuroscience, artificial intelligence, philosophy, linguistics, and anthropology. \nIt seeks to understand how information is processed and represented in the mind and brain, aiming to unravel the complexities of human cognition and behavior.",
        status: "paused",
    },
    {
        id: 3,
        title: "Upcoming Unity Project",
        subtitle: "Unity Game",
        description: "A full project on Unity. But no spoilers, you'll find out soon!",
        status: "started",
    },
];