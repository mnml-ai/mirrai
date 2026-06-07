"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type MoonIntroCheckpointSectionProps = {
  sectionId?: string | null;
  locale?: Locale;
};

export default function MoonIntroCheckpointSection({
  sectionId = "moon-intro",
  locale = DEFAULT_LOCALE,
}: MoonIntroCheckpointSectionProps) {
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

            word.style.color = gsap.utils.interpolate(
              "#d9d9d9",
              "#141316",
              amount
            );
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

      let desktopVideoHasStarted = false;
      const desktopVideo = desktopVideoRef.current;

      animateMediaCard(desktopImageWrapRef.current, desktopVideo);

      ScrollTrigger.create({
        trigger: desktopImageWrapRef.current,
        start: "top 92%",
        end: "center 44%",
        scrub: 1,
        onUpdate: (self) => {
          if (!desktopVideo) return;

          if (self.progress >= 0.62 && !desktopVideoHasStarted) {
            desktopVideoHasStarted = true;
            desktopVideo.currentTime = 0;
            void desktopVideo.play();
          }

          if (self.progress < 0.42 && desktopVideoHasStarted) {
            desktopVideoHasStarted = false;
            desktopVideo.pause();
            desktopVideo.currentTime = 0;
          }
        },
      });

      animateMediaCard(mobileImageWrapRef.current, mobileVideoRef.current);
      mobileVideoRef.current?.play().catch(() => undefined);
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
        padding: "170px 40px 100px",
        fontFamily: "var(--font-moon), var(--font-body)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center gap-[155px]">
        <div className="w-full max-w-[1023px] text-center">
          <div
            className="moon-intro-heading"
            style={{
              lineHeight: "1.2",
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-condensed), var(--font-moon)",
                fontSize: "clamp(3.3rem, 6.6vw, 6.9rem)",
                lineHeight: "0.92",
                fontWeight: 800,
                letterSpacing: "-0.018em",
                textTransform: "uppercase",
                display: "flex",
                flexDirection: "column",
                gap: "0.08em",
              }}
            >
              {introLines.map((line, lineIndex) => {
                const previousWordCount = introLines.slice(0, lineIndex)
                  .join(" ")
                  .split(" ")
                  .filter(Boolean).length;
                const words = line.split(" ");

                return (
                  <span key={line} style={{ display: "block" }}>
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

        <div className="w-full">
          <div
            ref={desktopImageWrapRef}
            className="moon-intro-video-card hidden overflow-hidden md:block"
            style={{
              width: "100%",
              height: "min(720px, 52.9vw)",
              minHeight: "340px",
              borderRadius: "40px",
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
                borderRadius: "40px",
                transformOrigin: "center center",
              }}
            />
          </div>

          <div
            ref={mobileImageWrapRef}
            className="moon-intro-video-card mx-auto block overflow-hidden md:hidden"
            style={{
              width: "100%",
              maxWidth: "28rem",
              aspectRatio: "9 / 16",
              borderRadius: "28px",
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
