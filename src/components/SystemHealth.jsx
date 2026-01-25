// src/components/SystemHealth.jsx
import { useCodeStore } from '../store/codeStore';

export const SystemHealth = () => {
  const store = useCodeStore();

  const checks = {
    monacoEditor: !!window.monaco,
    zustandStore: !!store,
    encryption: !!import.meta.env.VITE_ENCRYPTION_KEY,
    localStorage: typeof Storage !== 'undefined'
  };

  return (
    <div className="p-4 bg-[#192233] rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4">System Health Check</h3>
      <div className="space-y-2">
        {Object.entries(checks).map(([key, ok]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span>{ok ? '✅' : '❌'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
