import { HomePageContent } from "../page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "MIRRAI — أكثر من مرآة",
  description: "الترفيه مخفي في الانعكاس.",
  path: "/ar",
  locale: "ar",
});

export default function ArabicHomePage() {
  return <HomePageContent locale="ar" />;
}
