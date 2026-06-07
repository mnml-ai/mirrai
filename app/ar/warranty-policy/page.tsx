import type { Metadata } from "next";
import { WarrantyPageContent } from "@/components/WarrantyContent";

export const metadata: Metadata = {
  title: "سياسة الضمان | MIRRAI",
  description: "سياسة ضمان MIRRAI وحدود التغطية والاستثناءات وشروط شاشات التلفزيون وخدمات الصيانة.",
};

export default function ArabicWarrantyPolicyPage() {
  return <WarrantyPageContent locale="ar" />;
}
