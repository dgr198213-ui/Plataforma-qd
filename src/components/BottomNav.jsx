import { Home, Folder, Construction, Settings } from 'lucide-react';

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

const BottomNav = ({ currentModule, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1816] border-t border-white/5 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center px-2">
        <button
          onClick={() => onNavigate(MODULES.DASHBOARD)}
          className={`flex flex-col items-center gap-1 p-2 ${
            currentModule === MODULES.DASHBOARD ? 'text-[#13ecc8]' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => onNavigate(MODULES.PROJECTS)}
          className={`flex flex-col items-center gap-1 p-2 ${
            currentModule === MODULES.PROJECTS ? 'text-[#13ecc8]' : 'text-gray-400'
          }`}
        >
          <Folder size={24} />
          <span className="text-xs font-medium">Projects</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <Construction size={24} />
          <span className="text-xs font-medium">Tools</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <Settings size={24} />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
