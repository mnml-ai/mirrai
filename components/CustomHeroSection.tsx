"use client";

import Image from "next/image";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

export default function CustomHeroSection({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const whatsappCustomUrl = `https://wa.me/201144582331?text=${encodeURIComponent(dictionary.whatsapp.smartMirrorPrefill)}`;

  return (
    <section className="custom-hero-section">
      <Image
        className="custom-hero-background"
        src="/images/custom-hero1.png?v=20260531a"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        priority
      />
      <div className="custom-hero-grid">
        {/* Left Content */}
        <div className="custom-hero-content">
          <div className="custom-hero-main-copy">
            <p className="custom-hero-kicker">{dictionary.customPage.hero.kicker}</p>

            <h1 className="custom-hero-title">
              {dictionary.customPage.hero.titleLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < dictionary.customPage.hero.titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>

            <p className="custom-hero-description">
              {dictionary.customPage.hero.descriptionLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < dictionary.customPage.hero.descriptionLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>

            <div className="custom-hero-actions">
              <a className="custom-hero-button custom-hero-button--primary" href="#custom-brief">
                {dictionary.customPage.hero.primaryCta}
              </a>

              <a
                className="custom-hero-button custom-hero-button--secondary"
                href={whatsappCustomUrl}
                target="_blank"
                rel="noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                {dictionary.customPage.hero.whatsappCta}
              </a>
            </div>
          </div>

          <div className="custom-hero-features">
            <div className="custom-hero-feature">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
              <span>{dictionary.customPage.hero.features[0][0]}<br />{dictionary.customPage.hero.features[0][1]}</span>
            </div>

            <div className="custom-hero-feature">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 13L2 9z"/>
                <path d="M11 3 8 9l4 13 4-13-3-6"/>
                <path d="M2 9h20"/>
              </svg>
              <span>{dictionary.customPage.hero.features[1][0]}<br />{dictionary.customPage.hero.features[1][1]}</span>
            </div>

            <div className="custom-hero-feature">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>{dictionary.customPage.hero.features[2][0]}<br />{dictionary.customPage.hero.features[2][1]}</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .custom-hero-section {
          background:
            radial-gradient(circle at 16% 24%, rgba(255, 252, 246, 0.94), rgba(245, 239, 229, 0.86) 35%, rgba(238, 229, 216, 0.78) 100%);
          padding-top: calc(var(--site-navbar-offset) + 1rem);
          display: flex;
          align-items: stretch;
          color: #2b211c;
        }


        .custom-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          width: 100%;
          min-height: min(705px, calc(100svh - var(--site-navbar-offset) - 1rem));
        }

        .custom-hero-content {
          padding: clamp(64px, 9.2vw, 118px) 4.15vw clamp(64px, 7vw, 94px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 560px;
        }

        .custom-hero-kicker {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.24em;
          color: #a06d3e;
          margin: 0 0 0.8rem;
          text-transform: uppercase;
        }

        .custom-hero-title {
          font-family: var(--font-quote), Georgia, serif;
          font-size: clamp(3.25rem, 5.15vw, 5.35rem);
          font-weight: 500;
          color: #2b211c;
          line-height: 0.98;
          letter-spacing: -0.035em;
          margin: 0 0 1.55rem;
        }

        .custom-hero-description {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: clamp(0.88rem, 0.88vw, 1rem);
          line-height: 1.72;
          color: rgba(43, 33, 28, 0.72);
          margin: 0 0 2.15rem;
        }

        .custom-hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: nowrap;
          width: min(100%, 600px);
          margin-bottom: clamp(2.8rem, 4.5vw, 4.8rem);
        }

        .custom-hero-button {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          min-height: 52px;
          padding: 0 1.7rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 200ms ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          text-decoration: none;
        }

        .custom-hero-button--primary {
          background: linear-gradient(135deg, #b4854f, #c2945a);
          color: #fff;
          border: none;
          box-shadow: 0 14px 28px rgba(125, 82, 43, 0.13);
        }

        .custom-hero-button--primary:hover {
          background: linear-gradient(135deg, #9e7041, #b7834d);
        }

        .custom-hero-button--secondary {
          background: rgba(255, 255, 255, 0.58);
          color: #5b4030;
          border: 1px solid rgba(124, 83, 47, 0.42);
        }

        .custom-hero-button--secondary:hover {
          border-color: #9e7041;
          color: #9e7041;
          background: #fffaf4;
        }

        .custom-hero-features {
          display: grid;
          width: min(100%, 600px);
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .custom-hero-feature {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .custom-hero-feature:nth-child(1) {
          justify-self: start;
        }

        .custom-hero-feature:nth-child(2) {
          justify-self: center;
        }

        .custom-hero-feature:nth-child(3) {
          justify-self: end;
        }

        .custom-hero-feature:not(:last-child)::after {
          content: none;
        }

        .custom-hero-feature span {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #2f2925;
          line-height: 1.42;
          word-break: keep-all;
          white-space: nowrap;
        }

        .custom-hero-image {
          position: relative;
          width: 100%;
          min-height: 420px;
        }

        @media (min-width: 1024px) {
          .custom-hero-grid {
            grid-template-columns: 44% 56%;
          }

          .custom-hero-image {
            min-height: 100%;
          }
        }

        @media (max-width: 767px) {
          .custom-hero-section {
            overflow: hidden;
          }

          .custom-hero-content {
            width: 100%;
            max-width: none;
            min-width: 0;
            padding: 5.8rem 1rem 2.8rem;
          }

          .custom-hero-main-copy {
            width: 100%;
            min-width: 0;
          }

          .custom-hero-title {
            max-width: 9em;
            font-size: clamp(2.35rem, 12vw, 3.55rem);
            line-height: 1.05;
            letter-spacing: 0;
          }

          .custom-hero-description {
            max-width: 100%;
          }

          .custom-hero-actions {
            width: 100%;
            max-width: 100%;
            flex-wrap: wrap;
            gap: 0.72rem;
            margin-bottom: 1.35rem;
          }

          .custom-hero-button {
            min-width: 0;
            flex: 1 1 100%;
            padding-inline: 0.95rem;
            text-align: center;
            white-space: normal;
          }

          .custom-hero-features {
            width: 100%;
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }

          .custom-hero-feature,
          .custom-hero-feature:nth-child(n) {
            justify-self: stretch;
          }

          .custom-hero-feature span {
            white-space: normal;
          }
        }
      `}</style>
    </section>
  );
}
