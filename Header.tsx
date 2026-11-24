import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  Settings,
  SlidersHorizontal,
  LogOut,
  Sliders
} from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const Header: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-xl border-b border-navy-850 px-4 lg:px-6 py-2.5 flex items-center justify-between">
        {/* Left Section: Mobile Menu + ENERGENIUS Branding */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button 
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-navy-900 focus:outline-none transition-colors"
            title="Toggle Navigation Menu"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="ENERGENIUS" 
              className="w-8 h-8 rounded-lg object-contain bg-white/5 p-0.5 border border-emerald-500/30"
            />
            <div>
              <h1 className="font-extrabold tracking-tight text-slate-100 text-sm leading-none flex items-center gap-1.5">
                ENERGENIUS
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">
                Energy OS
              </p>
            </div>
          </div>
        </div>

        {/* Center Section: Context Title (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Context:</span>
          <span className="font-bold text-slate-200 uppercase tracking-wider">Indoor Energy Intelligence</span>
        </div>

        {/* Right Section: SIMULATION MODE + Quick Search + Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Prominent SIMULATION MODE Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-navy-900 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SIMULATION MODE</span>
          </div>

          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-2 bg-navy-900 hover:bg-navy-850 border border-navy-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 transition-all cursor-pointer"
            title="Search dashboard parameters"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-slate-300">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-navy-950 text-slate-400 border border-navy-800">⌘K</kbd>
          </button>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 pl-3 border-l border-navy-850 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
              title="User Account"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span>Alex Vance</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </button>

            {/* Profile Menu Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn">
                {/* User Card Header */}
                <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      AV
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">Alex Vance</h4>
                      <p className="text-[10px] font-mono text-cyan-400">Node Admin &bull; Facility A</p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Role: Admin
                    </span>
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>

                {/* Profile Quick Links */}
                <div className="space-y-1 text-xs">
                  <button 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-navy-800 hover:text-cyan-300 transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>Facility Preferences</span>
                  </button>

                  <button 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-navy-800 hover:text-cyan-300 transition-colors text-left cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <span>Harvesting Calibration</span>
                  </button>
                </div>

                {/* Footer Sign Out */}
                <div className="mt-2 pt-2 border-t border-navy-800">
                  <button 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left text-xs font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Command Palette Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
