"use client";

import { useEffect } from "react";
import { initBrowserPixels } from "@/lib/analytics";

export function AnalyticsTracker() {
  useEffect(() => {
    initBrowserPixels();
  }, []);

  return null;
}
