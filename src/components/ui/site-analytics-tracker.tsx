"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SiteAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = {
      path: `${window.location.pathname}${window.location.search}`,
      locale: document.documentElement.lang?.startsWith("en") ? "en" : "zh",
      referrer: document.referrer || "",
    };
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/page-view", blob);
      return;
    }

    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
