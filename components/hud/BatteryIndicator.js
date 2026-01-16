import { Battery100Icon } from '@heroicons/react/24/outline';

export default function BatteryIndicator({ compact = false }) {
    return (
        <div className={`flex items-center gap-1 text-white/80 ${compact ? 'text-xs' : 'text-sm'}`}>
            <span className={compact ? 'hidden' : 'block'}>100%</span>
            <Battery100Icon className="h-5 w-5" />
        </div>
    );
}
