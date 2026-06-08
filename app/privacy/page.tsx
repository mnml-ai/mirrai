import { PrivacyPageContent } from "@/components/PrivacyContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy | MIRRAI",
  description: "How MIRRAI collects, uses, protects, and retains customer information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
