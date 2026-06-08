import React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import ProductCollectionSection from "@/components/ProductCollectionSection";
import MIRRAICustomTeaser from "@/components/MIRRAICustomTeaser";
import HomepageFinale from "@/components/HomepageFinale";
import { DEFAULT_LOCALE, getDictionary, getLocalizedHref, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Collection | MIRRAI",
  description: "Explore MIRRAI smart mirror collections for refined interiors.",
  path: "/collection",
  image: "/images/collection-section.png",
});

export function CollectionPageContent({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <main className="collection-page">
      <SiteNavbar />

      <section className="collection-page-hero" aria-labelledby="collection-page-title">
        <Image
          src="/images/collection-section.png?v=20260531a"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          quality={92}
          className="collection-page-hero-image"
        />
        <div className="collection-page-hero-content">
          <nav className="collection-page-breadcrumb" aria-label={dictionary.collectionPage.breadcrumbAria}>
            <Link href={getLocalizedHref("/", locale)}>{dictionary.collectionPage.home}</Link>
            <span aria-hidden>/</span>
            <span>{dictionary.collectionPage.collection}</span>
          </nav>

          <h1 id="collection-page-title">
            {dictionary.collectionPage.titleLine1}
            <span>{dictionary.collectionPage.titleLine2}</span>
          </h1>
          <span className="collection-page-hero-rule" aria-hidden />
          <p>
            {dictionary.collectionPage.description}
          </p>
        </div>
      </section>

      <div className="homepage-beige-band">
        <ProductCollectionSection />
        <MIRRAICustomTeaser />
      </div>

      <div className="homepage-finale-region" style={{ "--hotels-card-overlap": "0px" } as React.CSSProperties}>
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="collection" />
      </div>
    </main>
  );
}

export default function CollectionPage() {
  return <CollectionPageContent />;
}
