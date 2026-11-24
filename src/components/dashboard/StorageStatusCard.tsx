import React from 'react';
import { motion } from 'motion/react';
import { BatteryCharging, ShieldCheck, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const StorageStatusCard: React.FC = () => {
  const { storage, systemAutonomyFormatted, balanceWh } = useSimulation();

  return (
    <motion.div
      className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-navy-900 to-navy-950 glass-card-hover relative overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div className="flex items-center justify-between border-b border-navy-800 pb-3">
        <div className="flex items-center space-x-2">
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Supercapacitor Energy Storage
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> State of Health: {storage.stateOfHealthPct}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-4">
        {/* State of Charge Large Readout & Progress */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">State of Charge (SoC)</span>
            <span className="text-2xl font-black font-mono text-emerald-400 glow-text-emerald">
              {storage.stateOfChargePct}%
            </span>
          </div>

          {/* Animated SoC Fill Bar */}
          <div className="w-full bg-navy-950 rounded-full h-3.5 p-0.5 overflow-hidden border border-navy-800">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full shadow-positive"
              initial={{ width: '0%' }}
              animate={{ width: `${storage.stateOfChargePct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Stored: <strong className="text-slate-200">{storage.currentStoredWh.toFixed(2)} Wh</strong></span>
            <span>Capacity: <strong className="text-cyan-300">{storage.capacityWh} Wh</strong></span>
          </div>
        </div>

        {/* System Autonomy & Net Delta Matrix */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 pl-0 md:pl-3 md:border-l border-navy-800">
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Autonomy</span>
            <div className="text-base font-bold font-mono text-slate-100">{systemAutonomyFormatted}</div>
            <p className="text-[9px] text-slate-400">Estimated runtime draw</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Net Buffer</span>
            <div className={`text-base font-bold font-mono ${balanceWh >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {balanceWh >= 0 ? `+${balanceWh}` : balanceWh} Wh
            </div>
            <p className="text-[9px] text-slate-400 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              {balanceWh >= 0 ? 'Charging State' : 'Discharging State'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
