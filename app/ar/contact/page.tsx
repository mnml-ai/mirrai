import { ContactPageContent } from "../../contact/page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "تواصل معنا | MIRRAI",
  description: "تواصل مع MIRRAI للاستفسارات، اختيار المقاسات، التصميم الخاص، ودعم المشاريع.",
  path: "/ar/contact",
  locale: "ar",
});

export default function ArabicContactPage() {
  return <ContactPageContent locale="ar" />;
}
