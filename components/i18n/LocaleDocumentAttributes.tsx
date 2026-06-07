"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDirection, getLocaleFromPathname } from "@/lib/i18n";

export default function LocaleDocumentAttributes() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname);
    const direction = getDirection(locale);

    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.dataset.locale = locale;
    document.body.dataset.dir = direction;
  }, [pathname]);

  return null;
}
