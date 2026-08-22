# XLS.studio

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Deployed](https://img.shields.io/badge/Deployed-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)

> Personal portfolio and creative studio — built at the intersection of design, code, and cognitive science.

**Live →** [xls-studio](http://xls-studio.com/)

---

## Overview

XLS.studio is a handcrafted portfolio that reflects a precise design philosophy: clarity, depth, and intention. Every component — from the file-tree sidebar to the SVG Gantt timeline — is a deliberate decision, not a template.

The site is fully translated into **5 languages** (EN, FR, ES, DE, IT) via a type-safe nested translation system, accessible, and responsive across all screen sizes. It is designed to speak equally to recruiters looking for strong UI/UX sensibility and to developers who appreciate clean architecture.

---

## Features

- **Multi-language support** — EN, FR, ES, DE, IT; type-safe nested translation system with a single source of truth per locale
- **File-tree sidebar** — resizable (250–500px), collapsible, `localStorage` persistence, smooth transitions, full keyboard accessibility
- **Gantt timeline** — SVG-based with period filters (1 yr / 3 yrs / 5 yrs / all), entry type color-coding, click-to-lock hover state, sub-month date precision, and type-based lane assignment (education above / everything else below)
- **Skills accordion** — 5 categories × 3 subcategories × 4–5 skills each, fully translatable, responsive 1→2→3→4 column grid
- **Values cards** — quote-face on idle, title + description revealed on click; click outside to dismiss
- **Interests grid** — responsive, translation-driven, zero hardcoded content
- **Contact section** — email, LinkedIn, GitHub links from translations
- **Responsive** — mobile-first, tested from 320px to 1920px
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, `prefers-reduced-motion` respected
- **Theme system** — CSS variables for colors, fonts, and spacing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + CSS Variables |
| Build tool | Vite 5 |
| Routing | React Router v6 |
| Icons | Lucide React |
| State | React Hooks — `useState`, `useRef`, `useEffect`, `useMemo`, `useCallback` |
| Persistence | `localStorage` (sidebar preferences) |
| Deployment | GitHub Pages |

---

## Project Structure

<!-- To regenerate this tree from the real `src/` folder at any time:

```bash
npm run docs:structure
``` -->

```
src/
├── App.tsx
├── main.tsx
├── assets/
│   └── react.svg
├── components/
│   ├── index.ts
│   ├── common/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── Button/
│   │   │   └── Button.tsx
│   │   ├── Carousel/
│   │   │   └── Carousel.tsx
│   │   └── LoadingIndicator/
│   │       └── LoadingIndicator.tsx
│   └── Header/
│       ├── Header.tsx
│       ├── index.ts
│       ├── MenuIcon.tsx
│       └── types.ts
├── constants/
│   └── home.config.ts
├── context/
│   └── themeContext.tsx
├── lib/
│   └── utils.ts
├── locales/
│   ├── components.ts
│   ├── header.ts
│   ├── home.ts
│   ├── index.ts
│   ├── portfolio.ts
│   ├── projects.ts
│   └── settings.ts
├── pages/
│   ├── index.ts
│   ├── demo/
│   │   ├── DemoHome.tsx
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── feedbackBtn.tsx
│   │   │   ├── index.ts
│   │   │   ├── projectInfoBtn.tsx
│   │   │   ├── settings.tsx
│   │   │   ├── lessons/
│   │   │   │   ├── blockRenderer.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── lessonProgressBar.tsx
│   │   │   │   ├── quizBlockPlayer.tsx
│   │   │   │   ├── quizInteraction.tsx
│   │   │   │   └── quizPlayer.tsx
│   │   │   ├── node/
│   │   │   │   ├── index.ts
│   │   │   │   ├── nodeCard.tsx
│   │   │   │   └── NodePathSettings.tsx
│   │   │   └── ui/
│   │   │       ├── BottomActions.tsx
│   │   │       ├── dock.tsx
│   │   │       ├── dockFooter.tsx
│   │   │       ├── honeyCombPath.tsx
│   │   │       ├── sidebar.tsx
│   │   │       └── TopBar.tsx
│   │   ├── constants/
│   │   │   ├── config.ts
│   │   │   ├── graph.ts
│   │   │   ├── index.ts
│   │   │   ├── lessons.ts
│   │   │   ├── nodes.ts
│   │   │   ├── profile.ts
│   │   │   ├── quiz.ts
│   │   │   └── icons/
│   │   │       ├── icons.tsx
│   │   │       ├── nodeIcons.tsx
│   │   │       ├── profileIcons.tsx
│   │   │       └── statusIcons.tsx
│   │   ├── data/
│   │   │   ├── dataHelpers.ts
│   │   │   ├── funFacts.ts
│   │   │   ├── graphData.ts
│   │   │   ├── index.ts
│   │   │   ├── teacherNotes.ts
│   │   │   └── nodes/
│   │   │       ├── attention.ts
│   │   │       ├── index.ts
│   │   │       ├── longTermMemory.ts
│   │   │       ├── memory.ts
│   │   │       ├── neurosciences.ts
│   │   │       ├── profile.ts
│   │   │       ├── psychology.ts
│   │   │       └── workingMemory.ts
│   │   ├── graphView/
│   │   │   ├── demoGraph.tsx
│   │   │   ├── graphLegend.tsx
│   │   │   └── legend.tsx
│   │   ├── helpers/
│   │   │   ├── daily.ts
│   │   │   ├── graph.ts
│   │   │   ├── index.ts
│   │   │   ├── nodes.ts
│   │   │   ├── profile.ts
│   │   │   ├── quiz.ts
│   │   │   └── sessionBuilder.ts
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── useDemoHomeState.ts
│   │   │   ├── useLessonFlow.ts
│   │   │   ├── useLessonTextSize.ts
│   │   │   └── useSearchSuggestion.ts
│   │   ├── pages/
│   │   │   ├── constructionPage.tsx
│   │   │   ├── fullSessionPage.tsx
│   │   │   ├── index.ts
│   │   │   ├── LessonPage.tsx
│   │   │   ├── NodePage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ProjectInfoPage.tsx
│   │   │   ├── StrengthenSessionPage.tsx
│   │   │   └── modals/
│   │   │       ├── explanationModal.tsx
│   │   │       ├── feedbackModal.tsx
│   │   │       ├── funFactModal.tsx
│   │   │       ├── index.ts
│   │   │       ├── moodModal.tsx
│   │   │       ├── ProfileNodeModal.tsx
│   │   │       ├── strengthenModal.tsx
│   │   │       └── teacherLoginModal.tsx
│   │   ├── sections/
│   │   │   ├── teacherNoteCard.tsx
│   │   │   └── teacherNoteEditor.tsx
│   │   ├── tutorial/
│   │   │   ├── tutorialHelpers.ts
│   │   │   └── tutorialOverlay.tsx
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── nodes.ts
│   │   │   ├── props.ts
│   │   │   ├── types.ts
│   │   │   └── window.d.ts
│   │   └── utils/
│   │       └── srEngine.ts
│   ├── home/
│   │   ├── Home.tsx
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── index.ts
│   │   │   ├── ScrollContainer.tsx
│   │   │   └── Section.tsx
│   │   ├── constants/
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── usePerformanceMonitor.ts
│   │   │   ├── useScrollNavigation.ts
│   │   │   ├── useSnapScroll.ts
│   │   │   ├── useSplineSetup.ts
│   │   │   └── useTouchNavigation.ts
│   │   ├── sections/
│   │   │   ├── AboutSection.tsx
│   │   │   ├── index.ts
│   │   │   ├── SandboxSection.tsx
│   │   │   └── WelcomeSection.tsx
│   │   └── utils/
│   │       ├── canvas.ts
│   │       ├── dpr.ts
│   │       ├── index.ts
│   │       ├── spline.ts
│   │       └── splineColors.ts
│   ├── portfolio/
│   │   ├── index.ts
│   │   ├── PortfolioPage.tsx
│   │   ├── components/
│   │   │   └── SideNavigator.tsx
│   │   ├── constants/
│   │   │   ├── index.ts
│   │   │   ├── props.ts
│   │   │   └── types.ts
│   │   ├── helpers/
│   │   │   └── timelineHelpers.ts
│   │   └── sections/
│   │       ├── About.tsx
│   │       ├── Contact.tsx
│   │       ├── Hero.tsx
│   │       ├── index.ts
│   │       ├── Interests.tsx
│   │       ├── Skills.tsx
│   │       ├── Timeline.tsx
│   │       └── Values.tsx
│   ├── projects/
│   │   ├── index.ts
│   │   ├── ProjectsPage.tsx
│   │   ├── components/
│   │   │   ├── index.ts
│   │   │   ├── ProjectCard.tsx
│   │   │   └── types.ts
│   │   └── data/
│   │       └── projectsData.ts
│   └── settings/
│       ├── index.ts
│       ├── SettingPage.tsx
│       ├── components/
│       │   ├── index.ts
│       │   └── LivePreview.tsx
│       ├── constants/
│       │   ├── constants.ts
│       │   ├── index.ts
│       │   └── types.ts
│       ├── hooks/
│       │   └── useSettingsHandlers.ts
│       ├── panels/
│       │   ├── ColorsPanel.tsx
│       │   ├── index.ts
│       │   ├── LanguagePanel.tsx
│       │   ├── MotionPanel.tsx
│       │   ├── SizesPanel.tsx
│       │   └── TypographyPanel.tsx
│       └── utils/
│           ├── index.ts
│           └── panelHelpers.ts
├── styles/
│   ├── components.css
│   ├── globals.css
│   ├── index.ts
│   ├── tokens.ts
│   └── utils.ts
└── theme/
    ├── index.ts
    ├── theme.defaults.ts
    ├── theme.options.ts
    └── theme.types.ts
```

---

## Key Architecture Decisions

**All content lives in translation files.** No hardcoded strings in components. Skills, interests, values, timeline entries, ARIA labels — everything is driven by the `t` object. Adding a new language or updating content never requires touching component code.

**Type-safe translations.** The `PortfolioTranslations` interface in `types.ts` is the contract between data and UI. TypeScript enforces completeness across all 5 locales at compile time.

**SVG for the timeline.** The Gantt chart is a hand-authored SVG coordinate system with an HTML overlay for interactivity. This gives pixel-level control over the visual without a charting library dependency. Lane assignment is greedy; above/below split is controlled by a single constant:

```typescript
// Timeline.tsx — change this to move a type to the other side of the axis
const ABOVE_TYPES = new Set<EntryType>(['education']);
```

**Timeline date format.** Entries accept `"YYYY"`, `"YYYY-MM"`, or `"YYYY-MM-DD"`. Day-level precision snaps to start / middle / end of month on the axis. `startDate` is optional — omitting it renders a diamond point instead of a bar.

```typescript
// Range
{ startDate: "2021-09", endDate: "2026-01", type: "education", title: "...", description: "..." }

// Single-point event
{ endDate: "2021-06", type: "education", title: "...", description: "..." }
```

---

## Design System

All visual tokens are CSS variables, making theme changes a single-file edit:

| Variable | Role |
|---|---|
| `--color-primary` | Text, borders, SVG strokes |
| `--color-primary-transparent` | Subtle borders, dividers |
| `--color-background` | Page and tooltip backgrounds |
| `--color-secondary` | Card surfaces |
| `--font-primary` | Display font — italic headings, quotes |
| `--font-secondary` | Body font — labels, descriptions, UI text |

---

## License

MIT License — see [LICENSE](./LICENSE.md)

© 2026 XLS.studio — All rights reserved.
