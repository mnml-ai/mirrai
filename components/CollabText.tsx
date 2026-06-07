"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Each line appears twice (echo effect, like OVO)
const LINES = [
  "More than a mirror,",
  "More than a mirror,",
  "entertainment hidden",
  "entertainment hidden",
  "in your reflection.",
  "in your reflection.",
];

export default function CollabText() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* Clip-path sweeps LEFT → RIGHT across the brown overlay layer,
         exactly replicating the OVO scroll-color effect              */
      gsap.fromTo(
        ".collab-brown",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            end: "bottom 45%",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="px-6 md:px-14 py-20 md:py-28"
      style={{ background: "#EDEAE5" }}
    >
      {/* Text block — dark base + brown clip overlay, perfectly stacked */}
      <div className="relative inline-block w-full">
        {/* Base layer: near-black */}
        <div aria-hidden className="select-none">
          {LINES.map((line, i) => (
            <p
              key={i}
              className="font-bold uppercase leading-[0.95] block"
              style={{
                fontFamily: "var(--font-condensed)",
                fontSize: "clamp(2.8rem, 8.5vw, 8rem)",
                color: "#1A1A18",
                letterSpacing: "-0.01em",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Brown overlay — clip-path animated on scroll */}
        <div
          className="collab-brown absolute inset-0 pointer-events-none"
          aria-hidden
        >
          {LINES.map((line, i) => (
            <p
              key={i}
              className="font-bold uppercase leading-[0.95] block"
              style={{
                fontFamily: "var(--font-condensed)",
                fontSize: "clamp(2.8rem, 8.5vw, 8rem)",
                color: "#7A5535",
                letterSpacing: "-0.01em",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Sub-paragraph + CTAs */}
      <div className="mt-12 max-w-lg">
        <p
          className="uppercase text-sm leading-relaxed tracking-wider mb-8"
          style={{
            fontFamily: "var(--font-body)",
          color: "#1A1A18",
          opacity: 0.7,
          }}
        >
          Mirrai blends seamlessly into your home.
          Watch, interact, and stay informed — all from your reflection.
        </p>

        <div className="flex gap-4 flex-wrap">
          <a
            href="#about"
            className="px-7 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              fontFamily: "var(--font-body)",
              background: "#1A1A18",
              color: "#C8C5C0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#7A5535";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1A1A18";
            }}
          >
            About Mirai
          </a>
          <a
            href="#features"
            className="px-7 py-3.5 text-sm font-bold uppercase tracking-widest border transition-all duration-300 flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
            borderColor: "#1A1A18",
            color: "#1A1A18",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#7A5535";
            (e.currentTarget as HTMLElement).style.borderColor = "#7A5535";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#1A1A18";
            (e.currentTarget as HTMLElement).style.borderColor = "#1A1A18";
            }}
          >
            See Features <span>›</span>
          </a>
        </div>
      </div>
    </section>
  );
}
