"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getDictionary, getLocaleFromPathname, getLocalizedHref } from "@/lib/i18n";

const COLLECTION_IMAGE_VERSION = "20260531a";

function withCollectionImageVersion(src: string) {
  return `${src.split("?")[0]}?v=${COLLECTION_IMAGE_VERSION}`;
}

const PRODUCTS = [
  {
    variant: "frame",
    badgeKey: "bestSeller",
    mirrorSrc: "/images/products_2560x1440px/frame_mirror.png?v=20260531a",
    screenSrc: "/images/products_2560x1440px/frame_screen1.png?v=20260531a",
  },
  {
    variant: "halo",
    mirrorSrc: "/images/products_2560x1440px/halo_mirror.png?v=20260531a",
    screenSrc: "/images/products_2560x1440px/halo_screen1.png?v=20260531a",
  },
  {
    variant: "lounge",
    mirrorSrc: "/images/products_2560x1440px/lounge_mirror.png?v=20260531a",
    screenSrc: "/images/products_2560x1440px/lounge_screen1.png?v=20260531a",
  },
  {
    variant: "grande",
    mirrorSrc: "/images/products_2560x1440px/grande_mirror.png?v=20260531a",
    screenSrc: "/images/products_2560x1440px/grande_screen1.png?v=20260531a",
  },
  {
    variant: "classic",
    mirrorSrc: "/images/products_2560x1440px/classic_mirror.png?v=20260531a",
    screenSrc: "/images/products_2560x1440px/classic_screen1.png?v=20260531a",
  },
  {
    variant: "custom",
    badgeKey: "bespoke",
    mirrorSrc: "/images/products_2560x1440px/custom_mirror.png?v=20260531a",
  },
] as const;

const PRODUCT_IMAGE_SIZES = "(max-width: 760px) 92vw, (max-width: 1180px) 44vw, 31vw";

type Product = (typeof PRODUCTS)[number];
type TvState = "idle" | "on" | "off";

function ProductCard({ product }: { product: Product }) {
  const [tvState, setTvState] = useState<TvState>("idle");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const productCopy = dictionary.productCollection.products[product.variant];
  const isTransformable = "screenSrc" in product;
  const productHref =
    product.variant === "custom" ? "/custom" : `/products/${product.variant}`;

  const turnOn = () => {
    if (isTransformable) {
      setTvState("on");
    }
  };

  const turnOff = () => {
    if (isTransformable) {
      setTvState("off");
    }
  };

  return (
    <article
      className={`product-collection-card product-collection-card--${product.variant}`}
      aria-labelledby={`product-collection-${product.variant}`}
      data-transformable={isTransformable ? "true" : undefined}
      data-tv-state={isTransformable ? tvState : undefined}
      onMouseEnter={turnOn}
      onMouseLeave={turnOff}
      onPointerEnter={turnOn}
      onPointerLeave={turnOff}
      onTouchStart={turnOn}
      onFocus={turnOn}
      onBlur={turnOff}
    >
      <div className="product-collection-card-media">
        <div className="product-collection-image-stack">
          <Image
            src={withCollectionImageVersion(product.mirrorSrc)}
            alt={`${productCopy.name} in mirror mode`}
            fill
            sizes={PRODUCT_IMAGE_SIZES}
            quality={92}
            loading="eager"
            className="product-collection-image product-collection-image--mirror"
          />
          {isTransformable ? (
            <Image
              src={withCollectionImageVersion(product.screenSrc)}
              alt=""
              aria-hidden
              fill
              sizes={PRODUCT_IMAGE_SIZES}
              quality={92}
              loading="eager"
              className="product-collection-image product-collection-image--screen"
            />
          ) : (
            <div className="product-collection-custom-spec" aria-hidden>
              <span className="product-collection-custom-line product-collection-custom-line--top" />
              <span className="product-collection-custom-line product-collection-custom-line--right" />
              <span className="product-collection-custom-line product-collection-custom-line--bottom" />
              <span className="product-collection-custom-outline" />
              <span className="product-collection-custom-handle product-collection-custom-handle--tl" />
              <span className="product-collection-custom-handle product-collection-custom-handle--tr" />
              <span className="product-collection-custom-handle product-collection-custom-handle--bl" />
              <span className="product-collection-custom-handle product-collection-custom-handle--br" />
              <span className="product-collection-custom-chip product-collection-custom-chip--size">
                {dictionary.productCollection.customSpec.size}
              </span>
              <span className="product-collection-custom-chip product-collection-custom-chip--finish">
                {dictionary.productCollection.customSpec.finish}
              </span>
              <span className="product-collection-custom-chip product-collection-custom-chip--screen">
                {dictionary.productCollection.customSpec.screen}
              </span>
            </div>
          )}
        </div>
        {"badgeKey" in product ? (
          <span className="product-collection-badge">{dictionary.productCollection.badges[product.badgeKey]}</span>
        ) : null}
      </div>

      <div className="product-collection-card-body">
        <h3 id={`product-collection-${product.variant}`}>{productCopy.name}</h3>
        <span className="product-collection-rule" aria-hidden />
        <p>{productCopy.description}</p>
        <strong>{productCopy.price}</strong>
        <a href={getLocalizedHref(productHref, locale)} className="product-collection-action">
          <span>{dictionary.productCollection.actions.explore}</span>
          <span aria-hidden>{dictionary.common.arrow}</span>
        </a>
      </div>
    </article>
  );
}

export default function ProductCollectionSection() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);

  return (
    <section id="collection" className="product-collection-section" aria-labelledby="product-collection-title">
      <div className="product-collection-inner">
        <header className="product-collection-header">
          <p className="product-collection-kicker">{dictionary.productCollection.kicker}</p>
          <h2 id="product-collection-title">{dictionary.productCollection.title}</h2>
          <p className="product-collection-subtitle">{dictionary.productCollection.subtitle}</p>
        </header>

        <div className="product-collection-grid">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.variant} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
