import type { Metadata } from "next";
import { TermsPageContent } from "@/components/TermsContent";

export const metadata: Metadata = {
  title: "الشروط والأحكام | MIRRAI",
  description: "الشروط والأحكام الخاصة باستخدام موقع MIRRAI والمنتجات والخدمات وعمليات الشراء.",
};

export default function ArabicTermsPage() {
  return <TermsPageContent locale="ar" />;
}
