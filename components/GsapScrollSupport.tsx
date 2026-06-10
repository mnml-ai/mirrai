"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Keeps ScrollTrigger + GSAP timelines aligned on iOS Safari (address bar, rotation, lazy layout). */
export default function GsapScrollSupport() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    try {
      if (typeof ScrollTrigger.normalizeScroll === "function") {
        ScrollTrigger.normalizeScroll(true);
      }
    } catch {
      /* optional iOS helper — skip if unavailable */
    }

    const refresh = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    refresh();

    const onOrientation = () => window.setTimeout(refresh, 200);

    window.addEventListener("load", refresh);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("pageshow", refresh);
    window.visualViewport?.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("pageshow", refresh);
      window.visualViewport?.removeEventListener("resize", refresh);
    };
  }, []);

  return null;
}
