import React from 'react';
import { 
  Zap, 
  Activity, 
  Sliders
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export const EnergyMonitoring: React.FC = () => {
  const { balanceWh, timeSeriesData, pvUnits, generatedWh, storage } = useSimulation();

  const totalVoltage = +(pvUnits.reduce((acc, p) => acc + p.voltageV, 0) / pvUnits.length).toFixed(2);
  const totalCurrentMa = +(pvUnits.reduce((acc, p) => acc + p.currentMa, 0)).toFixed(1);
  const calculatedPowerMw = +(totalVoltage * totalCurrentMa).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. PRIMARY OBSERVABILITY PIPELINE */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-850 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
              Energy Observability Engine
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <Zap className="w-5 h-5 text-emerald-400" />
              ELECTRICAL FLUX & WAVEFORMS
            </h2>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
            Net Balance: +{balanceWh} Wh
          </div>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">01 GENERATION</span>
            <div className="text-base font-bold text-slate-100">{generatedWh} Wh</div>
            <span className="text-[10px] text-emerald-400 font-mono">Ambient 4000K Flux</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">02 CONVERSION</span>
            <div className="text-base font-bold text-slate-100">{calculatedPowerMw} mW</div>
            <span className="text-[10px] text-cyan-300 font-mono">MPPT Efficiency</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">03 STORAGE</span>
            <div className="text-base font-bold text-slate-100">{storage.currentStoredWh.toFixed(2)} Wh</div>
            <span className="text-[10px] text-emerald-400 font-mono">{storage.stateOfChargePct}% SoC</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">04 CONSUMPTION</span>
            <div className="text-base font-bold text-slate-100">0.65 W Avg Draw</div>
            <span className="text-[10px] text-amber-400 font-mono">IoT Fleet Load</span>
          </div>
        </div>
      </div>

      {/* 2. LARGE READABLE METRICS (VOLTAGE, CURRENT, POWER, ENERGY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">ARRAY VOLTAGE</span>
          <div className="text-3xl font-black font-mono text-slate-100">{totalVoltage} <span className="text-xs font-normal text-emerald-400">V</span></div>
          <p className="text-[10px] text-slate-400 font-sans">Mean indoor PV operating voltage</p>
        </div>

        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">HARVEST CURRENT</span>
          <div className="text-3xl font-black font-mono text-slate-100">{totalCurrentMa} <span className="text-xs font-normal text-emerald-400">mA</span></div>
          <p className="text-[10px] text-slate-400 font-sans">Total array current output</p>
        </div>

        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">HARVEST POWER</span>
          <div className="text-3xl font-black font-mono text-slate-100">{calculatedPowerMw} <span className="text-xs font-normal text-cyan-300">mW</span></div>
          <p className="text-[10px] text-slate-400 font-sans">Calculated power P = V &times; I</p>
        </div>

        <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-1">
          <span className="text-xs font-mono uppercase text-slate-400 block font-bold">TOTAL HARVESTED ENERGY</span>
          <div className="text-3xl font-black font-mono text-emerald-400 glow-text-emerald">{generatedWh} <span className="text-xs font-normal text-slate-300">Wh</span></div>
          <p className="text-[10px] text-slate-400 font-sans">Accumulated energy E = P &middot; t</p>
        </div>
      </div>

      {/* 3. LARGE LIVE CHART */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Energy Yield Stream (Wh)
          </h3>
          <span className="text-xs font-mono text-slate-400">24-Hour Telemetry Engine</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="monGenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" Wh" />
              <Tooltip contentStyle={{ backgroundColor: '#070a0f', borderColor: '#1b2333', borderRadius: '12px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="generatedWh" name="Cumulative Energy (Wh)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#monGenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. SECONDARY TECHNICAL PHYSICS SECTION */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider">Secondary Physics Engine Specification</span>
            <p className="text-slate-400 font-sans mt-0.5">
              Power: <code className="text-emerald-300">P = V &times; I</code> &nbsp;|&nbsp; Energy: <code className="text-emerald-300">E = P &times; time</code> &nbsp;|&nbsp; Net Delta: <code className="text-emerald-300">E_gen - E_con</code>
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
          Deterministic Physics Simulation Model
        </div>
      </div>
    </div>
  );
};
