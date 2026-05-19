"use client";

import { useEffect, useMemo, useState } from "react";

function getParts(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { days, hours, minutes, seconds };
}

export function Countdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const [parts, setParts] = useState(() => getParts(target));

  useEffect(() => {
    const timer = window.setInterval(() => setParts(getParts(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const items = useMemo(
    () => [
      { value: parts.days, label: "天" },
      { value: parts.hours, label: "时" },
      { value: parts.minutes, label: "分" },
      { value: parts.seconds, label: "秒" },
    ],
    [parts],
  );

  return (
    <div className={compact ? "grid grid-cols-4 gap-2" : "flex items-end gap-3 sm:gap-5"}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-end gap-3">
          <div className="text-center">
            <div className={compact ? "font-mono text-xl leading-none" : "font-mono text-3xl leading-none sm:text-5xl"}>
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="mt-2 text-[10px] text-[var(--ash)]">{item.label}</div>
          </div>
          {index < items.length - 1 ? <span className={compact ? "hidden" : "pb-5 font-mono text-2xl text-black/36"}>:</span> : null}
        </div>
      ))}
    </div>
  );
}
