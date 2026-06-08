import { TermsPageContent } from "@/components/TermsContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms & Conditions | MIRRAI",
  description: "MIRRAI website, product, service, and purchase terms and conditions.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsPageContent />;
}
