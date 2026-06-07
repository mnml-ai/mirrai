import SiteNavbar from "@/components/SiteNavbar";
import HomepageFinale from "@/components/HomepageFinale";
import ContactForm from "@/components/ContactForm";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

type ContactPageContentProps = {
  locale?: Locale;
};

export function ContactPageContent({ locale = DEFAULT_LOCALE }: ContactPageContentProps) {
  const dictionary = getDictionary(locale);
  const contact = dictionary.contactPage;
  const emailHref = "mailto:Mirrai@odxstudio.com?subject=Website%20Contact%20us";
  const whatsappHref = `https://wa.me/201144582331?text=${encodeURIComponent(dictionary.whatsapp.smartMirrorPrefill)}`;

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

      <section className="contact-direct-cards" aria-label={dictionary.common.contactInformation}>
        <a className="contact-direct-card" href={emailHref}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
          </svg>
          <strong>{contact.directCards.email.title}</strong>
          <span>{contact.directCards.email.body}</span>
        </a>

        <a className="contact-direct-card" href={whatsappHref} target="_blank" rel="noreferrer">
          <svg className="contact-direct-whatsapp-icon" viewBox="0 0 32 32" aria-hidden>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.02 3.2C8.96 3.2 3.2 8.94 3.2 16c0 2.25.6 4.46 1.72 6.4L3.1 29.1l6.86-1.8a12.77 12.77 0 0 0 6.06 1.54c7.06 0 12.78-5.74 12.78-12.8S23.08 3.2 16.02 3.2Zm0 23.45c-1.9 0-3.75-.5-5.38-1.45l-.39-.23-4.07 1.07 1.08-3.97-.26-.41A10.56 10.56 0 0 1 5.38 16c0-5.87 4.77-10.65 10.64-10.65S26.65 10.13 26.65 16 21.88 26.65 16.02 26.65Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.58-1.59-.95-.85-1.6-1.91-1.78-2.23-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"
            />
          </svg>
          <strong>{contact.directCards.whatsapp.title}</strong>
          <span>{contact.directCards.whatsapp.body}</span>
        </a>
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
