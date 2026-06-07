import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | MIRRAI",
  description: "How MIRRAI collects, uses, protects, and retains customer information.",
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
