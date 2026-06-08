import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

type HomepageFaqSeparatorProps = {
  locale?: Locale;
};

export default function HomepageFaqSeparator({
  locale = DEFAULT_LOCALE,
}: HomepageFaqSeparatorProps) {
  const dictionary = getDictionary(locale);
  const separator = dictionary.homepageFaqSeparator;

  return (
    <section className="homepage-faq-separator" aria-labelledby="homepage-faq-separator-title">
      <div className="homepage-faq-separator-inner">
        <p>{separator.kicker}</p>
        <span aria-hidden />
        <h2 id="homepage-faq-separator-title">{separator.title}</h2>
      </div>
    </section>
  );
}
