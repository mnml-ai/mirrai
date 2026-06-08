import { notFound } from "next/navigation";
import HomepageFinale from "@/components/HomepageFinale";
import ProductConfigurator from "@/components/ProductConfigurator";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";
import { PRODUCT_SLUGS, isProductSlug } from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
  locale?: Locale;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;

  if (!isProductSlug(slug)) {
    return {};
  }

  const product = getDictionary(DEFAULT_LOCALE).productCollection.products[slug];

  return createPageMetadata({
    title: `${product.name} | MIRRAI`,
    description: product.description,
    path: `/products/${slug}`,
    image: `/images/products_2560x1440px/${slug}_mirror.png`,
  });
}

export async function ProductPageContent({
  params,
  locale = DEFAULT_LOCALE,
}: ProductPageProps) {
  const { slug } = await params;

  if (!isProductSlug(slug)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const product = dictionary.productCollection.products[slug];
  const productPath = `/products/${slug}`;

  return (
    <main className="product-page" aria-label={product.name}>
      <SiteNavbar />
      <ProductConfigurator slug={slug} locale={locale} />

      <div className="homepage-finale-region product-page-footer-region">
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale
          showCta={false}
          locale={locale}
          routeKey="collection"
          languagePath={productPath}
        />
      </div>
    </main>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageContent params={params} />;
}
