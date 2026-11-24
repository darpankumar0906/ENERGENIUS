import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sun, 
  Zap, 
  Activity, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  Sparkles
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line 
} from 'recharts';

export const HarvestingUnitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pvUnits, timeSeriesData } = useSimulation();

  const unit = pvUnits.find(p => p.id === id) || pvUnits[0];

  const unitTelemetry = timeSeriesData.map((t, idx) => {
    const factor = 0.85 + (idx % 5) * 0.05;
    return {
      timestamp: t.timestamp,
      powerMw: +(unit.powerMw * factor).toFixed(1),
      lightLux: Math.round(unit.lightIntensityLux * factor),
      energyWh: +(unit.energyGeneratedWh * (idx / 24)).toFixed(2),
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/harvesting" className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PV Array Catalog</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">Node Diagnostic View</span>
      </div>

      {/* Hero Unit Profile Banner */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-energy flex-shrink-0">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold font-mono text-slate-100">{unit.id}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {unit.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-300 mt-1">{unit.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{unit.location} &bull; {unit.pvTechnology}</p>
          </div>
        </div>

        {/* Quick Physics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Voltage (V)</span>
            <div className="font-bold text-slate-100 text-base">{unit.voltageV} V</div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Current (mA)</span>
            <div className="font-bold text-emerald-400 text-base">{unit.currentMa} mA</div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Power (mW)</span>
            <div className="font-bold text-cyan-300 text-base">{unit.powerMw} mW</div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Generated</span>
            <div className="font-bold text-amber-300 text-base">{unit.energyGeneratedWh} Wh</div>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Power Output Waveform (8 cols) */}
        <div className="lg:col-span-8 glass-card p-5 rounded-2xl border border-navy-800 space-y-6">
          
          {/* Chart 1: Power over time */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Power Generation Waveform (mW)
              </h3>
              <span className="text-xs font-mono text-cyan-400">Formula: P = V × I</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={unitTelemetry}>
                  <defs>
                    <linearGradient id="pvPowerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" mW" />
                  <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="powerMw" name="Instantaneous Power (mW)" stroke="#00f2fe" strokeWidth={2.5} fillOpacity={1} fill="url(#pvPowerGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Ambient Light Flux (Lux) */}
          <div className="pt-4 border-t border-navy-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Ambient Light Flux (Lux) vs Time
              </h3>
              <span className="text-xs font-mono text-amber-300">Overhead LED Spectrum</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={unitTelemetry}>
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" Lux" />
                  <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="lightLux" name="Light Flux (Lux)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Performance & Diagnostics Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Expected vs Actual Performance Box */}
          <div className="glass-card p-5 rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-900 to-navy-950">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Yield Performance Diagnostics
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-navy-950 border border-navy-850">
                <span className="text-slate-400">Expected Output:</span>
                <strong className="text-slate-200">{unit.expectedPowerMw} mW</strong>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-navy-950 border border-navy-850">
                <span className="text-slate-400">Actual Output:</span>
                <strong className="text-cyan-300">{unit.powerMw} mW</strong>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-navy-950 border border-navy-850">
                <span className="text-slate-400">Efficiency Index:</span>
                <strong className="text-emerald-400">{unit.performancePct}%</strong>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Performance Ratio</span>
                <span className="text-cyan-400 font-bold">{unit.performancePct}%</span>
              </div>
              <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-800">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{ width: `${unit.performancePct}%` }} />
              </div>
            </div>
          </div>

          {/* Smart Unit Recommendations */}
          <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-navy-900">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Optimization Recommendations
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Fixture Alignment</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                  PV surface tilt is currently 15° relative to primary overhead LED beam. Adjust to 0° planar facing for +12% yield.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Surface Cleaning</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                  Dust accumulation index is low (&lt; 2%). No maintenance intervention required at this time.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
