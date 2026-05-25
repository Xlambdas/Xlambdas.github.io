// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import {
    Home,
    SettingsPage,
    ProjectsPage,
    PortfolioPage,
    DemoHome
} from './pages';
import DemoGraph from './pages/demo/graphView/demoGraph';
import { LessonPage, NodePage, ProfilePage, StrengthenSessionPage } from './pages/demo/pages';
import { FullSessionPage } from './pages/demo/pages/fullSessionPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/demoHome" element={<DemoHome />} />
                {/* demo routes */}
                <Route path="/demoGraph" element={<DemoGraph />} />
                <Route path="/demo/node/:nodeId" element={<NodePage />} />
                <Route path="/demo/lesson/:nodeId/:lessonId" element={<LessonPage />} />
                <Route path="/demo/profile" element={<ProfilePage />} />
                <Route path="/demo/strengthen" element={<StrengthenSessionPage />} />
                <Route path="/demo/full-session" element={<FullSessionPage />} />
                {/* <Route path="/demo/strengthen/:nodeId" element={<StrengthPage />} /> */}
            </Routes>
        </Router>
    )
}

export default App
