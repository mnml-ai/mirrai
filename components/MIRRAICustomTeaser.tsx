"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { getDictionary, getLocaleFromPathname, getLocalizedHref } from "@/lib/i18n";

const FEATURE_ITEMS = [
  {
    icon: "/icons/custom-icon-made-to-measure.svg",
  },
  {
    icon: "/icons/custom-icon-custom-shapes.svg",
  },
  {
    icon: "/icons/custom-icon-premium-finishes.svg",
  },
] as const;

export default function MIRRAICustomTeaser() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const whatsappCustomUrl = `https://wa.me/201144582331?text=${encodeURIComponent(dictionary.whatsapp.smartMirrorPrefill)}`;
  const customTeaserStyle = {
    "--mirrai-custom-desktop-section-y": "-190px",
    "--mirrai-custom-desktop-visual-y": "235px",
    "--mirrai-custom-desktop-note-size": "12px",
    "--mirrai-custom-desktop-note-width": "320px",
    "--mirrai-custom-desktop-feature-scale": "0.84",
  } as CSSProperties;

  return (
    <section
      id="custom"
      className="mirrai-custom-teaser"
      aria-labelledby="mirrai-custom-teaser-title"
      style={customTeaserStyle}
    >
      <div className="mirrai-custom-teaser-card">
        <div className="mirrai-custom-teaser-copy">
          <p className="mirrai-custom-teaser-kicker">{dictionary.customTeaser.kicker}</p>
          <span className="mirrai-custom-teaser-rule" aria-hidden />
          <h2 id="mirrai-custom-teaser-title">
            <span>{dictionary.customTeaser.titleLine1}</span>
            <span>{dictionary.customTeaser.titleLine2}</span>
          </h2>
        </div>

        <div className="mirrai-custom-teaser-followup">
          <p className="mirrai-custom-teaser-body">
            {dictionary.customTeaser.body}
          </p>

          <div className="mirrai-custom-teaser-actions" aria-label={dictionary.customTeaser.actionsLabel}>
            <a className="mirrai-custom-teaser-button mirrai-custom-teaser-button--primary" href={getLocalizedHref("/custom", locale)}>
              <span>{dictionary.customTeaser.primaryCta}</span>
              <span aria-hidden>{dictionary.common.arrow}</span>
            </a>
            <a
              className="mirrai-custom-teaser-button mirrai-custom-teaser-button--secondary"
              href={whatsappCustomUrl}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="mirrai-custom-teaser-whatsapp-mark"
                viewBox="0 0 32 32"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.02 3.2C8.96 3.2 3.2 8.94 3.2 16c0 2.25.6 4.46 1.72 6.4L3.1 29.1l6.86-1.8a12.77 12.77 0 0 0 6.06 1.54c7.06 0 12.78-5.74 12.78-12.8S23.08 3.2 16.02 3.2Zm0 23.45c-1.9 0-3.75-.5-5.38-1.45l-.39-.23-4.07 1.07 1.08-3.97-.26-.41A10.56 10.56 0 0 1 5.38 16c0-5.87 4.77-10.65 10.64-10.65S26.65 10.13 26.65 16 21.88 26.65 16.02 26.65Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.58-1.59-.95-.85-1.6-1.91-1.78-2.23-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"
                />
              </svg>
              <span>{dictionary.customTeaser.whatsappCta}</span>
            </a>
          </div>

          <p className="mirrai-custom-teaser-note">
            <svg
              className="mirrai-custom-teaser-note-icon"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden
            >
              <circle cx="24" cy="24" r="18.5" />
              <path d="M24 24V8.8" />
              <path d="M24 24L33.8 18.4" />
              <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
            </svg>
            {dictionary.customTeaser.replyLine1}
            <br className="mirrai-custom-teaser-note-break" />
            {dictionary.customTeaser.replyLine2}
          </p>
        </div>

        <div className="mirrai-custom-teaser-visual" aria-label={dictionary.customTeaser.visualLabel}>
          <div className="mirrai-custom-teaser-spec">
            <div className="mirrai-custom-teaser-stage-label" aria-hidden>
              {dictionary.customTeaser.specLabels.map((label, index) => (
                <span key={label} style={{ "--label-index": index } as CSSProperties}>
                  {label}
                </span>
              ))}
            </div>

            {dictionary.customTeaser.specLabels.map((label, index) => (
              <span
                className={`mirrai-custom-teaser-spec-label mirrai-custom-teaser-spec-label--${index + 1}`}
                key={label}
              >
                {label}
              </span>
            ))}

            <span className="mirrai-custom-teaser-measure mirrai-custom-teaser-measure--top" aria-hidden />
            <span className="mirrai-custom-teaser-measure mirrai-custom-teaser-measure--right" aria-hidden />
            <span className="mirrai-custom-teaser-measure mirrai-custom-teaser-measure--bottom" aria-hidden />
            <span className="mirrai-custom-teaser-measure mirrai-custom-teaser-measure--left" aria-hidden />
            <span className="mirrai-custom-teaser-crosshair mirrai-custom-teaser-crosshair--x" aria-hidden />
            <span className="mirrai-custom-teaser-crosshair mirrai-custom-teaser-crosshair--y" aria-hidden />

            <div className="mirrai-custom-teaser-scene">
              <img className="mirrai-custom-teaser-cabinet" src="/images/custom-cabinet.png?v=20260531a" alt="" aria-hidden />
              <span className="mirrai-custom-teaser-wall-mask" aria-hidden />
              <div className="mirrai-custom-teaser-mirror-wrap">
                <div className="mirrai-custom-teaser-mirror" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        <div className="mirrai-custom-teaser-features" aria-label={dictionary.customTeaser.capabilitiesLabel}>
          {dictionary.customTeaser.features.map((feature, index) => (
            <article className="mirrai-custom-teaser-feature" key={feature.title}>
              <span className="mirrai-custom-teaser-feature-icon">
                <img src={FEATURE_ITEMS[index].icon} alt="" aria-hidden />
              </span>
              <span>
                <strong>{feature.title}</strong>
                <small>
                  {"descriptionLine1" in feature ? (
                    <>
                      {feature.descriptionLine1}
                      <br />
                      {feature.descriptionLine2}
                    </>
                  ) : (
                    feature.description
                  )}
                </small>
              </span>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
