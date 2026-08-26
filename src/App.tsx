// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import {
    Home,
    SettingsPage,
    ProjectsPage,
    PortfolioPage,
    SandboxPage,
    DemoHome
} from './pages';
import DemoGraph from './pages/demo/graphView/demoGraph';
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
import { BivouacPage, TripPage, TripsPage, TemplatesPage, TemplateEditorPage, CategoryTemplatePage } from './pages/bivouac';

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
