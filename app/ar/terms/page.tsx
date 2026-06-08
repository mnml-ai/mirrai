import { TermsPageContent } from "@/components/TermsContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "الشروط والأحكام | MIRRAI",
  description: "الشروط والأحكام الخاصة باستخدام موقع MIRRAI والمنتجات والخدمات وعمليات الشراء.",
  path: "/ar/terms",
  locale: "ar",
});

export default function ArabicTermsPage() {
  return <TermsPageContent locale="ar" />;
}
