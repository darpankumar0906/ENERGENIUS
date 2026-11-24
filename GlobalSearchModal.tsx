import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Zap, 
  Cpu, 
  LayoutDashboard, 
  Wallet, 
  Building2, 
  BarChart3, 
  BrainCircuit, 
  Settings, 
  X,
  ChevronRight,
  Sun
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pvUnits, devices } = useSimulation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pages = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, category: 'Page' },
    { name: 'Energy Monitoring', path: '/energy', icon: Zap, category: 'Page' },
    { name: 'PV Harvesting Units', path: '/harvesting', icon: Sun, category: 'Page' },
    { name: 'IoT Load Devices Fleet', path: '/devices', icon: Cpu, category: 'Page' },
    { name: 'Industrial Analytics', path: '/analytics', icon: BarChart3, category: 'Page' },
    { name: 'Smart Energy Optimizer', path: '/smart-management', icon: BrainCircuit, category: 'Page' },
    { name: 'Verified Energy Wallet', path: '/wallet', icon: Wallet, category: 'Page' },
    { name: '2D Facility View', path: '/facility', icon: Building2, category: 'Page' },
    { name: 'System Settings & Controls', path: '/settings', icon: Settings, category: 'Page' },
  ];

  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredPvs = pvUnits.filter(p => p.id.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()));
  const filteredDevs = devices.filter(d => d.id.toLowerCase().includes(query.toLowerCase()) || d.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        
        {/* Search Input Header */}
        <div className="p-4 border-b border-navy-800 flex items-center space-x-3 bg-navy-950/60">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search PV sticker nodes, IoT devices, pages... (ESC to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-sans"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs font-mono">
          
          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">Navigation Pages</div>
              <div className="space-y-1">
                {filteredPages.map(page => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-navy-800 hover:text-cyan-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-slate-200">{page.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PV Nodes */}
          {filteredPvs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">PV Harvesting Array Nodes</div>
              <div className="space-y-1">
                {filteredPvs.slice(0, 5).map(pv => (
                  <button
                    key={pv.id}
                    onClick={() => handleSelect(`/harvesting/${pv.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-navy-800 hover:text-cyan-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="font-bold text-cyan-300">{pv.id}</span>
                        <span className="text-[10px] text-slate-400 font-sans ml-2">{pv.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">{pv.powerMw} mW</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IoT Devices */}
          {filteredDevs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1.5">IoT Load Devices</div>
              <div className="space-y-1">
                {filteredDevs.slice(0, 5).map(dev => (
                  <button
                    key={dev.id}
                    onClick={() => handleSelect(`/devices/${dev.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-navy-800 hover:text-cyan-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="font-bold text-slate-200">{dev.id}</span>
                        <span className="text-[10px] text-slate-400 font-sans ml-2">{dev.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400">{dev.powerConsumptionMw} mW</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredPvs.length === 0 && filteredDevs.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono">
              No matching PV units, devices or pages found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-navy-950 border-t border-navy-800 text-[10px] text-slate-500 font-mono flex justify-between items-center">
          <span>ENERGY OS Command Palette</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
