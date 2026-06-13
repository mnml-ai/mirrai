import SiteNavbar from "@/components/SiteNavbar";
import HomepageFinale from "@/components/HomepageFinale";
import ContactForm from "@/components/ContactForm";
import LegalCompanyInfo from "@/components/LegalCompanyInfo";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact Us | MIRRAI",
  description: "Contact MIRRAI for questions, sizing guidance, custom mirrors, and project support.",
  path: "/contact",
});

type ContactPageContentProps = {
  locale?: Locale;
};

export function ContactPageContent({ locale = DEFAULT_LOCALE }: ContactPageContentProps) {
  const dictionary = getDictionary(locale);
  const contact = dictionary.contactPage;
  const siteVisitUrl = "https://calendly.com/custom-mirrai-odxstudio/30min";
  const bookCallUrl = "https://calendly.com/mirrai-odxstudio/30min";

  return (
    <main className="contact-page">
      <SiteNavbar />

      <section className="contact-page-hero" aria-labelledby="contact-page-title">
        <div className="contact-page-mirror-outline" aria-hidden />

        <div className="contact-page-heading">
          <p>{contact.kicker}</p>
          <h1 id="contact-page-title">{contact.title}</h1>
          <span aria-hidden />
          <p>{contact.subtitle}</p>
        </div>

        <ContactForm contact={contact} arrow={dictionary.common.arrow} />

        <p className="contact-page-privacy">
          <span aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z" />
              <path d="m9.5 12 1.7 1.7 3.5-4" />
            </svg>
          </span>
          {contact.privacy}
        </p>
      </section>

      <section className="contact-direct-cards" aria-label={dictionary.common.finalActions}>
        <a className="contact-direct-card" href={siteVisitUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 21s6-6 6-11a6 6 0 0 0-12 0c0 5 6 11 6 11Z" />
            <circle cx="12" cy="10" r="2" />
          </svg>
          <strong>{contact.schedulingCards.siteVisit.title}</strong>
          <span>{contact.schedulingCards.siteVisit.body}</span>
        </a>

        <a className="contact-direct-card" href={bookCallUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 5h14v15H5V5Z" />
            <path d="M8 3v4M16 3v4M5 10h14" />
          </svg>
          <strong>{contact.schedulingCards.bookCall.title}</strong>
          <span>{contact.schedulingCards.bookCall.body}</span>
        </a>
      </section>

      <section className="contact-legal-section" aria-label="MIRRAI legal company information">
        <LegalCompanyInfo variant="contact" locale={locale} />
      </section>

      <div className="homepage-finale-region contact-page-footer-region">
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="contact" />
      </div>
    </main>
  );
}

export default function ContactPage() {
  return <ContactPageContent />;
}
