import { useState } from 'react';
import Dashboard from './components/Dashboard';
import CredentialsPanel from './components/CredentialsPanel';
import CodeEditor from './components/CodeEditor';
import NoCodeChat from './components/NoCodeChat';
import Connectors from './components/Connectors';
import ProjectsManager from './components/ProjectsManager';
import BiasFirewall from './components/BiasFirewall';
import HypeDetector from './components/HypeDetector';
import SolveItIterator from './components/SolveItIterator';
import BottomNav from './components/BottomNav';

const MODULES = {
  DASHBOARD: 'dashboard',
  CREDENTIALS: 'credentials',
  CODE_EDITOR: 'code_editor',
  NO_CODE_CHAT: 'no_code_chat',
  CONNECTORS: 'connectors',
  PROJECTS: 'projects',
  BIAS_FIREWALL: 'bias_firewall',
  HYPE_DETECTOR: 'hype_detector',
  SOLVEIT: 'solveit'
};

export default function App() {
  const [currentModule, setCurrentModule] = useState(MODULES.DASHBOARD);

  const renderModule = () => {
    switch (currentModule) {
      case MODULES.DASHBOARD:
        return <Dashboard onNavigate={setCurrentModule} />;
      case MODULES.CREDENTIALS:
        return <CredentialsPanel onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.CODE_EDITOR:
        return <CodeEditor onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.NO_CODE_CHAT:
        return <NoCodeChat onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.CONNECTORS:
        return <Connectors onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.PROJECTS:
        return <ProjectsManager onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.BIAS_FIREWALL:
        return <BiasFirewall onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.HYPE_DETECTOR:
        return <HypeDetector onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.SOLVEIT:
        return <SolveItIterator onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      default:
        return <Dashboard onNavigate={setCurrentModule} />;
    }
  };

  return (
    <div className="bg-[#10221f] min-h-screen">
      {renderModule()}
      <BottomNav currentModule={currentModule} onNavigate={setCurrentModule} />
    </div>
  );
}
