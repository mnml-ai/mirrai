import { CustomPageContent } from "../../custom/page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "تصميم خاص | MIRRAI",
  description: "صمم مرآة MIRRAI خاصة تناسب مساحتك ومقاسك والإضاءة والتلفاز.",
  path: "/ar/custom",
  locale: "ar",
  image: "/images/custom-hero.png",
});

export default function ArabicCustomPage() {
  return <CustomPageContent locale="ar" />;
}
