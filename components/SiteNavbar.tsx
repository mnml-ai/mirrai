"use client";

import { type Ref, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getDictionary,
  getLocaleFromPathname,
  getLocalizedHref,
  LOCALE_LABELS,
  stripLocaleFromPathname,
  switchLocalePathname,
  type Locale,
} from "@/lib/i18n";

const SITE_NAV_LINKS = [
  { key: "home", href: "/#home" },
  { key: "collection", href: "/collection" },
  { key: "custom", href: "/custom" },
  { key: "designers", href: "/designers" },
  { key: "developers", href: "/#developers" },
  { key: "contact", href: "/contact" },
] as const;

const MOBILE_LOGO_SCALE = 1;
const MOBILE_LOGO_X = 15;
const MOBILE_LOGO_Y = 10;
const MOBILE_MENU_BUTTON_SCALE = 0.9;
const MOBILE_MENU_BUTTON_X = 4;
const MOBILE_MENU_BUTTON_Y = -11;

function MirraiLogoTitle() {
  return (
    <span className="site-navbar-logo-title" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/mirrai-logo-no-slogan-transparent.png"
        width="1170"
        height="500"
        alt=""
        draggable={false}
      />
    </span>
  );
}

type SiteNavbarProps = {
  ctaRef?: Ref<HTMLAnchorElement>;
  variant?: "all" | "desktop" | "mobile";
};

export default function SiteNavbar({ ctaRef, variant = "all" }: SiteNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const cleanPathname = stripLocaleFromPathname(pathname);
  const showMobile = variant === "all" || variant === "mobile";
  const showDesktop = variant === "all" || variant === "desktop";
  const isCustomPage = cleanPathname === "/custom";
  const navLinks = SITE_NAV_LINKS.map((link) => ({
    ...link,
    label: dictionary.nav[link.key],
    href: getLocalizedHref(link.href, locale),
    baseHref: link.href,
  }));
  const isActiveLink = (href: string) => {
    if (href === "/#home") return cleanPathname === "/";
    if (href.startsWith("/#")) return false;
    return cleanPathname === href || cleanPathname.startsWith(`${href}/`);
  };
  const languageLinks: Array<{ locale: Locale; label: string; href: string; ariaLabel: string }> = [
    {
      locale: "en",
      label: LOCALE_LABELS.en,
      href: switchLocalePathname(pathname, "en"),
      ariaLabel: dictionary.language.switchToEnglish,
    },
    {
      locale: "ar",
      label: LOCALE_LABELS.ar,
      href: switchLocalePathname(pathname, "ar"),
      ariaLabel: dictionary.language.switchToArabic,
    },
  ];

  return (
    <>
      {showMobile ? (
        <nav className="mobile-hero-nav site-navbar-mobile" aria-label={dictionary.nav.mobile}>
          <a
            className="mobile-hero-logo"
            href={getLocalizedHref("/#home", locale)}
            aria-label={dictionary.nav.logoLabel}
            style={{
              transform: `translate3d(${MOBILE_LOGO_X}px, ${MOBILE_LOGO_Y}px, 0) scale(${MOBILE_LOGO_SCALE})`,
            }}
          >
            <MirraiLogoTitle />
          </a>
          <button
            className="mobile-hero-menu"
            type="button"
            aria-label={isMobileMenuOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-hero-menu-panel"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            style={{
              transform: `translate3d(${MOBILE_MENU_BUTTON_X}px, ${MOBILE_MENU_BUTTON_Y}px, 0) scale(${MOBILE_MENU_BUTTON_SCALE})`,
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <div
            id="mobile-hero-menu-panel"
            className="mobile-hero-menu-panel"
            data-open={isMobileMenuOpen}
          >
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.baseHref);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="mobile-hero-menu-languages" aria-label={dictionary.common.language}>
              {languageLinks.map((link) => (
                <a
                  key={link.locale}
                  href={link.href}
                  aria-label={link.ariaLabel}
                  aria-current={locale === link.locale ? "true" : undefined}
                  data-active={locale === link.locale}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      ) : null}

      {showDesktop ? (
        <nav
          className="hero-nav site-navbar-desktop flex items-center justify-between"
          data-custom-page={isCustomPage}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20000,
            isolation: "isolate",
            paddingTop: "1.45rem",
            paddingBottom: "1.45rem",
            paddingLeft: "4.15vw",
            paddingRight: "4.15vw",
            pointerEvents: "none",
          }}
        >
        <a
          className="nav-logo flex-shrink-0 select-none"
          href={getLocalizedHref("/#home", locale)}
          aria-label={dictionary.nav.logoLabel}
          style={{
            pointerEvents: "auto",
            textDecoration: "none",
          }}
        >
          <MirraiLogoTitle />
        </a>

        <ul
          className="pointer-events-auto absolute left-1/2 hidden lg:flex"
          style={{
            transform: "translateX(-50%)",
            gap: "1.18rem",
          }}
        >
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.baseHref);

            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="nav-link transition-colors duration-200"
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isActive ? "#C47640" : "#3A3A3A",
                    fontSize: "0.68rem",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C47640")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = isActive ? "#C47640" : "#3A3A3A")}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="site-navbar-actions pointer-events-auto relative z-[1] flex flex-shrink-0 items-center gap-3">
          <div
            className="site-navbar-language"
            aria-label={dictionary.common.language}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            {languageLinks.map((link, index) => (
              <span key={link.locale} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                {index > 0 ? <span aria-hidden style={{ color: "rgba(26, 26, 26, 0.38)" }}>/</span> : null}
                <a
                  href={link.href}
                  aria-label={link.ariaLabel}
                  aria-current={locale === link.locale ? "true" : undefined}
                  style={{
                    color: locale === link.locale ? "#C47640" : "#1A1A1A",
                    pointerEvents: "auto",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </a>
              </span>
            ))}
          </div>
          <a
            ref={ctaRef}
            href={getLocalizedHref("/collection", locale)}
            className="nav-cta pointer-events-auto relative z-[1] flex-shrink-0 transition-colors duration-300"
            style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            border: "1px solid #1A1A1A",
            borderRadius: "999px",
            padding: "0.65rem 1.85rem",
            color: "#1A1A1A",
            backgroundColor: "rgba(245, 243, 239, 0.98)",
            boxShadow:
              "0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
            whiteSpace: "nowrap",
            WebkitFontSmoothing: "antialiased",
            textDecoration: "none",
            }}
            onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.backgroundColor = "#1A1A1A";
            el.style.color = "#F5F3EF";
            el.style.boxShadow = "none";
            }}
            onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.backgroundColor = "rgba(245, 243, 239, 0.98)";
            el.style.color = "#1A1A1A";
            el.style.boxShadow =
              "0 1px 2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.5) inset";
            }}
          >
            {dictionary.nav.cta}
          </a>
        </div>
        </nav>
      ) : null}
    </>
  );
}
