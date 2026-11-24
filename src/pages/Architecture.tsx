import React from 'react';
import { 
  Network, 
  Sun, 
  Zap, 
  Shield, 
  BatteryCharging, 
  Cpu, 
  Radio, 
  BrainCircuit, 
  Wallet, 
  Trophy, 
  Repeat, 
  ArrowRight,
  Database,
  Monitor,
  Server
} from 'lucide-react';

export const Architecture: React.FC = () => {
  const currentPrototypeFlow = [
    { title: 'Python Virtual Hardware', sub: 'Indoor PV Simulation Model (VNODE-001)', icon: Cpu, color: 'text-cyan-400', bg: 'border-cyan-500/30' },
    { title: 'Virtual Telemetry Flux', sub: 'Voltage (V), Current (A), Light (Lux)', icon: Zap, color: 'text-amber-400', bg: 'border-amber-500/30' },
    { title: 'Local FastAPI Engine', sub: 'REST Ingestion & Physics Engine (Port 8001)', icon: Server, color: 'text-emerald-400', bg: 'border-emerald-500/30' },
    { title: 'React Energy OS', sub: 'Autonomous Industrial Control Center', icon: Monitor, color: 'text-purple-400 shadow-energy', bg: 'border-purple-500/30' },
  ];

  const futurePhysicalFlow = [
    { title: 'Artificial Light', sub: 'Overhead LED Fixtures', icon: Sun },
    { title: 'Indoor PV Cells', sub: 'Flexible OPV / Perovskite', icon: Sun },
    { title: 'MPPT Power Mgmt', sub: 'Low Quiescent PMIC', icon: Shield },
    { title: 'Supercap / Storage', sub: 'Hybrid LiFePO4', icon: BatteryCharging },
    { title: 'ESP32 Nodes', sub: 'On-chip Sensors', icon: Radio },
    { title: 'IoT Backend', sub: 'FastAPI Telemetry', icon: Database },
    { title: 'ENERGY OS', sub: 'Central Control', icon: BrainCircuit },
  ];

  const controlFlow = [
    { title: 'ENERGY OS', icon: BrainCircuit },
    { title: 'MEASURE', icon: Zap },
    { title: 'ANALYZE', icon: Network },
    { title: 'PREDICT', icon: Shield },
    { title: 'OPTIMIZE', icon: Cpu },
    { title: 'CONTROL', icon: Radio },
  ];

  const creditFlow = [
    { title: 'Verified Energy', icon: Shield },
    { title: 'Wallet (1 EC = 0.1 Wh)', icon: Wallet },
    { title: 'Rewards', icon: Trophy },
    { title: 'Future P2P Concept', icon: Repeat },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      {/* Header */}
      <div className="glass-card p-5 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">ENERGY OS Platform & Hardware Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Local software validation pipeline and future physical hardware integration roadmap.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-navy-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          Current Prototype: <strong>Local Python Virtual Hardware</strong>
        </div>
      </div>

      {/* 1. CURRENT PROTOTYPE ARCHITECTURE */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            1. Current Working Prototype Architecture (Local Machine)
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            ACTIVE PROTOTYPE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
          {currentPrototypeFlow.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className={`p-4 rounded-xl bg-navy-900/90 border ${step.bg} flex flex-col justify-between space-y-3 relative group hover:border-cyan-400 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">LAYER 0{idx + 1}</span>
                  <Icon className={`w-5 h-5 ${step.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-100">{step.title}</h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FUTURE PHYSICAL IMPLEMENTATION ROADMAP */}
      <div className="glass-card p-6 rounded-2xl border border-navy-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            2. Future Physical Hardware Implementation Diagram
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold">
            FUTURE HARDWARE ROADMAP
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 py-2">
          {futurePhysicalFlow.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={idx}>
                <div className="p-3 rounded-xl bg-navy-900/80 border border-navy-700 flex flex-col space-y-1 min-w-[130px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-500">STAGE {idx + 1}</span>
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-xs font-bold text-slate-200">{item.title}</div>
                  <div className="text-[9px] font-mono text-slate-400">{item.sub}</div>
                </div>
                {idx < futurePhysicalFlow.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Closed-Loop Regulation Pipeline */}
      <div className="glass-card p-6 rounded-2xl border border-navy-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          3. Closed-Loop Optimization Pipeline
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3 py-2">
          {controlFlow.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-navy-900 border border-cyan-500/30 text-xs font-mono font-bold text-slate-100 group hover:border-cyan-400 transition-all">
                  <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{item.title}</span>
                </div>
                {idx < controlFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:block animate-pulse" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 4. Verified Energy Credit Pipeline */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          4. Verified Energy Credit Pipeline
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3 py-2">
          {creditFlow.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-navy-900 border border-emerald-500/30 text-xs font-mono font-bold text-slate-100 group hover:border-emerald-400 transition-all">
                  <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{item.title}</span>
                </div>
                {idx < creditFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-emerald-400 hidden sm:block animate-pulse" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
