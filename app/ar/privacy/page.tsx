import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | MIRRAI",
  description: "كيفية جمع MIRRAI لمعلومات العملاء واستخدامها وحمايتها والاحتفاظ بها.",
};

export default function ArabicPrivacyPage() {
  return <PrivacyPageContent locale="ar" />;
}
