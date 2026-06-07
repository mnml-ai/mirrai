import type { Metadata } from "next";
import { DeliveryPageContent } from "@/components/DeliveryContent";

export const metadata: Metadata = {
  title: "سياسة التوصيل | MIRRAI",
  description: "سياسة MIRRAI للتوصيل والتركيب والفحص ومواعيد التسليم والرسوم.",
};

export default function ArabicDeliveryPolicyPage() {
  return <DeliveryPageContent locale="ar" />;
}
