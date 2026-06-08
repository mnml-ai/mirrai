import { PrivacyPageContent } from "@/components/PrivacyContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "سياسة الخصوصية | MIRRAI",
  description: "كيفية جمع MIRRAI لمعلومات العملاء واستخدامها وحمايتها والاحتفاظ بها.",
  path: "/ar/privacy",
  locale: "ar",
});

export default function ArabicPrivacyPage() {
  return <PrivacyPageContent locale="ar" />;
}
