import Image from "next/image";
import Link from "next/link";
import HomepageFinale from "@/components/HomepageFinale";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "For Designers & Architects | MIRRAI",
  description: "Trade and project support for interior designers, architects, and developers.",
  path: "/designers",
  image: "/images/designers/hero-desktop.jpg",
});

const whyItems = [
  {
    title: "Tailored to your design",
    body: "Fully customizable sizes, shapes and details to match your creative intent.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="M6 25V7h5v18H6Zm8 0V4h5v21h-5Zm8 0V11h4v14h-4ZM4 25h24" />
        <path d="m8 11 16 10M23 18l1 3-3 1" />
      </svg>
    ),
  },
  {
    title: "Finish & material flexibility",
    body: "Wide range of finishes, frame options and materials to suit every aesthetic.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <circle cx="13" cy="16" r="7" />
        <circle cx="19" cy="16" r="7" />
      </svg>
    ),
  },
  {
    title: "Dedicated project support",
    body: "Personal trade support from concept to installation and beyond.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <circle cx="11" cy="12" r="4" />
        <circle cx="21" cy="12" r="4" />
        <path d="M5 25c1-5 4-8 8-8M27 25c-1-5-4-8-8-8M10 24c1-4 3-6 6-6s5 2 6 6" />
      </svg>
    ),
  },
  {
    title: "Premium craftsmanship",
    body: "Meticulous craftsmanship and quality that reflect luxury design standards.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="M6 12h20l-10 14L6 12Z" />
        <path d="m10 12 3-5h6l3 5M13 7l3 19 3-19" />
      </svg>
    ),
  },
];

const spaces = [
  { title: "Living Room", image: "/images/designers/space-living.jpg?v=20260531a" },
  { title: "Bedroom", image: "/images/designers/space-bedroom.png?v=20260531a" },
  { title: "Dressing", image: "/images/designers/space-dressing.jpg?v=20260531a" },
  { title: "Hospitality", image: "/images/designers/space-hospitality.jpg?v=20260531a" },
  { title: "Villas", image: "/images/designers/space-villas.jpeg?v=20260531a" },
];

const processSteps = [
  {
    number: "01",
    title: "Brief",
    body: "Share your concept, drawings and project requirements.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="M9 4h10l4 4v20H9V4Z" />
        <path d="M19 4v6h4M13 15h6M13 20h6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Specify",
    body: "We provide tailored solutions, materials and confirmations.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="M5 23 18 10l4 4L9 27H5v-4Z" />
        <path d="m20 8 4-4 4 4-4 4M6 8h8M6 13h6" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Approve",
    body: "Review samples, drawings and finalize the details.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <circle cx="16" cy="16" r="11" />
        <path d="m10 16 4 4 8-9" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Deliver",
    body: "Precision manufacturing and on-time delivery to site.",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d="M4 10h15v12H4V10ZM19 14h5l4 4v4h-9v-8Z" />
        <circle cx="10" cy="24" r="2" />
        <circle cx="23" cy="24" r="2" />
      </svg>
    ),
  },
];

