import { DeliveryPageContent } from "@/components/DeliveryContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "سياسة التوصيل | MIRRAI",
  description: "سياسة MIRRAI للتوصيل والتركيب والفحص ومواعيد التسليم والرسوم.",
  path: "/ar/delivery-policy",
  locale: "ar",
});

export default function ArabicDeliveryPolicyPage() {
  return <DeliveryPageContent locale="ar" />;
}
