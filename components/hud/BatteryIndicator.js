import { motion } from 'framer-motion';
import { BoltIcon } from '@heroicons/react/24/solid';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils/helpers';

export default function BatteryIndicator({ compact = false }) {
  const { batteryLevel } = useApp();

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'bg-green-500';
    if (batteryLevel > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBatteryTextColor = () => {
    if (batteryLevel > 50) return 'text-green-500';
    if (batteryLevel > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <div className="relative h-4 w-8 rounded-sm border border-white/30">
          {/* Battery level fill */}
          <motion.div
            className={cn('h-full rounded-sm', getBatteryColor())}
            style={{ width: `${batteryLevel}%` }}
            animate={{ width: `${batteryLevel}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Battery cap */}
          <div className="absolute -right-0.5 top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-r bg-white/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
      {/* Battery icon */}
      <div className="relative">
        <div className="relative h-5 w-10 rounded-sm border-2 border-white/40">
          {/* Battery level fill */}
          <motion.div
            className={cn('h-full rounded-sm', getBatteryColor())}
            style={{ width: `${batteryLevel}%` }}
            animate={{ width: `${batteryLevel}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Battery cap */}
          <div className="absolute -right-1 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r border-2 border-l-0 border-white/40" />

          {/* Low battery warning animation */}
          {batteryLevel < 20 && (
            <motion.div
              className="absolute inset-0 rounded-sm bg-red-500"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Charging icon (not used, but kept for future) */}
        {false && (
          <BoltIcon className="absolute inset-0 m-auto h-3 w-3 text-yellow-400" />
        )}
      </div>

      {/* Battery percentage */}
      <span className={cn('text-xs font-medium tabular-nums', getBatteryTextColor())}>
        {Math.round(batteryLevel)}%
      </span>
    </div>
  );
}
