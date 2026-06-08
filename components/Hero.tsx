"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteNavbar from "./SiteNavbar";
import {
  DEFAULT_LOCALE,
  getDictionary,
  getLocalizedHref,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

const MIRROR_MASK_POINTS = {
  tl: { x: 63.41, y: 27.91 },
  tr: { x: 93.35, y: 25.67 },
  br: { x: 93.39, y: 71.86 },
  bl: { x: 63.06, y: 67.74 },
};

const VIDEO_PREVIEW_SECONDS = 3;
const MOBILE_SMART_TV_HOLD_SECONDS = 1.5;
const MOBILE_SMART_TV_TURN_ON_SECONDS = 1.25;
const SMART_TV_TURN_ON_SECONDS = 1.25;
const MIRROR_MODE_HOLD_SECONDS = 1.5;
/** Matches `InteractionDemoSection` `anchorId` on Trial2 — Hero scroll target. */
const TRIAL2_SCROLL_ANCHOR_ID = "trial2";
/** Delay after hero JS initializes before the first mirror cycle starts. */
const HERO_MIRROR_AUTO_START_MS = 200;
const UI_TURN_ON_CLIP_START = "circle(0% at 50% 50%)";
const UI_TURN_ON_CLIP_END = "circle(150% at 50% 50%)";
const MOBILE_MIRROR_CYCLE_GAP_MS = 0;
const MOBILE_HERO_AUTO_START_MS = 200;
const MOBILE_MIRROR_MODE_HOLD_SECONDS = 2;
const MOBILE_ACTIONS_SCALE = 0.75;
const MOBILE_ACTIONS_X = -3;
const MOBILE_ACTIONS_Y = -162;
const MOBILE_BACKGROUND_SCALE = 1;
const MOBILE_BACKGROUND_X = 0;
const MOBILE_BACKGROUND_Y = -43;
const MOBILE_DEVICE_BLOCK_SCALE = 1.08;
const MOBILE_DEVICE_BLOCK_X = 0;
const MOBILE_DEVICE_BLOCK_Y = -262;
const MOBILE_VIDEO_ANIMATION_SRC = "/videos/Beachhhh-mobile.webp?v=2";

function HeroMobile({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const smartUiRef = useRef<HTMLImageElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const videoImageRef = useRef<HTMLImageElement>(null);
  const videoShutdownLineRef = useRef<HTMLDivElement>(null);
  const turnOnLineRef = useRef<HTMLDivElement>(null);
  const smartTitleRef = useRef<HTMLSpanElement>(null);
  const videoTitleRef = useRef<HTMLSpanElement>(null);
  const mirrorTitleRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const cycleTimeoutRef = useRef<number | null>(null);
  const introTimeoutRef = useRef<number | null>(null);
  const clearMobileCycle = useCallback(() => {
    if (cycleTimeoutRef.current !== null) {
      window.clearTimeout(cycleTimeoutRef.current);
      cycleTimeoutRef.current = null;
    }
  }, []);

  const startMobileTransformation = useCallback(() => {
    const smartUi = smartUiRef.current;
    const videoLayer = videoLayerRef.current;
    const videoImage = videoImageRef.current;
    const shutdownLine = videoShutdownLineRef.current;
    const turnOnLine = turnOnLineRef.current;
    const smartTitle = smartTitleRef.current;
    const videoTitle = videoTitleRef.current;
    const mirrorTitle = mirrorTitleRef.current;
    const titles = [smartTitle, videoTitle, mirrorTitle];

    if (!smartUi || !videoLayer || !smartTitle || !videoTitle || !mirrorTitle) return;

    if (introTimeoutRef.current !== null) {
      window.clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    clearMobileCycle();
    timelineRef.current?.kill();
    gsap.killTweensOf([
      smartUi,
      videoLayer,
      videoImage,
      shutdownLine,
      turnOnLine,
      ...titles,
    ]);

    timelineRef.current = gsap
      .timeline()
      .set(videoLayer, { autoAlpha: 0, y: 10, scale: 1 })
      .set(videoImage, { autoAlpha: 1, scaleY: 1 })
      .set(shutdownLine, { autoAlpha: 0, scaleY: 1 })
      .set(turnOnLine, { autoAlpha: 1 })
      .set(titles, { autoAlpha: 0, y: 8, clipPath: "inset(0 100% 0 0)" })
      .set(smartUi, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "brightness(1.14) blur(12px)",
        clipPath: UI_TURN_ON_CLIP_START,
      })
      .to(
        smartUi,
        {
          clipPath: UI_TURN_ON_CLIP_END,
          filter: "brightness(1) blur(0px)",
          duration: MOBILE_SMART_TV_TURN_ON_SECONDS,
          ease: "power3.inOut",
        },
        "+=0.06"
      )
      .fromTo(
        turnOnLine,
        { scaleX: 0.18, autoAlpha: 1 },
        { scaleX: 1, autoAlpha: 0, duration: 0.58, ease: "power2.out" },
        "<0.18"
      )
      .to(
        smartTitle,
        { autoAlpha: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.out" },
        "<0.42"
      )
      .to(smartTitle, { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.inOut" }, `+=${MOBILE_SMART_TV_HOLD_SECONDS}`)
      .to(smartUi, { autoAlpha: 0, y: -10, duration: 0.75, ease: "power2.inOut" }, "<")
      .to(videoLayer, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, "<0.15")
      .to(
        videoTitle,
        { autoAlpha: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.out" },
        "<0.18"
      )
      .to({}, { duration: VIDEO_PREVIEW_SECONDS })
      .to(videoTitle, { autoAlpha: 0, y: -8, duration: 0.28, ease: "power2.inOut" })
      .set(shutdownLine, { autoAlpha: 0, scaleY: 1 })
      .to(videoImage, {
        scaleY: 0.018,
        duration: 0.62,
        ease: "power3.inOut",
      })
      .to(shutdownLine, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, "-=0.18")
      .to(videoImage, { autoAlpha: 0, duration: 0.16, ease: "power2.out" }, "<")
      .to(shutdownLine, { autoAlpha: 0, duration: 0.42, ease: "power2.inOut" }, "+=0.08")
      .to(videoLayer, { autoAlpha: 0, duration: 0.12, ease: "power2.out" }, "<")
      .to(
        mirrorTitle,
        { autoAlpha: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.out" },
        "-=0.08"
      )
      .to(
        mirrorTitle,
        { autoAlpha: 0, y: -8, duration: 0.45, ease: "power2.inOut" },
        `+=${MOBILE_MIRROR_MODE_HOLD_SECONDS}`
      )
      .call(() => {
        gsap.set(videoImage, { autoAlpha: 1 });
      })
      .call(() => {
        cycleTimeoutRef.current = window.setTimeout(() => {
          cycleTimeoutRef.current = null;
          startMobileTransformation();
        }, MOBILE_MIRROR_CYCLE_GAP_MS);
      });
  }, [clearMobileCycle]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const prepareAndStart = () => {
      const container = containerRef.current;
      if (!container || !mobileQuery.matches) return;

      const smartUi = smartUiRef.current;
      const videoLayer = videoLayerRef.current;
      const titles = [smartTitleRef.current, videoTitleRef.current, mirrorTitleRef.current];

      gsap.set(smartUi, {
        autoAlpha: 0,
        y: 0,
        clipPath: UI_TURN_ON_CLIP_END,
        filter: "brightness(1) blur(0px)",
      });
      gsap.set(videoLayer, { autoAlpha: 0, y: 10, scale: 1 });
      gsap.set(videoImageRef.current, { autoAlpha: 1, scaleY: 1 });
      gsap.set(
        [videoShutdownLineRef.current, turnOnLineRef.current],
        { autoAlpha: 0 }
      );
      gsap.set(titles, { autoAlpha: 0, y: 8, clipPath: "inset(0 100% 0 0)" });

      if (introTimeoutRef.current !== null) window.clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = window.setTimeout(() => {
        introTimeoutRef.current = null;
        startMobileTransformation();
      }, MOBILE_HERO_AUTO_START_MS);
    };

    const startTimer = window.setTimeout(prepareAndStart, 150);
    mobileQuery.addEventListener("change", prepareAndStart);

    return () => {
      window.clearTimeout(startTimer);
      mobileQuery.removeEventListener("change", prepareAndStart);
      timelineRef.current?.kill();
      clearMobileCycle();
      if (introTimeoutRef.current !== null) window.clearTimeout(introTimeoutRef.current);
      gsap.set(videoLayerRef.current, { autoAlpha: 0 });
    };
  }, [clearMobileCycle, startMobileTransformation]);

  return (
    <section
      ref={containerRef}
      className="mobile-hero relative w-full overflow-hidden md:hidden"
      aria-label={dictionary.homeHero.mobileAriaLabel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mobile/hero-background-mobile.png?v=20260531a"
        alt=""
        aria-hidden
        className="mobile-hero-layer mobile-hero-background"
        style={{
          transform: `translate3d(${MOBILE_BACKGROUND_X}px, ${MOBILE_BACKGROUND_Y}px, 0) scale(${MOBILE_BACKGROUND_SCALE})`,
        }}
      />

      <SiteNavbar variant="mobile" />

      <div className="mobile-hero-copy">
        <div className="mobile-hero-text-block">
          <p className="mobile-hero-kicker">{dictionary.homeHero.mobileKicker}</p>
          <h1>{dictionary.homeHero.mobileTitle}</h1>
          <p className="mobile-hero-subtitle">
            {dictionary.homeHero.mobileSubtitle}
          </p>
        </div>
        <div
          className="mobile-hero-actions"
          style={{
            transform: `translate3d(${MOBILE_ACTIONS_X}px, ${MOBILE_ACTIONS_Y}px, 0) scale(${MOBILE_ACTIONS_SCALE})`,
          }}
        >
          <a href={getLocalizedHref("/#collection", locale)}>{dictionary.homeHero.exploreCollection}</a>
          <button type="button" onClick={startMobileTransformation}>
            {dictionary.homeHero.tryMe}
          </button>
        </div>
      </div>

      <div className="mobile-hero-device">
        <div
          className="mobile-hero-device-block"
          style={{
            transform: `translate3d(${MOBILE_DEVICE_BLOCK_X}px, ${MOBILE_DEVICE_BLOCK_Y}px, 0) scale(${MOBILE_DEVICE_BLOCK_SCALE})`,
          }}
        >
          <div className="mobile-hero-video" ref={videoLayerRef} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={videoImageRef}
              src={MOBILE_VIDEO_ANIMATION_SRC}
              alt=""
              className="mobile-hero-video-animation"
              aria-hidden
            />
            <div className="mobile-hero-shutdown-layer" aria-hidden>
              <div ref={videoShutdownLineRef} className="mobile-hero-shutdown-line" />
            </div>
          </div>

          <div className="mobile-hero-turnon-layer" aria-hidden>
            <div ref={turnOnLineRef} className="mobile-hero-turnon-line" />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mobile/hero-mirror-mobile.png?v=20260531a" alt="" aria-hidden className="mobile-hero-layer mobile-hero-mirror" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={smartUiRef}
            src="/mobile/hero-ui-mobile.png?v=20260531a"
            alt=""
            aria-hidden
            className="mobile-hero-layer mobile-hero-ui"
          />

          <div
            className="mobile-hero-mode-title mobile-hero-mode-title--modern"
            aria-hidden
            style={{
              transform: "translate(-50%, calc(-50% + var(--mobile-mode-title-y, 225px)))",
            }}
          >
            <span ref={smartTitleRef}>{dictionary.mirrorUi.modeSmart}</span>
            <span ref={videoTitleRef}>{dictionary.mirrorUi.modeVideo}</span>
            <span ref={mirrorTitleRef}>{dictionary.mirrorUi.modeMirror}</span>
          </div>

        </div>
      </div>

      <div className="mobile-hero-feature-strip" aria-label={dictionary.homeHero.productHighlights}>
        <span>{dictionary.homeHero.highlights[0]}</span>
        <span aria-hidden>•</span>
        <span>{dictionary.homeHero.highlights[1]}</span>
        <span aria-hidden>•</span>
        <span>{dictionary.homeHero.highlights[2]}</span>
      </div>

    </section>
  );
}

export default function Hero({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const homeHeroTitleLine2 =
    "titleLine2" in dictionary.homeHero ? dictionary.homeHero.titleLine2 : "";
  const containerRef = useRef<HTMLElement>(null);
  const mirrorUiRef = useRef<HTMLDivElement>(null);
  const mirrorUiInnerRef = useRef<HTMLDivElement>(null);
  const mirrorVideoRef = useRef<HTMLDivElement>(null);
  const mirrorVideoElementRef = useRef<HTMLVideoElement>(null);
  const shutdownTopRef = useRef<HTMLDivElement>(null);
  const shutdownBottomRef = useRef<HTMLDivElement>(null);
  const shutdownLineRef = useRef<HTMLDivElement>(null);
  const turnOnLineRef = useRef<HTMLDivElement>(null);
  const shutdownTopVideoRef = useRef<HTMLVideoElement>(null);
  const shutdownBottomVideoRef = useRef<HTMLVideoElement>(null);
  const modeTitleLayerRef = useRef<HTMLDivElement>(null);
  const smartTitleRef = useRef<HTMLSpanElement>(null);
  const movieTitleRef = useRef<HTMLSpanElement>(null);
  const mirrorTitleRef = useRef<HTMLSpanElement>(null);
  const navCtaRef = useRef<HTMLAnchorElement>(null);
  const transformationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const mirrorCycleTimeoutRef = useRef<number | null>(null);
  const mirrorIntroTimeoutRef = useRef<number | null>(null);

  const polygonPoints = Object.values(MIRROR_MASK_POINTS)
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const scrollToTrialInteraction = () => {
    const el = document.getElementById(TRIAL2_SCROLL_ANCHOR_ID);
    if (!el) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const startTransformation = useCallback(() => {
    const ui = mirrorUiRef.current;
    const uiInner = mirrorUiInnerRef.current;
    const video = mirrorVideoRef.current;
    const videoElement = mirrorVideoElementRef.current;
    const shutdownTop = shutdownTopRef.current;
    const shutdownBottom = shutdownBottomRef.current;
    const shutdownLine = shutdownLineRef.current;
    const shutdownTopVideo = shutdownTopVideoRef.current;
    const shutdownBottomVideo = shutdownBottomVideoRef.current;
    const turnOnLine = turnOnLineRef.current;
    const modeTitleLayer = modeTitleLayerRef.current;
    const smartTitle = smartTitleRef.current;
    const movieTitle = movieTitleRef.current;
    const mirrorTitle = mirrorTitleRef.current;
    const modeTitles = [smartTitle, movieTitle, mirrorTitle];

    if (!ui || !uiInner || !video || !turnOnLine) return;

    if (mirrorCycleTimeoutRef.current !== null) {
      window.clearTimeout(mirrorCycleTimeoutRef.current);
      mirrorCycleTimeoutRef.current = null;
    }

    transformationTimelineRef.current?.kill();
    gsap.killTweensOf([
      ui,
      uiInner,
      video,
      shutdownTop,
      shutdownBottom,
      shutdownLine,
      turnOnLine,
      modeTitleLayer,
      ...modeTitles,
    ]);

    transformationTimelineRef.current = gsap
      .timeline()
      .set(video, { autoAlpha: 0, y: 10 })
      .set([shutdownTop, shutdownBottom], { autoAlpha: 0, scaleY: 1 })
      .set(shutdownLine, { autoAlpha: 0, scaleY: 1 })
      .set(turnOnLine, { autoAlpha: 0, scaleX: 0.18 })
      .set(modeTitleLayer, { autoAlpha: 1 })
      .set(modeTitles, { autoAlpha: 0, y: 8, clipPath: "inset(0 100% 0 0)" })
      .set(ui, { autoAlpha: 1, y: 0 })
      .set(uiInner, {
        clipPath: UI_TURN_ON_CLIP_START,
        filter: "brightness(1.14) blur(12px)",
      })
      .to(uiInner, {
        clipPath: UI_TURN_ON_CLIP_END,
        filter: "brightness(1) blur(0px)",
        duration: SMART_TV_TURN_ON_SECONDS,
        ease: "power3.inOut",
      }, "+=0.06")
      .fromTo(
        turnOnLine,
        { scaleX: 0.18, autoAlpha: 1 },
        { scaleX: 1, autoAlpha: 0, duration: 0.58, ease: "power2.out" },
        "<0.18"
      )
      .to(smartTitle, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.72,
        ease: "power3.out",
      }, "<0.42")
      .to(smartTitle, { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.inOut" }, "+=0.45")
      .to(ui, { autoAlpha: 0, y: -10, duration: 0.75, ease: "power2.inOut" }, "<")
      .call(() => {
        if (videoElement) {
          videoElement.load();
          videoElement.currentTime = 0;
          void videoElement.play();
        }
      })
      .to(video, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, "<0.15")
      .to(movieTitle, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.72,
        ease: "power3.out",
      }, "<0.18")
      .call(() => {
        if (!videoElement) return;

        const shutdownTime = Math.max(videoElement.currentTime - 0.04, 0);

        [shutdownTopVideo, shutdownBottomVideo].forEach((splitVideo) => {
          if (!splitVideo) return;
          splitVideo.currentTime = shutdownTime;
          splitVideo.pause();
        });

        videoElement.pause();
      }, undefined, `+=${VIDEO_PREVIEW_SECONDS}`)
      .to(movieTitle, { autoAlpha: 0, y: -8, duration: 0.28, ease: "power2.inOut" })
      .set([shutdownTop, shutdownBottom], { autoAlpha: 1, scaleY: 1 })
      .set(shutdownLine, { autoAlpha: 0, scaleY: 1 })
      .set(mirrorVideoElementRef.current, { autoAlpha: 0 })
      .to([shutdownTop, shutdownBottom], {
        scaleY: 0.018,
        duration: 0.62,
        ease: "power3.inOut",
      })
      .to(shutdownLine, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, "-=0.18")
      .to([shutdownTop, shutdownBottom], { autoAlpha: 0, duration: 0.16, ease: "power2.out" }, "<")
      .to(shutdownLine, { autoAlpha: 0, duration: 0.42, ease: "power2.inOut" }, "+=0.08")
      .to(mirrorTitle, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.72,
        ease: "power3.out",
      }, "-=0.08")
      .to({}, { duration: MIRROR_MODE_HOLD_SECONDS })
      .to(video, { autoAlpha: 0, duration: 0.2, ease: "power2.out" })
      .call(() => {
        gsap.set(mirrorVideoElementRef.current, { autoAlpha: 1 });
        videoElement?.pause();
      })
      .call(() => {
        if (mirrorCycleTimeoutRef.current !== null) window.clearTimeout(mirrorCycleTimeoutRef.current);
        mirrorCycleTimeoutRef.current = window.setTimeout(() => {
          mirrorCycleTimeoutRef.current = null;
          startTransformation();
        }, 0);
      });
  }, []);

  useEffect(() => {
    return () => {
      transformationTimelineRef.current?.kill();
      if (mirrorCycleTimeoutRef.current !== null) window.clearTimeout(mirrorCycleTimeoutRef.current);
      if (mirrorIntroTimeoutRef.current !== null) window.clearTimeout(mirrorIntroTimeoutRef.current);
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set([mirrorUiRef.current, mirrorVideoRef.current], {
        autoAlpha: 0,
        y: 0,
      });
      gsap.set(mirrorUiInnerRef.current, {
        clipPath: UI_TURN_ON_CLIP_END,
        filter: "brightness(1) blur(0px)",
      });
      gsap.set(
        [shutdownTopRef.current, shutdownBottomRef.current, shutdownLineRef.current, turnOnLineRef.current],
        { autoAlpha: 0 }
      );
      gsap.set(
        [smartTitleRef.current, movieTitleRef.current, mirrorTitleRef.current],
        { autoAlpha: 0, y: 8, clipPath: "inset(0 100% 0 0)" }
      );
      gsap.set(modeTitleLayerRef.current, { autoAlpha: 0 });

      tl.from(".nav-logo", { y: -20, opacity: 0, duration: 0.7 })
        .from(".nav-link", { y: -14, opacity: 0, stagger: 0.07, duration: 0.5 }, "-=0.4");

      const cta = navCtaRef.current;
      if (cta) {
        tl.fromTo(
          cta,
          { autoAlpha: 0, y: -14 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.35"
        );
      }

      tl.from(".hero-label", { y: 18, opacity: 0, duration: 0.55 }, "-=0.3")
        .from(".hero-line", { y: "105%", duration: 0.85, stagger: 0.12 }, "-=0.3")
        .from(".hero-body", { y: 18, opacity: 0, duration: 0.55 }, "-=0.45")
        .from(".hero-watch", { y: 14, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      if (mirrorIntroTimeoutRef.current !== null) window.clearTimeout(mirrorIntroTimeoutRef.current);
      mirrorIntroTimeoutRef.current = window.setTimeout(() => {
        mirrorIntroTimeoutRef.current = null;
        startTransformation();
      }, HERO_MIRROR_AUTO_START_MS);

      tl.eventCallback("onComplete", () => {
        const el = navCtaRef.current;
        if (el) gsap.set(el, { autoAlpha: 1, y: 0 });
      });
    },
    { scope: containerRef, dependencies: [startTransformation] }
  );

  return (
    <>
      <HeroMobile dictionary={dictionary} locale={locale} />
      <section
        ref={containerRef}
        className="hero-shell relative hidden w-full overflow-hidden md:block"
        aria-label={dictionary.homeHero.ariaLabel}
      >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-product.png?v=20260531a"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(245,243,239,0.82) 0%, rgba(245,243,239,0.55) 38%, rgba(245,243,239,0.0) 65%)",
          pointerEvents: "none",
        }}
      />

      <div ref={mirrorUiRef} className="mirror-ui" aria-hidden>
        <div ref={mirrorUiInnerRef} className="mirror-ui-inner">
          <div className="mirror-time-block">
            <div className="mirror-time">10:30</div>
            <div className="mirror-date">{dictionary.mirrorUi.date}</div>
            <div className="mirror-weather">{dictionary.mirrorUi.weather}</div>
          </div>

          <div className="mirror-section-label">{dictionary.mirrorUi.trending}</div>
          <div className="mirror-show-strip" aria-label={dictionary.mirrorUi.trendingAria}>
            <img src="/icons/Shows.png?v=20260531a" alt="" />
          </div>

          <div className="mirror-section-label">{dictionary.mirrorUi.apps}</div>
          <div className="mirror-app-row" aria-label={dictionary.mirrorUi.appsAria}>
            <span className="app-card">
              <img className="app-logo app-logo-netflix" src="/icons/Netflix.png?v=20260531a" alt="" />
            </span>
            <span className="app-card">
              <img className="app-logo app-logo-youtube" src="/icons/YouTub.png?v=20260531a" alt="" />
            </span>
            <span className="app-card">
              <img className="app-logo app-logo-prime" src="/icons/PrimeVideo.png?v=20260531a" alt="" />
            </span>
            <span className="app-card">
              <img className="app-logo app-logo-apple" src="/icons/AppleTV.png?v=20260531a" alt="" />
            </span>
          </div>

          <div className="mirror-section-label">{dictionary.mirrorUi.shortcuts}</div>
          <div className="mirror-shortcuts" aria-label={dictionary.mirrorUi.controlsAria}>
            <span>
              <img src="/icons/Music.png?v=20260531a" alt="" />
              <small>{dictionary.mirrorUi.music}</small>
            </span>
            <span>
              <img src="/icons/Apps.png?v=20260531a" alt="" />
              <small>{dictionary.mirrorUi.apps}</small>
            </span>
            <span>
              <img src="/icons/AirPlay.png?v=20260531a" alt="" />
              <small>{dictionary.mirrorUi.airPlay}</small>
            </span>
            <span>
              <img src="/icons/Settings.png?v=20260531a" alt="" />
              <small>{dictionary.mirrorUi.settings}</small>
            </span>
          </div>
        </div>
      </div>

      <div className="mirror-turnon-layer" aria-hidden>
        <div ref={turnOnLineRef} className="mirror-turnon-line" />
      </div>

      <div ref={mirrorVideoRef} className="mirror-video-preview" aria-hidden>
        <video
          ref={mirrorVideoElementRef}
          className="mirror-video-element"
          src="/videos/hero_video.mp4?v=3"
          muted
          playsInline
          preload="auto"
        />
        <div className="mirror-shutdown-layer" aria-hidden>
          <div ref={shutdownTopRef} className="mirror-shutdown-half mirror-shutdown-top">
            <video
              ref={shutdownTopVideoRef}
              className="mirror-shutdown-video mirror-shutdown-video-top"
              src="/videos/hero_video.mp4?v=3"
              muted
              playsInline
              preload="auto"
            />
          </div>
          <div ref={shutdownBottomRef} className="mirror-shutdown-half mirror-shutdown-bottom">
            <video
              ref={shutdownBottomVideoRef}
              className="mirror-shutdown-video mirror-shutdown-video-bottom"
              src="/videos/hero_video.mp4?v=3"
              muted
              playsInline
              preload="auto"
            />
          </div>
          <div ref={shutdownLineRef} className="mirror-shutdown-line" />
        </div>
      </div>

      <div
        ref={modeTitleLayerRef}
        className="mirror-mode-title-layer"
        aria-hidden
        style={{
          position: "absolute",
          left: "63.06%",
          top: "25.67%",
          width: "30.33%",
          height: "46.19%",
          zIndex: 25,
        }}
      >
            <span ref={smartTitleRef} className="mirror-mode-title mirror-mode-title--smart">
          {dictionary.mirrorUi.modeSmart}
        </span>
        <span ref={movieTitleRef} className="mirror-mode-title">
          {dictionary.mirrorUi.modeMovie}
        </span>
        <span ref={mirrorTitleRef} className="mirror-mode-title">
          {dictionary.mirrorUi.modeMirror}
        </span>
      </div>

      <svg className="mirror-shape-debug" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points={polygonPoints} />
      </svg>

      <div
        className="hero-copy relative z-20 flex flex-col justify-center gap-5"
        style={{
          position: "absolute",
          top: "26.4%",
          maxWidth: "44vw",
          left: "4.15vw",
        }}
      >
        <p
          className="hero-label font-medium uppercase"
          style={{
            color: "#C47640",
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            textAlign: "left",
            whiteSpace: "nowrap",
          }}
        >
          {dictionary.homeHero.kicker}
        </p>

        <div className="-mt-2 flex flex-col gap-0">
          <div className="clip-wrap pr-2">
            <h1
              className="hero-line hero-headline-warm-gold leading-[0.92] uppercase whitespace-nowrap"
              style={{
                fontSize: "6.35vw",
                fontWeight: 400,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.045em",
              }}
            >
              {dictionary.homeHero.titleLine1}
            </h1>
          </div>
          {homeHeroTitleLine2 ? (
            <div className="clip-wrap pr-2">
              <h1
                className="hero-line hero-headline-warm-gold leading-[0.92] uppercase whitespace-nowrap"
                style={{
                  fontSize: "6.35vw",
                  fontWeight: 400,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.045em",
                }}
              >
                {homeHeroTitleLine2}
              </h1>
            </div>
          ) : null}
        </div>

        <div className="hero-body" style={{ marginTop: "0.75rem" }}>
          <div
            aria-hidden
            style={{
              width: "68px",
              height: "3px",
              background: "#8A5A24",
              marginBottom: "2.2rem",
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              color: "#4A4A4A",
              lineHeight: 1.35,
            }}
          >
            {dictionary.homeHero.body}
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToTrialInteraction}
          className="hero-watch group mt-7 flex cursor-pointer items-center gap-5 text-left"
          aria-label={dictionary.homeHero.watchAria}
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            position: "relative",
            zIndex: 40,
          }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-300 group-hover:bg-zinc-900"
            style={{ borderColor: "#1A1A1A" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="translate-x-[1px]"
            >
              <path
                d="M3 2L12 7L3 12V2Z"
                fill="currentColor"
                className="text-zinc-800 transition-colors duration-300 group-hover:text-white"
              />
            </svg>
          </div>
          <span
            className="font-medium uppercase text-zinc-700 transition-colors group-hover:text-zinc-900"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.58rem",
              letterSpacing: "0.16em",
            }}
          >
            {dictionary.homeHero.watchTransformation}
          </span>
        </button>
      </div>

      <div
        className="hero-scroll absolute z-20 flex flex-col items-start gap-2"
        style={{
          fontFamily: "var(--font-body)",
          left: "4.15vw",
          bottom: "8.4%",
        }}
      >
        <span className="text-[0.62rem] tracking-[0.25em] uppercase text-zinc-400">
          {dictionary.homeHero.scroll}
        </span>
        <svg className="scroll-arrow" width="14" height="22" viewBox="0 0 14 22" fill="none">
          <line x1="7" y1="0" x2="7" y2="18" stroke="#9CA3AF" strokeWidth="1.2" />
          <path d="M1 13L7 20L13 13" stroke="#9CA3AF" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      <SiteNavbar ctaRef={navCtaRef} variant="desktop" />
      </section>
    </>
  );
}
