import React from 'react';
import { motion } from 'motion/react';
import { Sun, Shield, BatteryCharging, Cpu, ArrowRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const EnergyFlowAnimation: React.FC = () => {
  const { generatedWh, storage, pvUnits, devices } = useSimulation();

  const activePvCount = pvUnits.filter(p => p.status === 'ACTIVE').length;
  const activeDevCount = devices.filter(d => d.status === 'Online').length;
  const totalPowerGeneratedMw = pvUnits.reduce((acc, p) => p.status !== 'OFFLINE' ? acc + p.powerMw : acc, 0);
  const totalPowerConsumedMw = devices.reduce((acc, d) => d.status !== 'Offline' ? acc + d.powerConsumptionMw : acc, 0);

  const steps = [
    {
      id: 'light',
      title: 'Artificial Light',
      sub: 'Overhead Fixture / Ambient LED',
      metric: '~500 Lux',
      icon: Sun,
      color: 'from-amber-500 to-yellow-400',
      glow: 'shadow-amber-500/20',
      textColor: 'text-amber-300',
    },
    {
      id: 'pv',
      title: 'Indoor PV Sticker',
      sub: `${activePvCount} Active Flex Units`,
      metric: `${(totalPowerGeneratedMw / 1000).toFixed(2)} W`,
      icon: Sun,
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20',
      textColor: 'text-cyan-300',
    },
    {
      id: 'pmic',
      title: 'Power Management',
      sub: 'MPPT / PMIC Regulation',
      metric: '94.2% Eff.',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-500/20',
      textColor: 'text-indigo-300',
    },
    {
      id: 'storage',
      title: 'Supercapacitor Storage',
      sub: 'Hybrid Capacitor Bank',
      metric: `${storage.currentStoredWh.toFixed(2)} Wh (${storage.stateOfChargePct}%)`,
      icon: BatteryCharging,
      color: 'from-emerald-500 to-teal-400',
      glow: 'shadow-emerald-500/20',
      textColor: 'text-emerald-300',
    },
    {
      id: 'devices',
      title: 'IoT Devices Fleet',
      sub: `${activeDevCount} Online Sensors`,
      metric: `${(totalPowerConsumedMw / 1000).toFixed(2)} W`,
      icon: Cpu,
      color: 'from-blue-500 to-cyan-400',
      glow: 'shadow-blue-500/20',
      textColor: 'text-blue-300',
    },
  ];

  return (
    <div className="glass-card p-5 rounded-2xl border border-navy-800 relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      {/* Ambient Radial Accent Flare */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Live Artificial Light Energy Harvesting Flow
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Physical energy conversion pipeline: Ambient Flux &rarr; PV Stickers &rarr; PMIC &rarr; Supercap &rarr; IoT Load
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/30 font-semibold shadow-sm">
          <span>Harvested Energy: <strong className="text-emerald-400">+{generatedWh} Wh</strong></span>
        </div>
      </div>

      {/* Pipeline Motion Container */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-5 gap-3 relative py-2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={step.id} 
              className="relative group"
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <div className={`p-3.5 rounded-xl bg-navy-900/90 border border-navy-700/80 hover:border-cyan-500/50 transition-all duration-300 shadow-lg ${step.glow} flex flex-col justify-between h-full cursor-pointer`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center shadow-md`}>
                    <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${step.textColor}`} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{step.sub}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-navy-800/80 flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${step.textColor}`}>{step.metric}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>

              {/* Connecting Flow Arrow (Desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-cyan-400/80 pointer-events-none">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
