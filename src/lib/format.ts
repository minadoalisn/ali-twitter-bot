export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date(date));
}

const sevenDayCycleMs = 7 * 86_400_000;

export function getSevenDayCycleEnd(date: string, nowMs = Date.now()) {
  const originalEndMs = new Date(date).getTime();

  if (!Number.isFinite(originalEndMs)) {
    return new Date(nowMs + sevenDayCycleMs);
  }

  let endMs = originalEndMs;
  const diff = endMs - nowMs;

  if (diff <= 0) {
    const missedCycles = Math.floor(Math.abs(diff) / sevenDayCycleMs) + 1;
    endMs += missedCycles * sevenDayCycleMs;
  } else if (diff > sevenDayCycleMs) {
    const futureCycles = Math.floor((diff - 1) / sevenDayCycleMs);
    endMs -= futureCycles * sevenDayCycleMs;
  }

  return new Date(endMs);
}

export function getSevenDayCycleDiffMs(date: string, nowMs = Date.now()) {
  return Math.max(0, getSevenDayCycleEnd(date, nowMs).getTime() - nowMs);
}

export function getTimeLeft(date: string) {
  const diff = getSevenDayCycleDiffMs(date);

  if (diff <= 0) return "等待下一轮";

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);

  if (days > 0) return `${days}天 ${hours}小时`;
  if (hours > 0) return `${hours}小时 ${minutes}分`;
  return `${minutes}分`;
}

export function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    ring: "戒指",
    necklace: "项链",
    earring: "耳环",
    bracelet: "手环",
    watch: "手表",
    stud: "耳钉",
    brooch: "胸针",
  };

  return labels[category] ?? category;
}
