import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_LOCALE,
  getDictionary,
  getLocalizedHref,
  type Locale,
} from "@/lib/i18n";

type PartnerIcon = "pencil" | "puzzle" | "diamond" | "building" | "eye" | "gear";
type PartnerCardId = "interiorDesigners" | "hotelsProjects";

type PartnerCard = {
  id: PartnerCardId;
  variant: string;
  image: string;
  features: PartnerIcon[];
};

const PARTNER_CARDS: PartnerCard[] = [
  {
    id: "interiorDesigners",
    variant: "interior-designers",
    image: "/images/for-interior-designers.png?v=20260531a",
    features: ["pencil", "puzzle", "diamond", "building"],
  },
  {
    id: "hotelsProjects",
    variant: "hotels-projects",
    image: "/images/for-hotels.png?v=20260531a",
    features: ["building", "eye", "gear", "diamond"],
  },
];

const imageSizes =
  "(max-width: 767px) 92vw, (max-width: 1180px) 82vw, 88vw";

function PartnerFeatureIcon({ icon }: { icon: PartnerIcon }) {
  switch (icon) {
    case "pencil":
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <path d="M10 38h28" />
          <path d="M12 32v6h6l19-19-6-6-19 19Z" />
          <path d="m28 16 6 6" />
          <path d="M12 14h13" />
          <path d="M12 14v13" />
        </svg>
      );
    case "puzzle":
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <path d="M18 10h8v7a5 5 0 1 0 7 0v-7h7v12h-7a5 5 0 1 0 0 7h7v9H28v-7a5 5 0 1 0-7 0v7H10V27h7a5 5 0 1 0 0-7h-7V10h8Z" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <path d="M9 18 17 9h14l8 9-15 21L9 18Z" />
          <path d="M9 18h30" />
          <path d="m17 9 7 30 7-30" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <path d="M10 39h28" />
          <path d="M14 39V14h12v25" />
          <path d="M26 39V22h10v17" />
          <path d="M18 20h4M18 27h4M18 34h4M30 28h2M30 34h2" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <path d="M6 24s7-11 18-11 18 11 18 11-7 11-18 11S6 24 6 24Z" />
          <circle cx="24" cy="24" r="6" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 48 48" aria-hidden>
          <circle cx="24" cy="24" r="6" />
          <path d="m24 6 3 5 6 2 6-2 3 6-4 5v6l4 5-3 6-6-2-6 2-3 5-6-3 1-6-4-5h-6v-6h6l4-5-1-6 6-3Z" />
        </svg>
      );
  }
}

type ProfessionalPartnersSectionProps = {
  locale?: Locale;
};

export default function ProfessionalPartnersSection({
  locale = DEFAULT_LOCALE,
}: ProfessionalPartnersSectionProps = {}) {
  const dictionary = getDictionary(locale);

  return (
    <section id="designers" className="professional-partners-section" aria-labelledby="professional-partners-title">
      <h2 id="professional-partners-title" className="professional-partners-title">
        {dictionary.professionalPartners.title}
      </h2>
      <div className="professional-partners-inner">
        {PARTNER_CARDS.map((card) => {
          const cardCopy = dictionary.professionalPartners.cards[card.id];
          const cardClassName = `professional-partners-card professional-partners-card--${card.variant}`;
          const cardContent = (
            <>
              <Image
                src={card.image}
                alt=""
                aria-hidden
                fill
                sizes={imageSizes}
                quality={94}
                className="professional-partners-card-image"
              />
              <div className="professional-partners-card-content">
                <p className="professional-partners-kicker">{dictionary.professionalPartners.kicker}</p>
                <h3>{cardCopy.heading}</h3>
                <span className="professional-partners-rule" aria-hidden />
                <p className="professional-partners-copy">{cardCopy.body}</p>
                <ul
                  className="professional-partners-features"
                  aria-label={`${cardCopy.heading} ${dictionary.professionalPartners.featuresLabel}`}
                >
                  {cardCopy.features.map((label, index) => (
                    <li key={label}>
                      <PartnerFeatureIcon icon={card.features[index]} />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                {card.id === "interiorDesigners" ? (
                  <span className="professional-partners-action">
                    <span>{cardCopy.cta}</span>
                    <span aria-hidden>{dictionary.common.arrow}</span>
                  </span>
                ) : (
                  <a href={getLocalizedHref("/contact", locale)} className="professional-partners-action">
                    <span>{cardCopy.cta}</span>
                    <span aria-hidden>{dictionary.common.arrow}</span>
                  </a>
                )}
              </div>
            </>
          );

          if (card.id === "interiorDesigners") {
            return (
              <Link
                className={`${cardClassName} professional-partners-card--link`}
                href={getLocalizedHref("/designers", locale)}
                aria-label={cardCopy.heading}
                key={card.id}
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <article
              className={cardClassName}
              key={card.id}
            >
              {cardContent}
            </article>
          );
        })}
      </div>
    </section>
  );
}
