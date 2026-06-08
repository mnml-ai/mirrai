import {
  ProductPageContent,
  generateStaticParams,
} from "../../../products/[slug]/page";
import { getDictionary } from "@/lib/i18n";
import { isProductSlug } from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";

export { generateStaticParams };

type ArabicProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ArabicProductPageProps) {
  const { slug } = await params;

  if (!isProductSlug(slug)) {
    return {};
  }

  const product = getDictionary("ar").productCollection.products[slug];

  return createPageMetadata({
    title: `${product.name} | MIRRAI`,
    description: product.description,
    path: `/ar/products/${slug}`,
    locale: "ar",
    image: `/images/products_2560x1440px/${slug}_mirror.png`,
  });
}

export default function ArabicProductPage({ params }: ArabicProductPageProps) {
  return <ProductPageContent params={params} locale="ar" />;
}
