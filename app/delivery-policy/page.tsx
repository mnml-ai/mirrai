import type { Metadata } from "next";
import { DeliveryPageContent } from "@/components/DeliveryContent";

export const metadata: Metadata = {
  title: "Delivery Policy | MIRRAI",
  description: "MIRRAI delivery, installation, inspection, timing, and fee policy.",
};

export default function DeliveryPolicyPage() {
  return <DeliveryPageContent />;
}
