"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type MoonIntroSectionProps = {
  sectionId?: string | null;
  locale?: Locale;
};

export default function MoonIntroSection({
  sectionId = "moon-intro",
  locale = DEFAULT_LOCALE,
}: MoonIntroSectionProps) {
  const dictionary = getDictionary(locale);
  const introLines = dictionary.moonIntro.lines;
  const sectionRef = useRef<HTMLElement>(null);
  const desktopImageWrapRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileImageWrapRef = useRef<HTMLDivElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const quoteWords = gsap.utils.toArray<HTMLElement>(".moon-intro-word");

      gsap.set(quoteWords, { color: "#d9d9d9" });

      gsap.from(".moon-intro-heading", {
        autoAlpha: 0,
        y: 42,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".moon-intro-heading",
          start: "top 78%",
        },
      });

      ScrollTrigger.create({
        trigger: ".moon-intro-heading",
        start: "top 72%",
        end: "bottom 58%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          quoteWords.forEach((word, index) => {
            const wordStart = index / quoteWords.length;
            const wordEnd = (index + 2.2) / quoteWords.length;
            const amount = gsap.utils.clamp(
              0,
              1,
              (progress - wordStart) / (wordEnd - wordStart)
            );

            word.style.color = gsap.utils.interpolate("#d9d9d9", "#141316", amount);
          });
        },
      });

      const animateMediaCard = (
        imageWrap: HTMLDivElement | null,
        media: HTMLElement | null
      ) => {
        if (!imageWrap || !media) return;

        gsap.set(imageWrap, { scale: 1 });

        gsap.fromTo(
          media,
          { scale: 1, y: "12%" },
          {
            scale: 1.16,
            y: "0%",
            ease: "none",
            scrollTrigger: {
              trigger: imageWrap,
              start: "top 92%",
              end: "center 44%",
              scrub: 1,
            },
          }
        );
      };

      const animateVideoCard = (
        imageWrap: HTMLDivElement | null,
        video: HTMLVideoElement | null
      ) => {
        if (!imageWrap || !video) return;

        animateMediaCard(imageWrap, video);
        let videoHasStarted = false;

        ScrollTrigger.create({
          trigger: imageWrap,
          start: "top 92%",
          end: "center 44%",
          scrub: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.62 && !videoHasStarted) {
              videoHasStarted = true;
              video.currentTime = 0;
              void video.play();
            }

            if (self.progress < 0.42 && videoHasStarted) {
              videoHasStarted = false;
              video.pause();
              video.currentTime = 0;
            }
          },
        });
      };

      animateVideoCard(desktopImageWrapRef.current, desktopVideoRef.current);
      animateMediaCard(mobileImageWrapRef.current, mobileVideoRef.current);

      const mobileVideo = mobileVideoRef.current;
      if (mobileVideo) {
        mobileVideo.load();
        void mobileVideo.play().catch(() => undefined);
      }

      const refreshScrollTriggers = () => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const refreshFrame = window.requestAnimationFrame(refreshScrollTriggers);
      const refreshTimers = [
        window.setTimeout(refreshScrollTriggers, 200),
        window.setTimeout(refreshScrollTriggers, 800),
      ];
      window.addEventListener("load", refreshScrollTriggers);
      window.addEventListener("orientationchange", refreshScrollTriggers);
      window.visualViewport?.addEventListener("resize", refreshScrollTriggers);

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        refreshTimers.forEach((timer) => window.clearTimeout(timer));
        window.removeEventListener("load", refreshScrollTriggers);
        window.removeEventListener("orientationchange", refreshScrollTriggers);
        window.visualViewport?.removeEventListener("resize", refreshScrollTriggers);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      id={sectionId ?? undefined}
      ref={sectionRef}
      className="relative z-10"
      style={{
        background: "#f5f4f1",
        color: "#141316",
        fontFamily: "var(--font-moon), var(--font-body)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center gap-[7.5rem] px-5 pt-32 pb-24 md:gap-[155px] md:px-10 md:py-[170px] md:pb-[100px]">
        <div
          className="w-full max-w-[1120px] text-center"
          style={
            {
              "--moon-intro-title-x": "clamp(0.75rem, 2.2vw, 2rem)",
              "--moon-intro-title-y": "80px",
            } as CSSProperties
          }
        >
            <div
              className="moon-intro-heading"
              style={{
                width: "100%",
                lineHeight: "0.92",
                fontWeight: 850,
                letterSpacing: "-0.02em",
                textAlign: "center",
                transform:
                  "translate3d(var(--moon-intro-title-x, 0px), var(--moon-intro-title-y, 80px), 0)",
              }}
            >
              <h2
                className="moon-intro-title moon-intro-title--tight"
                style={{
                  width: "100%",
                  margin: 0,
                  fontFamily: "var(--font-condensed), var(--font-moon), var(--font-body)",
                  fontSize: "clamp(3rem, 5.2vw, 6.35rem)",
                  fontWeight: 850,
                  lineHeight: "0.92",
                  letterSpacing: "-0.015em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--moon-intro-line-gap, 0.06em)",
                }}
              >
                {introLines.map((line, lineIndex) => {
                  const previousWordCount = introLines.slice(0, lineIndex)
                    .join(" ")
                    .split(" ")
                    .filter(Boolean).length;
                  const words = line.split(" ");

                  return (
                    <span key={line} style={{ display: "block", width: "100%", textAlign: "center" }}>
                      {words.map((word, wordIndex) => {
                        const globalIndex = previousWordCount + wordIndex;

                        return (
                          <span
                            key={`${word}-${globalIndex}`}
                            className="moon-intro-word"
                            style={{
                              display: "inline-block",
                              transition: "color 0.12s linear",
                            }}
                          >
                            {word}
                            {wordIndex < words.length - 1 ? "\u00A0" : ""}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </h2>
            </div>
        </div>

        <div
          className="flex flex-col items-center gap-5"
          style={{
            width: "100vw",
            marginInline: "calc(50% - 50vw)",
            transform: "translateX(calc((100vw - min(1360px, 100vw)) / 2))",
          }}
        >
          <div
            ref={desktopImageWrapRef}
            className="moon-intro-video-card hidden overflow-hidden md:block"
            style={{
              width: "min(1180px, calc(100vw - 80px))",
              maxWidth: "100%",
              height: "min(640px, 46vw)",
              minHeight: "340px",
              marginInline: "auto",
              borderRadius: "36px",
              transform: "scale(var(--moon-intro-video-scale, 1))",
              transformOrigin: "center center",
            }}
          >
            <video
              ref={desktopVideoRef}
              src="/videos/mirror-tv-landscape.mp4?v=1"
              className="h-full w-full"
              muted
              loop
              playsInline
              preload="auto"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                borderRadius: "36px",
                transformOrigin: "center center",
              }}
            />
          </div>

          <div
            ref={mobileImageWrapRef}
            className="moon-intro-video-card block overflow-hidden md:hidden"
            style={{
              width: "100%",
              maxWidth: "28rem",
              aspectRatio: "9 / 16",
              borderRadius: "28px",
              transform: "scale(var(--moon-intro-video-scale, 1))",
              transformOrigin: "center center",
            }}
          >
            <video
              ref={mobileVideoRef}
              src="/videos/mirror-video.mp4?v=2"
              className="h-full w-full"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                borderRadius: "28px",
                transformOrigin: "center center",
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
