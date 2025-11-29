import { useEffect, useMemo, useState } from 'react';
import { roles } from '../data/content';
import { Icon } from './Icon';

function getUniqueRoles(exclude = []) {
  const pool = roles.filter((r) => !exclude.includes(r.label));
  const random = pool[Math.floor(Math.random() * pool.length)];
  return random || roles[0];
}

export function SubtitleTicker() {
  const [slots, setSlots] = useState(() => {
    const first = getUniqueRoles();
    const second = getUniqueRoles([first.label]);
    const third = getUniqueRoles([first.label, second.label]);
    return [first, second, third];
  });

  const timers = useMemo(
    () => [0, 1, 2].map((i) => 2500 * (i + 1)),
    []
  );

  useEffect(() => {
    const intervals = slots.map((_, index) =>
      setInterval(() => {
        setSlots((current) => {
          const existing = current.map((c) => c.label);
          const next = getUniqueRoles(existing);
          const updated = [...current];
          updated[index] = next;
          return updated;
        });
      }, timers[index])
    );
    return () => intervals.forEach((id) => clearInterval(id));
  }, [timers]);

  const handleClick = (index) => {
    setSlots((current) => {
      const existing = current.map((c) => c.label);
      const next = getUniqueRoles(existing);
      const updated = [...current];
      updated[index] = next;
      return updated;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
      {slots.map((slot, index) => (
        <button
          key={slot.label + index}
          className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 hover:border-cyan-300 transition"
          onClick={() => handleClick(index)}
        >
          <Icon name={slot.icon} className="h-4 w-4" />
          <span>{slot.label}</span>
        </button>
      ))}
    </div>
  );
}
