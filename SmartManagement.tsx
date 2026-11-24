import React from 'react';
import { 
  BrainCircuit, 
  Sliders, 
  CheckCircle2, 
  Play, 
  Sparkles,
  Zap,
  Cpu,
  BarChart3
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { SeverityLevel } from '../types';

export const SmartManagement: React.FC = () => {
  const { recommendations, executeRecommendation, balanceWh, generatedWh, consumedWh, storage } = useSimulation();

  const pipelineStages = [
    { num: '01', title: 'MEASURE', sub: 'PMIC V & I Telemetry', desc: 'Ultra-low-power sensing of micro-volts and micro-amps from OPV stickers.', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/30' },
    { num: '02', title: 'ANALYZE', sub: 'Flux & Spectral Match', desc: 'Detect fixture flicker, shadow degradation, and spectral lux output.', icon: BarChart3, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { num: '03', title: 'PREDICT', sub: 'Supercapacitor SoC Rate', desc: 'Forecast energy depletion window under current ambient lighting.', icon: BrainCircuit, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { num: '04', title: 'OPTIMIZE', sub: 'Adaptive Rule Engine', desc: 'Synthesize optimal sampling duty-cycles for all IoT sensor nodes.', icon: Sliders, color: 'text-purple-400', border: 'border-purple-500/30' },
    { num: '05', title: 'CONTROL', sub: 'Closed-Loop Regulation', desc: 'Dispatch command packets to IoT gateways to adjust duty cycles.', icon: Cpu, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  ];

  const topRec = recommendations[0];

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/40 animate-pulse">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-500/40">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. HEADER */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Rule-Based Energy Optimization</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous closed-loop rule engine regulating harvesting flux and sampling rates.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
          Optimization Engine: ACTIVE
        </div>
      </div>

      {/* 2. DOMINANT RECOMMENDED ACTION CARD */}
      {topRec && (
        <div className="quiet-surface p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-navy-950 to-navy-950 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-850 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                CURRENT SYSTEM STATE: {balanceWh >= 0 ? 'ENERGY SURPLUS' : 'ENERGY DEFICIT'}
              </span>
            </div>
            {getSeverityBadge(topRec.severity)}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">RECOMMENDED ACTION</span>
            <h3 className="text-2xl font-black text-slate-100 leading-tight">
              {topRec.action}
            </h3>
          </div>

          {/* WHY Breakdown */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-850 space-y-2">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">WHY THIS RECOMMENDATION?</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Gen ({generatedWh} Wh) &gt; Con ({consumedWh} Wh)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supercap Capacity Available ({storage.stateOfChargePct}% SoC)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Non-critical IoT sampling duty cycle available</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-300 font-semibold">Expected Benefit: {topRec.expectedBenefit}</span>
            {!topRec.executed && (
              <button
                onClick={() => executeRecommendation(topRec.id)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-navy-950" />
                <span>Apply Optimization Rule</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. 5-STAGE CONNECTED INTELLIGENCE PIPELINE */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          5-Stage Intelligence Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {pipelineStages.map(stg => {
            const Icon = stg.icon;
            return (
              <div key={stg.num} className={`p-4 rounded-xl bg-navy-950/80 border ${stg.border} flex flex-col justify-between space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{stg.num}</span>
                  <Icon className={`w-4 h-4 ${stg.color}`} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-100 tracking-wider">{stg.title}</h4>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">{stg.sub}</span>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">{stg.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
