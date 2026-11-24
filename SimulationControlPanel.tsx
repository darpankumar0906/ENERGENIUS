import React from 'react';
import { Sliders, Sun, Cpu, ShieldAlert, Radio } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import type { SimulationScenario } from '../../types';

export const SimulationControlPanel: React.FC = () => {
  const { scenario, setScenario, dataSourceMode } = useSimulation();

  const scenariosList: { id: SimulationScenario; label: string; lux: string; load: string }[] = [
    { id: 'NORMAL', label: 'Normal Operation', lux: '500 Lux', load: 'Standard Load (650 mW)' },
    { id: 'HIGH_GENERATION', label: 'High Harvesting Yield', lux: '850 Lux', load: 'High Solar Flux (+1.6x)' },
    { id: 'LOW_GENERATION', label: 'Low Generation / Shadow', lux: '180 Lux', load: 'Shadowed Fixture' },
    { id: 'ENERGY_SURPLUS', label: 'Surplus Buffer State', lux: '720 Lux', load: 'Low IoT Consumption' },
    { id: 'ENERGY_DEFICIT', label: 'High Load Deficit', lux: '250 Lux', load: 'Burst IoT Transmission' },
  ];

  return (
    <div className="glass-card p-5 rounded-2xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Prototype Simulation & Parameter Control
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
          <ShieldAlert className="w-3 h-3 text-cyan-400" />
          <span>Mode: {dataSourceMode === 'LIVE' ? 'Python Virtual Hardware' : 'Mathematical Engine'}</span>
        </div>
      </div>

      {/* Scenario Selector Grid */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Active Simulation Scenario</span>
          <span className="text-cyan-300 font-bold">{scenario.replace('_', ' ')}</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {scenariosList.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                scenario === sc.id
                  ? 'bg-gradient-to-br from-cyan-950/80 to-navy-900 border-cyan-500/50 text-cyan-300 shadow-energy font-bold scale-[1.02]'
                  : 'bg-navy-900/60 border-navy-800 hover:border-navy-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] font-bold truncate flex items-center gap-1">
                <Radio className={`w-3 h-3 ${scenario === sc.id ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                <span>{sc.label}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1 flex justify-between">
                <span>{sc.lux}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Environmental Parameters Readout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Light Intensity:</span>
          </div>
          <strong className="text-amber-300">
            {scenario === 'HIGH_GENERATION' ? '850 Lux' : scenario === 'LOW_GENERATION' ? '180 Lux' : '500 Lux'}
          </strong>
        </div>

        <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">PV Active Fleet:</span>
          </div>
          <strong className="text-cyan-300">20 Units</strong>
        </div>

        <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Load Demand:</span>
          </div>
          <strong className="text-indigo-300">
            {scenario === 'ENERGY_DEFICIT' ? '980 mW' : scenario === 'ENERGY_SURPLUS' ? '320 mW' : '650 mW'}
          </strong>
        </div>
      </div>
    </div>
  );
};
