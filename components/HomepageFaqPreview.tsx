import FaqAccordion from "@/components/FaqAccordion";
import {
  DEFAULT_LOCALE,
  getDictionary,
  getLocalizedHref,
  type Locale,
} from "@/lib/i18n";

const HOMEPAGE_FAQ_INDEXES = [0, 1, 2, 3, 4, 5, 6, 8] as const;

type HomepageFaqPreviewProps = {
  locale?: Locale;
};

export default function HomepageFaqPreview({
  locale = DEFAULT_LOCALE,
}: HomepageFaqPreviewProps) {
  const dictionary = getDictionary(locale);
  const preview = dictionary.homepageFaq;
  const items = HOMEPAGE_FAQ_INDEXES.map((index) => dictionary.faqPage.items[index]).filter(Boolean);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="homepage-faq-preview" aria-labelledby="homepage-faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="homepage-faq-preview-inner">
        <div className="homepage-faq-preview-header">
          <p>{preview.kicker}</p>
          <h2 id="homepage-faq-title">{preview.title}</h2>
          <span aria-hidden />
          <p>{preview.subtitle}</p>
        </div>

        <div className="homepage-faq-preview-list">
          <FaqAccordion
            items={items}
            idPrefix={`homepage-faq-${locale}`}
            defaultOpenIndex={0}
          />
          <a className="homepage-faq-preview-link" href={getLocalizedHref("/faq", locale)}>
            <span>{preview.action}</span>
            <span aria-hidden>{dictionary.common.arrow}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
