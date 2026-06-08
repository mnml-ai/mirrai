import { FaqPageContent } from "../../faq/page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "الأسئلة الشائعة | MIRRAI",
  description: "كل ما تحتاج معرفته قبل إدخال MIRRAI إلى مساحتك.",
  path: "/ar/faq",
  locale: "ar",
  image: "/images/faq/FAQ-hero-desktop.png",
});

export default function ArabicFaqPage() {
  return <FaqPageContent locale="ar" />;
}
