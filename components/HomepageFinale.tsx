import Image from "next/image";
import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  LOCALES,
  getDictionary,
  getLocalizedHref,
  getLocalizedPath,
  type Locale,
  type SiteRouteKey,
} from "@/lib/i18n";

function FinaleIcon({ type }: { type: "file" | "calendar" | "whatsapp" | "mail" | "pin" }) {
  if (type === "file") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M7 3h7l4 4v14H7V3Z" />
        <path d="M14 3v5h4" />
        <path d="M10 12h5M10 16h5" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M5 5h14v15H5V5Z" />
        <path d="M8 3v4M16 3v4M5 10h14" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 6h16v12H4V6Z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (type === "pin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 21s6-6 6-11a6 6 0 0 0-12 0c0 5 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    );
  }

  return (
    <svg className="homepage-whatsapp-icon" viewBox="0 0 32 32" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.02 3.2C8.96 3.2 3.2 8.94 3.2 16c0 2.25.6 4.46 1.72 6.4L3.1 29.1l6.86-1.8a12.77 12.77 0 0 0 6.06 1.54c7.06 0 12.78-5.74 12.78-12.8S23.08 3.2 16.02 3.2Zm0 23.45c-1.9 0-3.75-.5-5.38-1.45l-.39-.23-4.07 1.07 1.08-3.97-.26-.41A10.56 10.56 0 0 1 5.38 16c0-5.87 4.77-10.65 10.64-10.65S26.65 10.13 26.65 16 21.88 26.65 16.02 26.65Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.58-1.59-.95-.85-1.6-1.91-1.78-2.23-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"
      />
    </svg>
  );
}

type SocialLabel = "Facebook" | "Instagram" | "TikTok";

const socialIconSrc: Record<SocialLabel, string> = {
  Facebook: "/images/facebook.png?v=20260531a",
  Instagram: "/images/instagram.png?v=20260531a",
  TikTok: "/images/tik-tok.png?v=20260531a",
};

const socialHref: Record<SocialLabel, string> = {
  Facebook: "#",
  Instagram: "https://www.instagram.com/homeco.eg",
  TikTok: "https://www.tiktok.com/@homeco.eg",
};

function SocialIcon({ label }: { label: SocialLabel }) {
  return (
    <a
      href={socialHref[label]}
      aria-label={label}
      className="homepage-footer-social-link"
      target={socialHref[label] === "#" ? undefined : "_blank"}
      rel={socialHref[label] === "#" ? undefined : "noreferrer"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={socialIconSrc[label]} alt="" aria-hidden />
    </a>
  );
}

type HomepageFinaleProps = {
  showCta?: boolean;
  locale?: Locale;
  routeKey?: SiteRouteKey;
  languagePath?: string;
};

export default function HomepageFinale({
  showCta = true,
  locale = DEFAULT_LOCALE,
  routeKey = "home",
  languagePath,
}: HomepageFinaleProps = {}) {
  const dictionary = getDictionary(locale);
  const whatsappUrl = `https://wa.me/201144582331?text=${encodeURIComponent(dictionary.whatsapp.smartMirrorPrefill)}`;
  const contactHref = getLocalizedHref("/contact", locale);

  return (
    <section className="homepage-finale" aria-labelledby={showCta ? "homepage-finale-title" : undefined}>
      {showCta && (
        <div className="homepage-final-cta">
          <Image
            src="/images/cta-background.png?v=20260531a"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 767px) 92vw, (max-width: 1180px) 88vw, 94vw"
            quality={94}
            className="homepage-final-cta-image"
          />
          <div className="homepage-final-cta-content">
            <h2 id="homepage-finale-title">{dictionary.footer.ctaTitle}</h2>
            <p>{dictionary.footer.ctaBody}</p>
            <div className="homepage-final-cta-actions" aria-label={dictionary.common.finalActions}>
              <a href="/brochure.pdf" className="homepage-final-cta-button homepage-final-cta-button--light">
                <FinaleIcon type="file" />
                <span>{dictionary.footer.downloadBrochure}</span>
              </a>
              <a href={contactHref} className="homepage-final-cta-button homepage-final-cta-button--bronze">
                <FinaleIcon type="calendar" />
                <span>{dictionary.footer.bookConsultation}</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="homepage-final-cta-button homepage-final-cta-button--light">
                <FinaleIcon type="whatsapp" />
                <span>{dictionary.footer.chatWhatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className="homepage-footer" id="contact">
        <div className="homepage-footer-brand">
          <p className="homepage-footer-mark" aria-hidden>
            M
          </p>
          <h3>{dictionary.common.mirrai}</h3>
          <p className="homepage-footer-brand-copy">
            {dictionary.footer.brandCopy}
          </p>
          <div className="homepage-footer-contact" aria-label={dictionary.common.contactInformation}>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <FinaleIcon type="whatsapp" />
              <span>{dictionary.common.whatsapp}</span>
            </a>
            <a href="mailto:hello@mirrai.com">
              <FinaleIcon type="mail" />
              <span>hello@mirrai.com</span>
            </a>
            <span>
              <FinaleIcon type="pin" />
              <span>{dictionary.footer.location}</span>
            </span>
          </div>
          <div className="homepage-footer-socials" aria-label={dictionary.common.socialLinks}>
            <SocialIcon label="Facebook" />
            <SocialIcon label="Instagram" />
            <SocialIcon label="TikTok" />
          </div>
        </div>

        <nav className="homepage-footer-sitemap" aria-label={dictionary.common.footerNavigation}>
          {dictionary.footer.groups.map((group) => (
            <details className="homepage-footer-group" key={group.title} open>
              <summary>{group.title}</summary>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={getLocalizedHref(link.href, locale)}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>

        <div className="homepage-footer-bottom">
          <p>{dictionary.footer.copyright}</p>
          <div className="homepage-footer-language" aria-label={dictionary.common.language}>
            {LOCALES.map((language, index) => (
              <span key={language}>
                {index > 0 ? <span aria-hidden> / </span> : null}
                <a
                  href={languagePath ? getLocalizedHref(languagePath, language) : getLocalizedPath(routeKey, language)}
                  aria-current={locale === language ? "true" : undefined}
                  aria-label={
                    language === "en"
                      ? dictionary.language.switchToEnglish
                      : dictionary.language.switchToArabic
                  }
                >
                  {LOCALE_LABELS[language]}
                </a>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </section>
  );
}
