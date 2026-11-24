import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Zap, 
  Sun, 
  Cpu, 
  BarChart3, 
  BrainCircuit, 
  Wallet, 
  Trophy, 
  Building2, 
  Settings, 
  X
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  tag?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { energyCredits, balanceWh } = useSimulation();

  const navGroups: { category: string; items: NavItem[] }[] = [
    {
      category: 'MONITOR',
      items: [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/energy', label: 'Energy Monitoring', icon: Zap },
        { path: '/harvesting', label: 'PV Harvesting', icon: Sun },
        { path: '/devices', label: 'IoT Devices', icon: Cpu },
      ]
    },
    {
      category: 'INTELLIGENCE',
      items: [
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/smart-management', label: 'Smart Management', icon: BrainCircuit },
      ]
    },
    {
      category: 'VALUE',
      items: [
        { path: '/wallet', label: 'Energy Wallet', icon: Wallet, badge: `${energyCredits} EC` },
        { path: '/rewards', label: 'Harvester Rewards', icon: Trophy },
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { path: '/facility', label: 'Facility View', icon: Building2 },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-navy-950/95 backdrop-blur-xl border-r border-navy-850 w-60 text-slate-300">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-navy-850 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="ENERGENIUS" 
            className="w-8 h-8 rounded-lg object-contain bg-white/5 p-0.5 border border-emerald-500/30"
          />
          <div>
            <h2 className="font-extrabold tracking-tight text-slate-100 text-sm leading-none">
              ENERGENIUS
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 block tracking-wider uppercase mt-0.5 font-semibold">
              Energy OS
            </span>
          </div>
        </div>
        <button onClick={onMobileClose} className="lg:hidden text-slate-400 hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List grouped by Purpose */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.category} className="space-y-1">
            <div className="px-3 pt-2 pb-1 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
              {group.category}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative group cursor-pointer ${
                      isActive
                        ? 'text-slate-100 font-semibold bg-emerald-950/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="activeNavVerticalLine"
                          className="active-nav-bar"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <div className="flex items-center space-x-2.5 pl-1 z-10">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold z-10">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Quieter Live Balance Footer */}
      <div className="p-3 border-t border-navy-850">
        <div className="p-3 rounded-xl bg-navy-900/80 border border-navy-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 uppercase">Live Balance</span>
            <span className={`font-bold ${balanceWh >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {balanceWh >= 0 ? `+${balanceWh}` : balanceWh} Wh
            </span>
          </div>
          <div className="text-base font-extrabold font-mono text-slate-100">
            {energyCredits} <span className="text-xs font-normal text-slate-400">EC</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-[calc(100vh-61px)] sticky top-[61px] flex-shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative z-10 w-60 h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
