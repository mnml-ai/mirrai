import type { Metadata } from "next";
import { TermsPageContent } from "@/components/TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions | MIRRAI",
  description: "MIRRAI website, product, service, and purchase terms and conditions.",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
