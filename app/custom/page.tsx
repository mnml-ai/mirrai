import SiteNavbar from "@/components/SiteNavbar";
import CustomHeroSection from "@/components/CustomHeroSection";
import CustomBriefForm from "@/components/CustomBriefForm";
import HomepageFinale from "@/components/HomepageFinale";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

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
