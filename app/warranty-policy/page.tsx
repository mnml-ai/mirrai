import { WarrantyPageContent } from "@/components/WarrantyContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Warranty Policy | MIRRAI",
  description: "MIRRAI product warranty coverage, exclusions, TV screen terms, and maintenance service conditions.",
  path: "/warranty-policy",
});

export default function WarrantyPolicyPage() {
  return <WarrantyPageContent />;
}
