import { CollectionPageContent } from "../../collection/page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "المجموعة | MIRRAI",
  description: "استكشف مجموعات مرايا MIRRAI الذكية للمساحات الراقية.",
  path: "/ar/collection",
  locale: "ar",
  image: "/images/collection-section.png",
});

export default function ArabicCollectionPage() {
  return <CollectionPageContent locale="ar" />;
}
