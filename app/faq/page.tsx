import SiteNavbar from "@/components/SiteNavbar";
import HomepageFinale from "@/components/HomepageFinale";
import FaqAccordion from "@/components/FaqAccordion";
import { DEFAULT_LOCALE, getDictionary, getLocalizedHref, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FAQ | MIRRAI",
  description: "Everything you need to know before bringing MIRRAI into your space.",
  path: "/faq",
  image: "/images/faq/FAQ-hero-desktop.png",
});

type FaqPageContentProps = {
  locale?: Locale;
};

export function FaqPageContent({ locale = DEFAULT_LOCALE }: FaqPageContentProps) {
  const dictionary = getDictionary(locale);
  const faq = dictionary.faqPage;

  return (
    <main className="faq-page">
      <SiteNavbar />

      <section className="faq-hero" aria-labelledby="faq-page-title">
        <picture className="faq-hero-media" aria-hidden>
          <source srcSet="/images/faq/FAQ-hero-mobile-tall.png" media="(max-width: 430px) and (min-height: 780px)" />
          <source srcSet="/images/faq/FAQ-hero-mobile.png" media="(max-width: 640px)" />
          <source srcSet="/images/faq/FAQ-hero-iPad.png" media="(max-width: 1100px)" />
          <img src="/images/faq/FAQ-hero-desktop.png" alt="" />
        </picture>

        <div className="faq-hero-copy">
          <p>{faq.label}</p>
          <h1 id="faq-page-title">{faq.title}</h1>
          <span aria-hidden />
          <p>{faq.subtitle}</p>
        </div>
      </section>

      <section className="faq-section" aria-label={faq.label}>
        <FaqAccordion items={faq.items} />

        <div className="faq-cta">
          <div className="faq-cta-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-1" />
              <path d="M4 12v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2Z" />
              <path d="M20 12v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z" />
              <path d="M13 19h3" />
            </svg>
          </div>
          <div className="faq-cta-content">
            <h2>{faq.cta.title}</h2>
            <p>{faq.cta.body}</p>
          </div>
          <a className="faq-cta-button" href={getLocalizedHref("/contact", locale)}>
            {faq.cta.action}
          </a>
        </div>
      </section>

      <div className="homepage-finale-region faq-page-footer-region">
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="faq" />
      </div>
    </main>
  );
}

export default function FaqPage() {
  return <FaqPageContent />;
}
