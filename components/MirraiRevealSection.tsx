"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REVEAL_VIDEO_SRC = "/videos/mirror-video.mp4";

export default function MirraiRevealSection({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.revealSection;

  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const light = lightRef.current;
      const frame = frameRef.current;
      const surface = surfaceRef.current;
      const video = videoRef.current;
      const glass = glassRef.current;
      const label = labelRef.current;
      const textItems = [kickerRef.current, headlineRef.current, subtitleRef.current];

      if (!light || !frame || !surface || !video || !glass) return;

      const playVideo = () => {
        const promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {
            /* autoplay may be blocked (data saver, etc.) — first frame still shows */
          });
        }
      };

      const mm = gsap.matchMedia();

      // Shared "off" initial state used by both animated branches.
      const setOffState = () => {
        gsap.set(light, { opacity: 0 });
        gsap.set(frame, { scale: 1.035 });
        gsap.set(surface, { opacity: 1 });
        gsap.set(video, { opacity: 0, scale: 1.08 });
        gsap.set(glass, { opacity: 0 });
        gsap.set(label, { opacity: 0, y: 8 });
        gsap.set(textItems, { opacity: 0, y: 26 });
      };

      const buildRevealTimeline = (tl: gsap.core.Timeline) => {
        // 1. warm backlight + floor pool glow in, mirror settles
        tl.to(light, { opacity: 1, duration: 1.3, ease: "power2.inOut" }, 0)
          .to(frame, { scale: 1, duration: 1.7, ease: "power2.out" }, 0)
          // 2. dark reflective glass fades, revealing the screen
          .to(surface, { opacity: 0, duration: 1.2, ease: "power2.inOut" }, "<0.2")
          // 3. hidden screen turns on (no stretch — original aspect kept)
          .to(video, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, "<")
          // 4. glass/reflection overlay settles above the video
          .to(glass, { opacity: 1, duration: 0.9, ease: "power1.inOut" }, "<0.5")
          .to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "<0.1")
          // 5. supporting text appears, final settled composition
          .to(
            textItems,
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out" },
            ">-0.3"
          );
      };

      // Desktop / tablet: pinned + scrubbed cinematic reveal.
      // ScrollTrigger pin uses position: fixed, so it is immune to the global
      // overflow-x: hidden that would otherwise break a CSS sticky pin.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        setOffState();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=120%",
            scrub: 1,
            pin: pinRef.current,
            anticipatePin: 1,
            onEnter: playVideo,
            onEnterBack: playVideo,
          },
        });

        buildRevealTimeline(tl);
      });

      // Mobile: lighter, non-pinned fade/scale reveal.
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        setOffState();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 25%",
            scrub: 1,
            onEnter: playVideo,
            onEnterBack: playVideo,
          },
        });

        buildRevealTimeline(tl);
      });

      // Reduced motion: no animation — everything stays in its revealed CSS state.

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [locale] }
  );

  return (
    <section
      ref={containerRef}
      className="mirrai-reveal-section"
      aria-label={copy.ariaLabel}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="mirrai-reveal-room" aria-hidden />

      <div ref={pinRef} className="mirrai-reveal-pin">
        <div className="mirrai-reveal-stage">
          <div className="mirrai-reveal-copy">
            <p className="mirrai-reveal-kicker" ref={kickerRef}>
              {copy.kicker}
            </p>
            <h2 className="mirrai-reveal-headline" ref={headlineRef}>
              {copy.headline}
            </h2>
            <p className="mirrai-reveal-subtitle" ref={subtitleRef}>
              {copy.subtitle}
            </p>
          </div>

          <div className="mirrai-reveal-frame-col">
            <div className="mirrai-reveal-light" ref={lightRef} aria-hidden>
              <span className="mirrai-reveal-glow" />
              <span className="mirrai-reveal-floor-pool" />
            </div>
            <div className="mirrai-reveal-frame" ref={frameRef}>
              <div className="mirrai-reveal-screen">
                <video
                  ref={videoRef}
                  className="mirrai-reveal-video"
                  src={REVEAL_VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                />
                <div className="mirrai-reveal-glass" ref={glassRef} aria-hidden />
                <span className="mirrai-reveal-video-label" ref={labelRef}>
                  {copy.videoLabel}
                </span>
              </div>
              <div className="mirrai-reveal-surface" ref={surfaceRef} aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
