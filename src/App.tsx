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
import { NodePage } from './pages/demo/components/node/NodePage';
import { LessonPage } from './pages/demo/components/lessons/lessonPage';


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
                {/* <Route path="/demo/strengthen" element={<StrengthPage />} />
                <Route path="/demo/strengthen/:nodeId" element={<StrengthPage />} /> */}
            </Routes>
        </Router>
    )
}

export default App
