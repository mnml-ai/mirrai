import { DesignersPageContent } from "../../designers/page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "للمصممين والمهندسين المعماريين | MIRRAI",
  description: "دعم تجاري ودعم مشاريع للمصممين الداخليين والمهندسين المعماريين والمطورين.",
  path: "/ar/designers",
  locale: "ar",
  image: "/images/designers/hero-desktop.jpg",
});

export default function ArabicDesignersPage() {
  return <DesignersPageContent locale="ar" />;
}
