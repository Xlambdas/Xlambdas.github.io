// src/App.tsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
    Home,
    SettingsPage,
    ProjectsPage,
    PortfolioPage,
    SandboxPage,
    DemoHome
} from './pages';
import DemoGraph from './pages/demo/graphView/demoGraph';
import RoutineDetailPage from './pages/poise/pages/RoutineDetailPage';
import {
    LessonPage,
    NodePage,
    // ProfilePage,
    StrengthenSessionPage,
    FullSessionPage,
    ProjectInfoPage,
    ConstructionPage
} from './pages/demo/pages';

import TrombiPage from './pages/trombi/TrombiPage';
import {
    BivouacPage, TripPage,
    TripsPage, TemplatesPage,
    TemplateEditorPage, CategoryTemplatePage
} from './pages/bivouac';
import {
    BodyLayout, TodayPage,
    CalendarPage, ExercisesPage,
    RoutinesPage, ExerciseDetailPage,
    ExerciseFormPage, SessionFormPage,
    SessionDetailPage, SessionsPage,
    GuidedSessionPage,
    GuidedRoutinePage,
    RoutineFormPage,
    PreferencesPage
} from './pages/poise';


function App() {
    return (
        <Router>
            <Routes>
                {/* -- general -- */}
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/demoHome" element={<DemoHome />} />
                {/* -- sandbox -- */}
                <Route path="/sandbox" element={<SandboxPage />} />
                <Route path="/p/nt8k2" element={<TrombiPage />} />
                {/* Bivouac */}
                <Route path="/sandbox/bivouac" element={<BivouacPage />} />
                <Route path="/sandbox/bivouac/trip" element={<TripPage />} />
                <Route path="/sandbox/bivouac/trips" element={<TripsPage />} />
                <Route path="/sandbox/bivouac/templates" element={<TemplatesPage />} />
                <Route path="/sandbox/bivouac/templates/:category" element={<CategoryTemplatePage />} />
                <Route path="/sandbox/bivouac/templates/:category/:templateId" element={<TemplateEditorPage />} />
                {/* Poise */}
                <Route path="/sandbox/poise" element={<Navigate to="/sandbox/poise/today" replace />} />
                <Route path="/sandbox/poise" element={<BodyLayout />}>
                    <Route path="today" element={<TodayPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="exercises" element={<ExercisesPage />} />
                    <Route path="exercises/new" element={<ExerciseFormPage />} />
                    <Route path="exercises/:id" element={<ExerciseDetailPage />} />
                    <Route path="exercises/:id/edit" element={<ExerciseFormPage />} />
                    <Route path="sessions" element={<SessionsPage />} />
                    <Route path="sessions/new" element={<SessionFormPage />} />
                    <Route path="sessions/:id" element={<SessionDetailPage />} />
                    <Route path="sessions/:id/edit" element={<SessionFormPage />} />
                    <Route path="sessions/:id/go" element={<GuidedSessionPage />} />
                    <Route path="routines" element={<RoutinesPage />} />
                    <Route path="routines/new" element={<RoutineFormPage />} />
                    <Route path="routines/:id" element={<RoutineDetailPage />} />
                    <Route path="routines/:id/go/:variantId" element={<GuidedRoutinePage />} />
                    <Route path="routines/:id/edit" element={<RoutineFormPage />} />
                    <Route path="preferences" element={<PreferencesPage />} />
                </Route>

                {/* -- demo routes -- */}
                <Route path="/demoGraph" element={<DemoGraph />} />
                <Route path="/demo/node/:nodeId" element={<NodePage />} />
                <Route path="/demo/lesson/:nodeId/:lessonId" element={<LessonPage />} />
                {/* <Route path="/demo/profile" element={<ProfilePage />} /> */}
                <Route path="/demo/strengthen" element={<StrengthenSessionPage />} />
                <Route path="/demo/full-session" element={<FullSessionPage />} />
                <Route path="/demo/project-info" element={<ProjectInfoPage />} />
                <Route path="*" element={<ConstructionPage />} />
            </Routes>
        </Router>
    )
}

export default App
