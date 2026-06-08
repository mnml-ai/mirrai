import SiteNavbar from "@/components/SiteNavbar";
import CustomHeroSection from "@/components/CustomHeroSection";
import CustomBriefForm from "@/components/CustomBriefForm";
import HomepageFinale from "@/components/HomepageFinale";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Custom Mirrors | MIRRAI",
  description: "Design a custom MIRRAI mirror for your space, size, lighting, and TV needs.",
  path: "/custom",
  image: "/images/custom-hero.png",
});

export function CustomPageContent({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <main className="custom-page" style={{ background: "#fff", minHeight: "100vh" }}>
      <SiteNavbar />
      <CustomHeroSection locale={locale} />
      <CustomBriefForm locale={locale} />
      <HomepageFinale showCta={false} locale={locale} routeKey="custom" />
    </main>
  );
}

export default function CustomPage() {
  return <CustomPageContent />;
}
