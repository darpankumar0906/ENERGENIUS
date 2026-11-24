import React, { useState } from 'react';
import { 
  Building2, 
  Sun, 
  Zap, 
  X,
  ChevronRight
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { INITIAL_ZONES } from '../services/simulationEngine';
import type { PVHarvestingUnit } from '../types';
import { Link } from 'react-router-dom';

export const FacilityView: React.FC = () => {
  const { pvUnits, generatedWh } = useSimulation();
  const [selectedPv, setSelectedPv] = useState<PVHarvestingUnit | null>(null);

  const activeCount = pvUnits.filter(p => p.status === 'ACTIVE').length;
  const lowCount = pvUnits.filter(p => p.status === 'LOW OUTPUT').length;
  const offlineCount = pvUnits.filter(p => p.status === 'OFFLINE' || p.status === 'MAINTENANCE').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500 border-emerald-400 text-navy-950 font-bold';
      case 'LOW OUTPUT': return 'bg-amber-500 border-amber-400 text-navy-950 font-bold';
      case 'OFFLINE': return 'bg-red-500 border-red-400 text-slate-100 font-bold';
      default: return 'bg-indigo-500 border-indigo-400 text-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. FACILITY ENERGY MAP SUMMARY BANNER */}
      <div className="quiet-surface p-6 rounded-2xl border border-navy-850 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-850 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
              Spatial Harvesting Layout & Zone Map
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              <Building2 className="w-5 h-5 text-emerald-400" />
              FACILITY ENERGY MAP
            </h2>
          </div>
          <div className="text-xs font-mono text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
            Facility Generation: {generatedWh} Wh
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center">
            <span className="text-[9px] text-slate-400 block uppercase">Total PV</span>
            <strong className="text-slate-100">{pvUnits.length} Units</strong>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-center">
            <span className="text-[9px] text-emerald-400 block uppercase font-bold">Active</span>
            <strong className="text-emerald-400">{activeCount}</strong>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-amber-500/30 text-center">
            <span className="text-[9px] text-amber-400 block uppercase font-bold">Low Output</span>
            <strong className="text-amber-400">{lowCount}</strong>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center">
            <span className="text-[9px] text-slate-400 block uppercase">Offline</span>
            <strong className="text-slate-400">{offlineCount}</strong>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center">
            <span className="text-[9px] text-slate-400 block uppercase">Generation</span>
            <strong className="text-emerald-400">{generatedWh} Wh</strong>
          </div>
        </div>
      </div>

      {/* 2. SPATIAL FLOORPLAN SCHEMATIC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Floorplan Map Grid (8 cols) */}
        <div className="lg:col-span-8 quiet-surface p-6 rounded-2xl border border-navy-850 relative min-h-[460px]">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4 font-bold">
            2D SPATIAL FLOORPLAN ZONES // CLICK ANY NODE FOR TELEMETRY
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_ZONES.map(zone => {
              const zonePvs = pvUnits.filter(p => p.zoneId === zone.id);
              return (
                <div key={zone.id} className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 flex flex-col justify-between min-h-[160px]">
                  <div className="flex items-center justify-between border-b border-navy-850 pb-2">
                    <span className="text-xs font-bold text-slate-200">{zone.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{zonePvs.length} Nodes</span>
                  </div>

                  {/* PV Node Buttons */}
                  <div className="grid grid-cols-3 gap-2 my-3">
                    {zonePvs.map(pv => (
                      <button
                        key={pv.id}
                        onClick={() => setSelectedPv(pv)}
                        className={`p-2 rounded-lg text-[10px] font-mono transition-all transform hover:scale-105 flex items-center justify-center space-x-1 border cursor-pointer ${getStatusColor(pv.status)}`}
                        title={`PV: ${pv.id} | ${pv.powerMw} mW`}
                      >
                        <Zap className="w-3 h-3" />
                        <span>{pv.id.replace('PV-', '')}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-400 font-mono flex justify-between pt-2 border-t border-navy-850">
                    <span>Zone Yield:</span>
                    <strong className="text-emerald-400">{(zonePvs.reduce((acc, p) => acc + p.powerMw, 0) / 1000).toFixed(2)} W</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected PV Node Drawer (4 cols) */}
        <div className="lg:col-span-4">
          {selectedPv ? (
            <div className="quiet-surface p-5 rounded-2xl border border-emerald-500/40 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-navy-850 pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-slate-100">{selectedPv.id} Details</h3>
                </div>
                <button onClick={() => setSelectedPv(null)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200">{selectedPv.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedPv.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-navy-950 p-3 rounded-xl border border-navy-850">
                <div>
                  <span className="text-[10px] text-slate-400 block">Light Flux</span>
                  <div className="font-bold text-slate-100">{selectedPv.lightIntensityLux} Lux</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Power Output</span>
                  <div className="font-bold text-emerald-400">{selectedPv.powerMw} mW</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Voltage / Current</span>
                  <div className="text-slate-300">{selectedPv.voltageV}V / {selectedPv.currentMa}mA</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Yield</span>
                  <div className="text-emerald-400 font-bold">{selectedPv.energyGeneratedWh} Wh</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/harvesting/${selectedPv.id}`}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Full PV Telemetry</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="quiet-surface p-6 rounded-2xl border border-navy-850 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
              <Sun className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-300">Select a PV Node</h4>
              <p className="text-xs text-slate-500 font-mono max-w-xs mt-1">
                Click any PV sticker node on the floorplan to inspect real-time light flux, voltage, current, and status.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
