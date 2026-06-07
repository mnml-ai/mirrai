import type { Metadata } from "next";
import { WarrantyPageContent } from "@/components/WarrantyContent";

export const metadata: Metadata = {
  title: "Warranty Policy | MIRRAI",
  description: "MIRRAI product warranty coverage, exclusions, TV screen terms, and maintenance service conditions.",
};

export default function WarrantyPolicyPage() {
  return <WarrantyPageContent />;
}
