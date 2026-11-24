import React from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface EnergyCardProps {
  title: string;
  value: string | number;
  unit: string;
  changeText?: string;
  changePositive?: boolean;
  subTextLeft: string;
  subTextRight: string;
  subTextRightColor?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  chartData: any[];
  chartDataKey: string;
  chartColor: string;
  tooltipText?: string;
  isPrimary?: boolean;
}

export const EnergyCard: React.FC<EnergyCardProps> = ({
  title,
  value,
  unit,
  changeText,
  changePositive = true,
  subTextLeft,
  subTextRight,
  subTextRightColor = 'text-cyan-300',
  icon: Icon,
  iconColor,
  iconBg,
  borderColor,
  chartData,
  chartDataKey,
  chartColor,
  tooltipText,
  isPrimary = false,
}) => {
  return (
    <motion.div
      className={`glass-card p-5 rounded-2xl border ${
        isPrimary ? 'kpi-primary-card' : borderColor
      } relative overflow-hidden group cursor-pointer flex flex-col justify-between h-full`}
      title={tooltipText}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        scale: isPrimary ? 1.02 : 1.015,
        boxShadow: isPrimary ? '0 16px 40px rgba(0,242,254,0.25)' : '0 12px 30px rgba(0,0,0,0.25)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 28,
      }}
    >
      {/* Primary Top Highlight Accent Line */}
      {isPrimary && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500" />
      )}

      {/* Top Title & Icon */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono font-bold ${isPrimary ? 'text-cyan-300' : iconColor} uppercase tracking-wider flex items-center gap-1.5`}>
          <Icon className="w-3.5 h-3.5" />
          {title}
        </span>
        <div className={`p-2 rounded-xl ${iconBg} ${iconColor} border border-navy-700/60 shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value & Change Badge */}
      <div className="my-1 flex items-baseline justify-between">
        <div className={`${isPrimary ? 'text-3xl glow-text-cyan font-black' : 'text-2xl font-extrabold'} font-mono text-slate-100`}>
          {value} <span className={`text-xs font-normal ${iconColor}`}>{unit}</span>
        </div>
        {changeText && (
          <div className={`flex items-center text-[11px] font-mono font-bold px-2 py-0.5 rounded ${changePositive ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'}`}>
            {changeText}
          </div>
        )}
      </div>

      {/* Subtext info */}
      <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
        <span className="truncate max-w-[65%]">{subTextLeft}</span>
        <span className={`font-semibold ${subTextRightColor}`}>{subTextRight}</span>
      </div>

      {/* Mini Trendline Chart */}
      <div className="h-10 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey={chartDataKey} stroke={chartColor} strokeWidth={isPrimary ? 2.5 : 2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
