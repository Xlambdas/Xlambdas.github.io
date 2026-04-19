// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsPage } from './pages/settings';
import { ProjectsPage } from './pages/projects';
import { PortfolioPage } from './pages/portfolio';
import { Home } from './components';

function App() {
    return (
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
      </Router>
    )
}

export default App
