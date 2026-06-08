import { RefundPageContent } from "@/components/RefundContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "سياسة الاسترجاع والاسترداد | MIRRAI",
  description: "سياسة MIRRAI للاسترجاع والاسترداد والإلغاء والمنتجات المصنعة حسب الطلب.",
  path: "/ar/refund-policy",
  locale: "ar",
});

export default function ArabicRefundPolicyPage() {
  return <RefundPageContent locale="ar" />;
}
