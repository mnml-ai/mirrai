import { RefundPageContent } from "@/components/RefundContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Refund Policy | MIRRAI",
  description: "MIRRAI refund, return, cancellation, and custom-made product policy.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return <RefundPageContent />;
}
