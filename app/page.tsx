import Hero from "@/components/Hero";
import HomepageFinale from "@/components/HomepageFinale";
import InteractionDemoSection from "@/components/InteractionDemoSection";
import MIRRAICustomTeaser from "@/components/MIRRAICustomTeaser";
import MoonIntroChoice from "@/components/MoonIntroChoice";
import ProductCollectionSection from "@/components/ProductCollectionSection";
import ProfessionalPartnersSection from "@/components/ProfessionalPartnersSection";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mirrai — More Than a Mirror",
  description: "Entertainment, hidden in reflection.",
  path: "/",
});

export function HomePageContent({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <main style={{ background: "#F5F3EF" }}>
      <div id="home">
        <Hero locale={locale} />
      </div>
      <MoonIntroChoice locale={locale} />
      <div
        aria-hidden
        style={{
          height: "clamp(72px, 8vw, 132px)",
          background: "#f5f4f1",
        }}
      />
      <InteractionDemoSection
        key="interaction-demo-b"
        sectionSlug="Trial2"
        productPhotoSrc="/hero-product2.png?v=20260531a"
        productPhotoTransform={{ scale: 1.08, x: 183, y: -20 }}
        processStripHeightPx={195}
        mirrorModeTitleTransform={{ scale: 1.08, x: 224, y: 42 }}
        mirrorInteractionTransform={{ scale: 1.17, x: -138, y: 0 }}
        mirrorVideoMask={{
          tl: { x: 64.25, y: 26.99 },
          tr: { x: 93, y: 23.06 },
          br: { x: 92.95, y: 72.54 },
          bl: { x: 64.09, y: 69.78 },
        }}
        anchorId="trial2"
        mirrorTabletLayout={{
          mediaQuery: "(max-width: 1024px)",
        }}
        locale={locale}
      />
      <div className="homepage-beige-band">
        <ProductCollectionSection />
        <MIRRAICustomTeaser />
        <ProfessionalPartnersSection locale={locale} />
      </div>
      <div className="homepage-finale-region">
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale locale={locale} routeKey="home" />
      </div>
    </main>
  );
}

export default function Home() {
  return <HomePageContent />;
}
