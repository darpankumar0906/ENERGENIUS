import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Activity, 
  BatteryCharging, 
  Cpu, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Play, 
  Pause,
  Sparkles,
  Radio
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { EnergyFlowAnimation } from '../dashboard/EnergyFlowAnimation';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const PresentationOverlay: React.FC = () => {
  const { 
    isPresentationMode, 
    togglePresentationMode,
    generatedWh,
    storage,
    consumedWh,
    balanceWh,
    energyCredits,
    systemAutonomyFormatted,
    timeSeriesData,
    scenario,
    setScenario
  } = useSimulation();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isPresentationMode) return null;

  const slides = [
    {
      title: 'Problem Statement & Concept',
      subtitle: 'Harvesting Otherwise-Unutilized Artificial Light Energy',
      bullets: [
        'Millions of indoor LED fixtures radiate wasted photon energy onto non-productive surfaces.',
        'ENERGY OS deploys flexible indoor PV stickers (OPV / Perovskite) directly under light fixtures.',
        'Continuous ambient energy harvesting powers distributed IoT sensors without disposable batteries.',
      ]
    },
    {
      title: 'Live Physical System Metrics',
      subtitle: 'Real-time Generation, Storage & IoT Load Telemetry',
      bullets: [
        `Generated Energy: ${generatedWh} Wh (Real-time ambient photon conversion)`,
        `Supercapacitor Reserve: ${storage.currentStoredWh} Wh (${systemAutonomyFormatted} system autonomy)`,
        `Net Energy Balance: ${balanceWh >= 0 ? '+' : ''}${balanceWh} Wh (Positive self-sustaining loop)`,
      ]
    },
    {
      title: 'Intelligent Energy Optimization Engine',
      subtitle: 'Closed-Loop Closed-Feedback Regulation Pipeline',
      bullets: [
        'MEASURE: Ultra-low power PMIC senses voltage/current waveforms.',
        'ANALYZE & PREDICT: Detects ambient fixture flickering and shadow degradation.',
        'OPTIMIZE & CONTROL: Dynamically throttles IoT sampling rates to guarantee 100% autonomy.',
      ]
    },
    {
      title: 'Verified Energy Credit Ledger',
      subtitle: 'Hardware Verification & Future P2P Regulated Concept',
      bullets: [
        `Verified Energy Balance: ${energyCredits} Energy Credits (EC)`,
        'Conversion standard: 1 EC = 0.1 Wh verified harvested energy.',
        'Hardware PMIC proof tags prevent spoofing and prepare facility for future P2P energy trading.',
      ]
    }
  ];

  const handleNext = () => setActiveSlide(prev => (prev + 1) % slides.length);
  const handlePrev = () => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-xl text-slate-100 flex flex-col overflow-y-auto p-4 lg:p-8 animate-fadeIn">
      {/* Top Pitch Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-energy">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-wider text-slate-100">
                ENERGY <span className="text-cyan-400">OS</span> PITCH PRESENTATION MODE
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse">
                SIH DEMO MODE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Distributed Artificial-Light Energy Harvesting Platform
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-navy-900 px-3 py-1.5 rounded-lg border border-navy-700 text-xs font-mono">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Scenario: <strong className="text-cyan-300">{scenario}</strong></span>
          </div>

          <button
            onClick={togglePresentationMode}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-bold transition-all shadow-lg"
          >
            <X className="w-4 h-4" />
            <span>Exit Presentation</span>
          </button>
        </div>
      </div>

      {/* Main Pitch Showcase Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        
        {/* Left Column: Enlarged KPIs & Slide Focus (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Mega KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-navy-900 shadow-energy">
              <div className="flex items-center justify-between text-cyan-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider font-bold">Generated</span>
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-100">{generatedWh} <span className="text-sm font-normal text-cyan-300">Wh</span></div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Simulated LED Lux yield</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-navy-900 shadow-positive">
              <div className="flex items-center justify-between text-emerald-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider font-bold">Stored Buffer</span>
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-100">{storage.currentStoredWh.toFixed(2)} <span className="text-sm font-normal text-emerald-300">Wh</span></div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">{systemAutonomyFormatted} autonomy</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-navy-900">
              <div className="flex items-center justify-between text-indigo-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider font-bold">Consumed</span>
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-100">{consumedWh} <span className="text-sm font-normal text-indigo-300">Wh</span></div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Distributed IoT sensors</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-navy-900 shadow-warning">
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider font-bold">Net Balance</span>
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-100">
                {balanceWh >= 0 ? `+${balanceWh}` : balanceWh} <span className="text-sm font-normal text-amber-300">Wh</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono mt-1 block">{balanceWh >= 0 ? 'Surplus harvesting' : 'Deficit state'}</span>
            </div>
          </div>

          {/* Key Energy Flow Diagram */}
          <EnergyFlowAnimation />

          {/* Chart Section */}
          <div className="glass-card p-5 rounded-2xl border border-navy-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Live Generation vs Consumption Telemetry
              </h4>
              <span className="text-xs font-mono text-cyan-400">24-Hour Signal Stream</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="pitchGenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pitchConGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" Wh" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }} 
                  />
                  <Area type="monotone" dataKey="generatedWh" name="Generated Energy (Wh)" stroke="#00f2fe" strokeWidth={3} fillOpacity={1} fill="url(#pitchGenGrad)" />
                  <Area type="monotone" dataKey="consumedWh" name="Consumed Energy (Wh)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#pitchConGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Presentation Slides & Scenario Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Active Slide Card */}
          <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-950 flex-1 flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  SLIDE {activeSlide + 1} OF {slides.length}
                </span>
                <div className="flex items-center space-x-1">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        i === activeSlide ? 'w-6 bg-cyan-400' : 'w-2 bg-navy-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-100 mb-1">
                {slides[activeSlide].title}
              </h3>
              <p className="text-xs text-cyan-300 font-mono mb-6">
                {slides[activeSlide].subtitle}
              </p>

              <div className="space-y-3">
                {slides[activeSlide].bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-navy-950/80 border border-navy-800">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-navy-800 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-navy-800 text-cyan-400 hover:text-cyan-300"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 text-xs font-bold transition-all shadow-energy"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Scenario Tester for Pitch Demonstration */}
          <div className="glass-card p-4 rounded-2xl border border-navy-800">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Judge Interactive Simulation Scenarios
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setScenario('NORMAL')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  scenario === 'NORMAL' ? 'bg-cyan-500 text-navy-950 shadow-energy font-bold' : 'bg-navy-900 text-slate-300 hover:bg-navy-800'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setScenario('HIGH_GENERATION')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  scenario === 'HIGH_GENERATION' ? 'bg-emerald-500 text-navy-950 shadow-positive font-bold' : 'bg-navy-900 text-slate-300 hover:bg-navy-800'
                }`}
              >
                High Harvest
              </button>
              <button
                onClick={() => setScenario('ENERGY_DEFICIT')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  scenario === 'ENERGY_DEFICIT' ? 'bg-red-500 text-navy-950 shadow-critical font-bold' : 'bg-navy-900 text-slate-300 hover:bg-navy-800'
                }`}
              >
                Deficit Mode
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
