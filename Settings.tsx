import React from 'react';
import { 
  Settings as SettingsIcon, 
  Radio, 
  CheckCircle2, 
  Database
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { SimulationScenario } from '../types';

export const Settings: React.FC = () => {
  const { scenario, setScenario, generatedWh, consumedWh, storage } = useSimulation();

  const scenarios: { id: SimulationScenario; label: string; desc: string }[] = [
    { id: 'NORMAL', label: 'Normal Operation', desc: 'Baseline indoor commercial LED light ~500 Lux' },
    { id: 'HIGH_GENERATION', label: 'High Generation Yield', desc: 'High lux flux ~850 Lux (+1.6x harvest rate)' },
    { id: 'LOW_GENERATION', label: 'Low Generation / Shadow', desc: 'Shadow overhead fixture ~180 Lux' },
    { id: 'ENERGY_SURPLUS', label: 'Energy Surplus State', desc: 'High harvesting yield with low IoT sensor load draw' },
    { id: 'ENERGY_DEFICIT', label: 'Energy Deficit State', desc: 'High IoT sensor transmission burst with low light' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. HEADER */}
      <div className="quiet-surface p-5 rounded-2xl border border-navy-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">SIMULATION SCENARIO CONTROL CONSOLE</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Centralized physics engine scenario manager & simulation parameters.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
          Engine Mode: SIMULATION ENGINE
        </div>
      </div>

      {/* 2. INPUT -> SIMULATION ENGINE -> SYSTEM RESPONSE DIAGRAM */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 space-y-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
          PHYSICS MODEL SIMULATION PIPELINE
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-1 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[9px] text-slate-400 uppercase">01 INPUT SCENARIO</span>
            <div className="text-sm font-bold text-slate-100">{scenario}</div>
            <span className="text-[10px] text-emerald-400 font-mono">Ambient 4000K Illumination</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[9px] text-slate-400 uppercase">02 PV YIELD OUTPUT</span>
            <div className="text-sm font-bold text-emerald-400">{generatedWh} Wh</div>
            <span className="text-[10px] text-slate-400 font-mono">Harvested Power</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[9px] text-slate-400 uppercase">03 LOAD DEMAND</span>
            <div className="text-sm font-bold text-amber-400">{consumedWh} Wh</div>
            <span className="text-[10px] text-slate-400 font-mono">IoT Sensor Draw</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-emerald-500/30 space-y-1">
            <span className="text-[9px] text-emerald-400 uppercase font-bold">04 STORAGE RESPONSE</span>
            <div className="text-sm font-bold text-emerald-400">{storage.currentStoredWh.toFixed(2)} Wh</div>
            <span className="text-[10px] text-slate-300 font-mono">{storage.stateOfChargePct}% SoC Rate</span>
          </div>
        </div>
      </div>

      {/* 3. VISUAL SCENARIO SELECTION BUTTONS */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            Select Ambient Light & Load Simulation Scenario
          </h3>
          <span className="text-xs font-mono text-emerald-300 font-bold">Current: {scenario}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {scenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                scenario === sc.id
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-slate-100'
                  : 'border-navy-850 bg-navy-950/80 hover:border-navy-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-100">{sc.label}</span>
                {scenario === sc.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{sc.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. DRIVERS & INTERFACES */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Simulation Engine & Driver Endpoints
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-navy-950 border border-navy-850">
            <span className="text-[10px] text-slate-400 uppercase block">Virtual Hardware Driver</span>
            <div className="font-bold text-emerald-400 mt-1">Active / VNODE-001</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">Simulated telemetry stream</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-navy-850">
            <span className="text-[10px] text-slate-400 uppercase block">MQTT Telemetry Client</span>
            <div className="font-bold text-emerald-400 mt-1">Simulated Protocol</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">Broker: mqtt://energenius.internal</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-navy-850">
            <span className="text-[10px] text-slate-400 uppercase block">REST Service API</span>
            <div className="font-bold text-emerald-300 mt-1">Endpoints Active</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">GET /api/v1/telemetry/live</p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-navy-850">
            <span className="text-[10px] text-slate-400 uppercase block">LoRaWAN Gateway</span>
            <div className="font-bold text-emerald-400 mt-1">Subscribed</div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">Band: 868 MHz / 915 MHz</p>
          </div>
        </div>
      </div>
    </div>
  );
};
