import type { Metadata } from "next";
import { RefundPageContent } from "@/components/RefundContent";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع والاسترداد | MIRRAI",
  description: "سياسة MIRRAI للاسترجاع والاسترداد والإلغاء والمنتجات المصنعة حسب الطلب.",
};

export default function ArabicRefundPolicyPage() {
  return <RefundPageContent locale="ar" />;
}
