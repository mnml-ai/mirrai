import {
  ProductPageContent,
  generateStaticParams,
} from "../../../products/[slug]/page";

export { generateStaticParams };

type ArabicProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ArabicProductPage({ params }: ArabicProductPageProps) {
  return <ProductPageContent params={params} locale="ar" />;
}
