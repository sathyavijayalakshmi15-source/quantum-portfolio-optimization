import React from 'react';
import { 
  Cpu, 
  BarChart3, 
  Globe, 
  Activity, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  PieChart as PieChartIcon, 
  GitCompare, 
  BookOpen,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isBackendConnected }) => {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Cpu },
    { id: 'optimizer', label: 'Optimizer', icon: Sliders },
    { id: 'universe', label: 'Stock Universe', icon: Globe },
    { id: 'simulation', label: 'Quantum Simulation', icon: Activity },
    { id: 'circuit', label: 'Circuit Viewer', icon: Layers },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'frontier', label: 'Efficient Frontier', icon: TrendingUp },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: PieChartIcon },
    { id: 'comparison', label: 'Comparison', icon: GitCompare },
    { id: 'user-guide', label: 'User Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-glow-cyan">
              <div className="w-full h-full bg-[#090D16] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                Q-Optima
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-cyan-400 font-mono">
                Qiskit QAOA Engine
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Status Badge */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-surface-border text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBackendConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                {isBackendConnected ? 'FastAPI + Qiskit' : 'Simulated Engine'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Nav Scroll View */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-surface-border space-x-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