export function DesignersPageContent({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const designersCopy = dictionary.designersPage;
  const localizedWhyItems = whyItems.map((item, index) => ({
    ...item,
    ...designersCopy.whyItems[index],
  }));
  const localizedSpaces = spaces.map((space, index) => ({
    ...space,
    title: designersCopy.spaces[index],
  }));
  const localizedProcessSteps = processSteps.map((step, index) => ({
    ...step,
    ...designersCopy.processSteps[index],
  }));

  return (
    <main className="designers-page">
      <SiteNavbar />

      <section className="designers-hero" aria-labelledby="designers-title">
        <div className="designers-hero-copy">
          <p className="designers-kicker">{designersCopy.hero.kicker}</p>
          <h1 id="designers-title">
            {designersCopy.hero.titleBefore} <span>{designersCopy.hero.titleAccent}</span>
          </h1>
          <p>
            {designersCopy.hero.body}
          </p>
          <Link className="designers-button designers-button--outline" href="#designer-trade">
            {designersCopy.hero.cta}
            <span aria-hidden>{dictionary.common.arrow}</span>
          </Link>
        </div>
        <div className="designers-hero-media">
          <picture className="designers-picture">
            <source media="(max-width: 767px) and (min-height: 780px)" srcSet="/images/designers/hero-mobile-tall.jpg?v=20260531a" />
            <source media="(max-width: 767px)" srcSet="/images/designers/hero-mobile.jpg?v=20260531a" />
            <source media="(max-width: 1024px)" srcSet="/images/designers/hero-tablet.jpg?v=20260531a" />
            <Image
              src="/images/designers/hero-desktop.jpg?v=20260531a"
              alt={designersCopy.hero.imageAlt}
              fill
              priority
              sizes="100vw"
              quality={94}
            />
          </picture>
        </div>
      </section>

      <section className="designers-why" aria-labelledby="designers-why-title">
        <div className="designers-section-title">
          <span aria-hidden />
          <h2 id="designers-why-title">{designersCopy.whyTitle}</h2>
          <span aria-hidden />
        </div>
        <div className="designers-why-grid">
          {localizedWhyItems.map((item) => (
            <article key={item.title} className="designers-why-item">
              <div className="designers-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="designers-spaces" aria-labelledby="designers-spaces-title">
        <div className="designers-spaces-heading">
          <h2 id="designers-spaces-title">
            {designersCopy.spacesTitleBefore} <span>{designersCopy.spacesTitleAccent}</span>
          </h2>
          <span aria-hidden />
        </div>
        <div className="designers-space-grid">
          {localizedSpaces.map((space) => (
            <article className="designers-space-card" key={space.title}>
              <div className="designers-space-image">
                <Image src={space.image} alt="" fill sizes="(max-width: 767px) 86vw, 19vw" quality={90} />
              </div>
              <h3>{space.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="designers-process" aria-labelledby="designers-process-title">
        <div className="designers-section-title">
          <span aria-hidden />
          <h2 id="designers-process-title">{designersCopy.processTitle}</h2>
          <span aria-hidden />
        </div>
        <div className="designers-process-grid">
          {localizedProcessSteps.map((step) => (
            <article key={step.number} className="designers-process-step">
              <div className="designers-process-icon">{step.icon}</div>
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="designer-trade" className="designers-trade" aria-labelledby="designer-trade-title">
        <div className="designers-trade-copy">
          <p className="designers-kicker">{designersCopy.trade.kicker}</p>
          <h2 id="designer-trade-title">
            {designersCopy.trade.titleBefore} <span>{designersCopy.trade.titleAccent}</span>
          </h2>
          <p>
            {designersCopy.trade.body}
          </p>
        </div>
        <div className="designers-trade-action">
          <Link className="designers-button designers-button--filled" href="mailto:bd@mirrai.com?subject=MIRRAI%20Trade%20Access">
            {designersCopy.trade.cta}
            <span aria-hidden>{dictionary.common.arrow}</span>
          </Link>
          <p>
            {designersCopy.trade.emailLead} <a href="mailto:bd@mirrai.com">bd@Mirrai.com</a>
          </p>
        </div>
        <div className="designers-trade-media" aria-hidden>
          <picture className="designers-picture">
            <source media="(max-width: 767px) and (min-height: 780px)" srcSet="/images/designers/trade-cta-mobile-tall.png?v=20260531a" />
            <source media="(max-width: 767px)" srcSet="/images/designers/trade-cta-mobile.png?v=20260531a" />
            <source media="(max-width: 1024px)" srcSet="/images/designers/trade-cta-tablet.png?v=20260531a" />
            <Image
              src="/images/designers/trade-cta-desktop.png?v=20260531a"
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1024px) 100vw, 42vw"
              quality={92}
            />
          </picture>
        </div>
      </section>

      <div className="homepage-finale-region designers-footer-region">
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="designers" />
      </div>

      <style>{`
        .designers-page {
          background: #f5f3ef;
          color: #181511;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .designers-hero {
          position: relative;
          min-height: clamp(620px, 76vh, 820px);
          display: flex;
          align-items: flex-start;
          border-bottom: 1px solid rgba(141, 104, 64, 0.16);
          background: #f8f5ef;
          overflow: hidden;
          isolation: isolate;
        }

        .designers-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(90deg, rgba(248, 245, 239, 0.9) 0%, rgba(248, 245, 239, 0.64) 24%, rgba(248, 245, 239, 0.22) 48%, rgba(248, 245, 239, 0) 72%),
            linear-gradient(180deg, rgba(248, 245, 239, 0.38) 0%, rgba(248, 245, 239, 0) 34%);
          pointer-events: none;
        }

        [data-dir="rtl"] .designers-hero::before {
          background:
            linear-gradient(270deg, rgba(248, 245, 239, 0.9) 0%, rgba(248, 245, 239, 0.64) 24%, rgba(248, 245, 239, 0.22) 48%, rgba(248, 245, 239, 0) 72%),
            linear-gradient(180deg, rgba(248, 245, 239, 0.38) 0%, rgba(248, 245, 239, 0) 34%);
        }

        .designers-hero-copy {
          position: relative;
          z-index: 2;
          width: min(620px, calc(100% - 44px));
          padding: clamp(155px, 13vw, 190px) clamp(30px, 5.5vw, 78px) clamp(72px, 8vw, 112px);
        }

        [data-dir="rtl"] .designers-hero-copy {
          margin-left: auto;
          margin-right: 0;
          padding: clamp(155px, 13vw, 190px) clamp(30px, 5.5vw, 78px) clamp(72px, 8vw, 112px) 0;
          text-align: right;
        }

        .designers-kicker {
          margin: 0 0 1rem;
          color: #9c7046;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .designers-hero h1,
        .designers-trade h2,
        .designers-spaces-heading h2 {
          margin: 0;
          font-family: var(--font-quote), Georgia, serif;
          font-weight: 700;
          letter-spacing: -0.045em;
          line-height: 0.96;
        }

        .designers-hero h1 {
          max-width: 620px;
          font-size: clamp(3.4rem, 6vw, 6.7rem);
        }

        [data-dir="rtl"] .designers-hero h1 {
          max-width: 8.6em;
          margin-left: auto;
          letter-spacing: 0;
        }

        .designers-hero h1 span,
        .designers-trade h2 span,
        .designers-spaces-heading h2 span {
          color: #ad7a45;
          font-style: italic;
          font-weight: 500;
        }

        .designers-hero-copy > p:not(.designers-kicker) {
          max-width: 510px;
          margin: 2rem 0 2.1rem;
          padding-left: 1.25rem;
          border-left: 2px solid #b68a5b;
          color: rgba(24, 21, 17, 0.68);
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: clamp(0.95rem, 1.1vw, 1.08rem);
          line-height: 1.72;
        }

        [data-dir="rtl"] .designers-hero-copy > p:not(.designers-kicker) {
          margin-left: auto;
          margin-right: 0;
        }

        .designers-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1.1rem;
          min-height: 3.45rem;
          padding: 0 1.75rem;
          border: 1px solid #a87543;
          color: #1c1712;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 180ms ease, color 180ms ease, transform 180ms ease;
        }

        .designers-button:hover {
          transform: translateY(-1px);
        }

        .designers-button--outline {
          background: rgba(248, 245, 239, 0.72);
        }

        .designers-button--filled {
          background: #ad7a45;
          color: #fff;
          min-width: 245px;
        }

        [data-dir="rtl"] .designers-hero .designers-button {
          margin-left: 0;
          margin-right: auto;
        }

        .designers-hero-media {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .designers-picture {
          position: absolute;
          inset: 0;
          display: block;
        }

        .designers-hero-media img,
        .designers-trade-media img,
        .designers-space-image img {
          object-fit: cover;
        }

        [data-dir="rtl"] .designers-hero-media img {
          transform: scaleX(-1);
        }

        .designers-why,
        .designers-spaces,
        .designers-process {
          max-width: 1360px;
          margin: 0 auto;
          padding: clamp(54px, 6vw, 78px) clamp(22px, 5vw, 76px);
        }

        .designers-section-title {
          display: grid;
          grid-template-columns: minmax(70px, 1fr) auto minmax(70px, 1fr);
          align-items: center;
          gap: clamp(20px, 4vw, 46px);
          margin-bottom: clamp(38px, 4.4vw, 58px);
          text-align: center;
        }

        .designers-section-title span,
        .designers-spaces-heading > span {
          display: block;
          height: 1px;
          background: rgba(173, 122, 69, 0.42);
        }

        .designers-section-title h2 {
          margin: 0;
          font-family: var(--font-quote), Georgia, serif;
          font-size: clamp(1.55rem, 2vw, 2.1rem);
          letter-spacing: -0.03em;
          white-space: nowrap;
        }

        .designers-why-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .designers-why-item {
          position: relative;
          padding: 0 clamp(20px, 2.2vw, 38px);
          text-align: center;
        }

        .designers-why-item + .designers-why-item {
          border-left: 1px solid rgba(173, 122, 69, 0.36);
        }

        .designers-icon {
          width: 3rem;
          height: 3rem;
          margin: 0 auto 1.15rem;
          color: #b58552;
        }

        .designers-icon svg {
          width: 100%;
          height: 100%;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.35;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .designers-why-item h3,
        .designers-space-card h3,
        .designers-process-step h3 {
          margin: 0;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .designers-why-item p,
        .designers-process-step p,
        .designers-trade p {
          color: rgba(24, 21, 17, 0.62);
          font-family: var(--font-body), system-ui, sans-serif;
          line-height: 1.6;
        }

        .designers-why-item p {
          max-width: 240px;
          margin: 0.85rem auto 0;
          font-size: 0.86rem;
        }

        .designers-spaces {
          padding-top: 0;
        }

        .designers-spaces-heading {
          display: grid;
          grid-template-columns: minmax(185px, 250px) 1fr;
          gap: clamp(24px, 4vw, 64px);
          align-items: end;
          margin-bottom: 1.35rem;
        }

        .designers-spaces-heading h2 {
          font-size: clamp(2rem, 3vw, 3.1rem);
        }

        .designers-space-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: clamp(10px, 1.1vw, 16px);
        }

        .designers-space-card {
          overflow: hidden;
          border: 1px solid rgba(173, 122, 69, 0.28);
          border-radius: 8px;
          background: rgba(255, 252, 247, 0.72);
        }

        .designers-space-image {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }

        .designers-space-card h3 {
          min-height: 3.4rem;
          display: grid;
          place-items: center;
          color: rgba(24, 21, 17, 0.76);
        }

        .designers-process {
          padding-top: clamp(22px, 3vw, 42px);
        }

        .designers-process-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(24px, 4vw, 62px);
        }

        .designers-process-step {
          position: relative;
          text-align: center;
        }

        .designers-process-step:not(:last-child)::after {
          content: "›";
          position: absolute;
          right: calc(clamp(24px, 4vw, 62px) / -2);
          top: 2.1rem;
          color: #a87543;
          font-size: 2.4rem;
          line-height: 1;
        }

        .designers-process-step strong {
          display: block;
          margin-bottom: 0.85rem;
          color: #ad7a45;
          font-family: var(--font-quote), Georgia, serif;
          font-size: 1.6rem;
          font-weight: 500;
        }

        .designers-process-icon {
          width: 2.25rem;
          height: 2.25rem;
          margin: 0 auto 0.75rem;
          color: #b58552;
        }

        .designers-process-icon svg {
          width: 100%;
          height: 100%;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.35;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .designers-process-step p {
          max-width: 245px;
          margin: 0.7rem auto 0;
          font-size: 0.82rem;
        }

        .designers-trade {
          position: relative;
          min-height: clamp(620px, 44vw, 760px);
          display: grid;
          grid-template-columns: minmax(280px, 34%) minmax(260px, 24%) 1fr;
          align-items: center;
          gap: clamp(24px, 4vw, 70px);
          overflow: hidden;
          border-top: 1px solid rgba(173, 122, 69, 0.2);
          border-bottom: 1px solid rgba(173, 122, 69, 0.2);
          background: #eee6db;
          padding: clamp(38px, 4vw, 58px) clamp(28px, 5.5vw, 86px);
        }

        .designers-trade h2 {
          max-width: 480px;
          font-size: clamp(2.1rem, 3.4vw, 3.7rem);
        }

        .designers-trade p {
          max-width: 425px;
          margin: 1.1rem 0 0;
          font-size: 0.92rem;
        }

        .designers-trade-action {
          position: relative;
          z-index: 2;
        }

        .designers-trade-action p {
          text-align: center;
          font-size: 0.82rem;
        }

        .designers-trade-action a:not(.designers-button) {
          color: #9c7046;
          font-weight: 800;
          text-decoration: none;
        }

        .designers-trade-media {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(62vw, 1220px);
          opacity: 0.9;
        }

        .designers-trade-media img {
          object-position: center center;
        }

        .designers-footer-region {
          padding-top: 0;
        }

        @media (max-width: 1024px) {
          .designers-hero {
            min-height: clamp(640px, 82vh, 860px);
          }

          .designers-hero-copy {
            padding-top: clamp(136px, 17vw, 170px);
            padding-bottom: 58px;
          }

          .designers-hero-media {
            min-height: 100%;
          }

          .designers-why-grid,
          .designers-process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 34px 0;
          }

          .designers-why-item:nth-child(odd) {
            border-left: 0;
          }

          .designers-space-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .designers-process-step::after {
            display: none;
          }

          .designers-trade {
            grid-template-columns: 1fr;
            padding-right: clamp(28px, 5.5vw, 86px);
          }

          .designers-trade-media {
            position: relative;
            width: 100%;
            height: 280px;
            grid-row: 2;
            border-radius: 8px;
            overflow: hidden;
          }
        }

        @media (max-width: 767px) {
          .designers-hero {
            min-height: 720px;
          }

          .designers-hero-copy {
            width: min(100%, 440px);
            padding: 124px 22px 44px;
          }

          .designers-hero h1 {
            font-size: clamp(3rem, 15vw, 4.6rem);
          }

          .designers-hero-copy > p:not(.designers-kicker) {
            margin-top: 1.45rem;
            padding-left: 1rem;
          }

          .designers-hero-media {
            min-height: 100%;
          }

          .designers-section-title {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .designers-section-title h2 {
            white-space: normal;
          }

          .designers-why-grid,
          .designers-process-grid,
          .designers-space-grid {
            grid-template-columns: 1fr;
          }

          .designers-why-item {
            border-left: 0 !important;
            padding: 0 12px 28px;
            border-bottom: 1px solid rgba(173, 122, 69, 0.24);
          }

          .designers-spaces-heading {
            grid-template-columns: 1fr;
          }

          .designers-space-image {
            aspect-ratio: 16 / 11;
          }

          .designers-trade {
            padding: 44px 22px;
          }

          .designers-trade-media {
            height: 230px;
          }
        }
      `}</style>
    </main>
  );
}

export default function DesignersPage() {
  return <DesignersPageContent />;
}
