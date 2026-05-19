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

export function getTimeLeft(date: string) {
  const diff = new Date(date).getTime() - Date.now();

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
