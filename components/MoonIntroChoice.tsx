"use client";

import MoonIntroCheckpointSection from "@/components/MoonIntroCheckpointSection";
import MoonIntroSection from "@/components/MoonIntroSection";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export default function MoonIntroChoice({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <div id="moon-intro" className="relative">
      <div className="block md:hidden">
        <MoonIntroSection sectionId={null} locale={locale} />
      </div>

      <div className="hidden md:block">
        <MoonIntroCheckpointSection sectionId={null} locale={locale} />
      </div>
    </div>
  );
}
