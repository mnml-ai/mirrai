export const PRODUCT_SLUGS = ["halo", "frame", "lounge", "grande", "classic"] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export function isProductSlug(value: string): value is ProductSlug {
  return PRODUCT_SLUGS.includes(value as ProductSlug);
}
