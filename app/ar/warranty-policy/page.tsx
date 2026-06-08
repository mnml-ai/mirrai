import { WarrantyPageContent } from "@/components/WarrantyContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "سياسة الضمان | MIRRAI",
  description: "سياسة ضمان MIRRAI وحدود التغطية والاستثناءات وشروط شاشات التلفزيون وخدمات الصيانة.",
  path: "/ar/warranty-policy",
  locale: "ar",
});

export default function ArabicWarrantyPolicyPage() {
  return <WarrantyPageContent locale="ar" />;
}
