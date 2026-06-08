import { DeliveryPageContent } from "@/components/DeliveryContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Delivery Policy | MIRRAI",
  description: "MIRRAI delivery, installation, inspection, timing, and fee policy.",
  path: "/delivery-policy",
});

export default function DeliveryPolicyPage() {
  return <DeliveryPageContent />;
}
