import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ShieldCheck,
  Play
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { InteractiveHardwareModel } from '../components/InteractiveHardwareModel';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

import { formatBalance, formatEnergy, formatSoC } from '../utils/telemetrySafety';

export const Dashboard: React.FC = () => {
  const { 
    generatedWh, 
    consumedWh, 
    balanceWh, 
    storage, 
    pvUnits, 
    devices, 
    timeSeriesData, 
    recommendations, 
    selectedTimeRange,
    setSelectedTimeRange,
    executeRecommendation
  } = useSimulation();

  const activePvCount = pvUnits.filter(p => p.status === 'ACTIVE').length;
  const onlineDevCount = devices.filter(d => d.status === 'Online').length;

  const topRec = recommendations[0];

  return (
    <motion.div 
      className="space-y-6 animate-fadeIn pb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. HERO SECTION & DOMINANT NET BALANCE */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block">
              ENERGY OS &bull; ENERGENIUS
            </span>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">
              Indoor Energy Intelligence
            </h1>
            <p className="text-xs text-slate-400 font-sans max-w-xl leading-relaxed">
              Monitor, simulate and optimize distributed indoor energy harvesting.
            </p>
          </div>

          {/* Centered/Dominant NET BALANCE */}
          <div className="p-4 rounded-2xl bg-navy-950/90 border border-emerald-500/30 text-right space-y-0.5 min-w-[240px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">NET BALANCE</span>
            <div className="text-4xl font-black font-mono text-emerald-400 glow-text-emerald">
              {formatBalance(balanceWh)} <span className="text-sm font-normal text-slate-300">Wh</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {balanceWh >= 0 ? 'SURPLUS' : 'DEFICIT'}
            </div>
          </div>
        </div>

        {/* 2. PRIMARY TYPOGRAPHY READOUTS ROW (GENERATED, STORED, CONSUMED) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-navy-850">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">GENERATED</span>
            <div className="text-3xl font-black font-mono text-slate-100">
              {formatEnergy(generatedWh)} <span className="text-xs font-normal text-emerald-400">Wh</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block">+14.2% harvesting flux</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">STORED</span>
            <div className="text-3xl font-black font-mono text-slate-100">
              {formatEnergy(storage.currentStoredWh)} <span className="text-xs font-normal text-emerald-400">Wh</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 block">{formatSoC(storage.stateOfChargePct)}% Supercap SoC</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">CONSUMED</span>
            <div className="text-3xl font-black font-mono text-slate-100">
              {formatEnergy(consumedWh)} <span className="text-xs font-normal text-amber-400">Wh</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block">Avg Draw: 0.65 W</span>
          </div>
        </div>
      </div>

      {/* 3. SIGNATURE INTERACTIVE 3D HARDWARE VISUALIZATION */}
      <InteractiveHardwareModel />

      {/* 4. GENERATION vs CONSUMPTION LIVE CHART */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-850 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
              Continuous Real-Time Telemetry
            </span>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              GENERATION vs CONSUMPTION (Wh)
            </h3>
          </div>

          <div className="flex items-center space-x-1 bg-navy-950 p-1 rounded-xl border border-navy-850 text-xs font-mono">
            {['Today', '7 Days', '30 Days'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range as any)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedTimeRange === range 
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="genColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="conColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" Wh" />
              <Tooltip contentStyle={{ backgroundColor: '#070a0f', borderColor: '#1b2333', borderRadius: '12px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="generatedWh" name="Generation (Wh)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#genColor)" />
              <Area type="monotone" dataKey="consumedWh" name="Consumption (Wh)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#conColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. SPLIT BOTTOM SECTION: SYSTEM HEALTH + SMART RECOMMENDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* System Health (6 cols) */}
        <div className="lg:col-span-6 quiet-surface p-5 rounded-2xl border border-navy-850 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-850 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              System Health & Diagnostics
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold">98.4% Optimal</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-850">
              <span className="text-[9px] text-slate-400 block uppercase">Active PV Array</span>
              <strong className="text-emerald-400">{activePvCount} / 20 Units Active</strong>
            </div>
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
              <span className="text-[9px] text-slate-400 block uppercase">Active IoT Fleet</span>
              <strong className="text-slate-100">{onlineDevCount} / 10 Sensors Online</strong>
            </div>
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-850">
              <span className="text-[9px] text-slate-400 block uppercase">Autonomy Window</span>
              <strong className="text-emerald-400">7.6 Hours Buffer</strong>
            </div>
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-850">
              <span className="text-[9px] text-slate-400 block uppercase">System State</span>
              <strong className="text-emerald-400">Surplus Autonomy</strong>
            </div>
          </div>
        </div>

        {/* Smart Recommendation (6 cols) */}
        <div className="lg:col-span-6 quiet-surface p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-navy-950 to-navy-950 space-y-3">
          <div className="flex items-center justify-between border-b border-navy-850 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Smart Recommendation Engine
            </span>
            <span className="text-[10px] font-mono text-emerald-300 font-bold">Rule Engine Active</span>
          </div>

          {topRec ? (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Action Required</span>
                <h4 className="text-base font-bold text-slate-100 leading-snug">{topRec.action}</h4>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">{topRec.explanation}</p>
              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <span className="text-emerald-300 font-semibold">{topRec.expectedBenefit}</span>
                {!topRec.executed && (
                  <button
                    onClick={() => executeRecommendation(topRec.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-navy-950" />
                    <span>Apply Rule</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-mono">No active recommendations. System operating at 100% efficiency.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
