import React from 'react';
import { Activity, Sun, Cpu, BatteryCharging, Database, ShieldCheck } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const SystemStatusPanel: React.FC = () => {
  const { 
    pvUnits, 
    devices, 
    storage, 
    balanceWh, 
    dataSourceMode 
  } = useSimulation();

  const activePvCount = pvUnits.filter(p => p.status === 'ACTIVE').length;
  const onlineDevCount = devices.filter(d => d.status === 'Online').length;

  return (
    <div className="glass-card p-5 rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 space-y-3">
      <div className="flex items-center justify-between border-b border-navy-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            System Real-Time Status Matrix
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-bold">
          <ShieldCheck className="w-3 h-3" /> System Operational
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {/* Metric 1: PV Units Online */}
        <div className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>PV Units Online</span>
            <Sun className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1">
            {activePvCount} <span className="text-xs font-normal text-slate-400">/ {pvUnits.length}</span>
          </div>
          <div className="text-[9px] font-mono text-cyan-400 mt-1">
            {Math.round((activePvCount / pvUnits.length) * 100)}% Fleet Active
          </div>
        </div>

        {/* Metric 2: IoT Nodes Online */}
        <div className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>IoT Nodes Online</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1">
            {onlineDevCount} <span className="text-xs font-normal text-slate-400">/ {devices.length}</span>
          </div>
          <div className="text-[9px] font-mono text-indigo-400 mt-1">
            {Math.round((onlineDevCount / devices.length) * 100)}% Fleet Online
          </div>
        </div>

        {/* Metric 3: Storage Status */}
        <div className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>Storage SoC</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1">
            {storage.stateOfChargePct}%
          </div>
          <div className="text-[9px] font-mono text-emerald-400 mt-1">
            {storage.currentStoredWh.toFixed(2)} Wh / {storage.capacityWh} Wh
          </div>
        </div>

        {/* Metric 4: Energy Balance */}
        <div className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>Energy Balance</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 ${balanceWh >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {balanceWh >= 0 ? `+${balanceWh}` : balanceWh} Wh
          </div>
          <div className={`text-[9px] font-mono uppercase mt-1 font-semibold ${balanceWh >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {balanceWh >= 0 ? 'Surplus Generation' : 'Deficit Draw'}
          </div>
        </div>

        {/* Metric 5: Data Source */}
        <div className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>Data Source</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-bold font-mono text-slate-100 mt-1 truncate">
            {dataSourceMode === 'LIVE' ? 'Python Virtual HW' : 'DEMO Engine'}
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-1">
            {dataSourceMode === 'LIVE' ? 'FastAPI Port 8001' : 'Local Math Model'}
          </div>
        </div>
      </div>
    </div>
  );
};
