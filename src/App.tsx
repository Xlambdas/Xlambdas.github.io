// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsPage } from './pages/settings';
import { ProjectsPage } from './pages/projects';
import { PortfolioPage } from './pages/portfolio';
import { DemoHome } from './pages/demo';
import { Home } from './components';
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
            </Routes>
        </Router>
    )
}

export default App
