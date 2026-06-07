import type { Metadata } from "next";
import { RefundPageContent } from "@/components/RefundContent";

export const metadata: Metadata = {
  title: "Refund Policy | MIRRAI",
  description: "MIRRAI refund, return, cancellation, and custom-made product policy.",
};

export default function RefundPolicyPage() {
  return <RefundPageContent />;
}
