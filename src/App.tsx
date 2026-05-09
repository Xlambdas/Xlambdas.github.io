// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsPage } from './pages/settings';
import { ProjectsPage } from './pages/projects';
import { PortfolioPage } from './pages/portfolio';
import { DemoHome } from './pages/demo';
import { Home } from './components';
import DemoGraph from './pages/demo/graphView/demoGraph';


function App() {
    return (
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/demoHome" element={<DemoHome />} />
            <Route path="/demoGraph" element={<DemoGraph />} />
          </Routes>
      </Router>
    )
}

export default App
