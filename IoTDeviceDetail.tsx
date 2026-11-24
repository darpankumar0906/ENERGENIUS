import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Cpu, 
  ArrowLeft, 
  Sliders, 
  Zap
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const IoTDeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { devices } = useSimulation();

  const device = devices.find(d => d.id === id) || devices[0];
  const [samplingRate, setSamplingRate] = useState(device.samplingFrequencySec);
  const [ulpMode, setUlpMode] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/devices" className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to IoT Devices Fleet</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">Device Power Management View</span>
      </div>

      {/* Hero Profile Banner */}
      <div className="glass-card p-6 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-energy flex-shrink-0">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold font-mono text-slate-100">{device.id}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {device.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mt-1">{device.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{device.type} &bull; {device.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Power Draw</span>
            <div className="font-bold text-slate-100 text-base">{device.powerConsumptionMw} mW</div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Battery Level</span>
            <div className="font-bold text-emerald-400 text-base">{device.batteryLevelPct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-slate-500 uppercase">Est Autonomy</span>
            <div className="font-bold text-cyan-300 text-base">{device.autonomyHours} hrs</div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Power Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Adaptive Power Management Card */}
        <div className="glass-card p-5 rounded-2xl border border-navy-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Adaptive Duty Cycle & Sampling Rate Tuning
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Adjusting transmission interval directly modulates supercapacitor energy drain rate.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Sampling & Transmission Interval:</span>
                <strong className="text-cyan-300">{samplingRate} Seconds</strong>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={samplingRate}
                onChange={e => setSamplingRate(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>1s (High Duty - High Draw)</span>
                <span>60s (Low Duty - Energy Saver)</span>
              </div>
            </div>

            {/* ULP Toggle */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200">Ultra-Low-Power (ULP) Mode</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Shuts down non-essential sensor telemetry channels.</p>
              </div>
              <button
                onClick={() => setUlpMode(!ulpMode)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  ulpMode ? 'bg-emerald-500 text-navy-950 shadow-positive' : 'bg-navy-900 text-slate-400 border border-navy-700'
                }`}
              >
                {ulpMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Energy Savings Summary */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-navy-900 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Power Optimization Formula Output
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Calculated battery lifetime extension based on active parameter tuning.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-navy-950 border border-navy-850">
                <span className="text-slate-400">Baseline Power Draw:</span>
                <strong className="text-slate-200">{device.powerConsumptionMw} mW</strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-navy-950 border border-navy-850">
                <span className="text-slate-400">Optimates Draw (New Rate):</span>
                <strong className="text-cyan-300">
                  {Math.round(device.powerConsumptionMw * (10 / Math.max(5, samplingRate)))} mW
                </strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-navy-950 border border-navy-850">
                <span className="text-slate-400">Autonomy Boost:</span>
                <strong className="text-emerald-400">+{Math.round(samplingRate * 0.35)} Hours</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>ENERGY OS Closed-Loop Optimizer</span>
            <span className="text-emerald-400 font-bold">Closed-Loop Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
