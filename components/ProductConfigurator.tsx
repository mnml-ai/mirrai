"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  getDictionary,
  getLocalizedHref,
  type Locale,
} from "@/lib/i18n";
import {
  calculateMirraiPrice,
  MIRRAI_FRAME_COLORS as FRAME_COLORS,
  MIRRAI_MIRROR_SIZES as MIRROR_SIZES,
  MIRRAI_TV_SIZES as TV_SIZES,
  type FrameColorKey,
  type LightColorKey,
  type LightKey,
  type MirrorSizeIndex,
  type TvAvailabilityKey,
  type TvSize,
} from "@/lib/mirrai-pricing";
import type { ProductSlug } from "@/lib/products";

const IMAGE_VERSION = "20260531a";

const PRODUCT_GALLERIES: Record<ProductSlug, string[]> = {
  halo: [
    "/images/products_2560x1440px/halo_mirror.png",
    "/images/products_2560x1440px/halo_screen1.png",
    "/images/products_2560x1440px/halo_screen.png",
  ],
  frame: [
    "/images/products_2560x1440px/frame_mirror.png",
    "/images/products_2560x1440px/frame_screen1.png",
    "/images/products_2560x1440px/frame_screen.png",
  ],
  lounge: [
    "/images/products_2560x1440px/lounge_mirror.png",
    "/images/products_2560x1440px/lounge_screen1.png",
    "/images/products_2560x1440px/lounge_screen.png",
  ],
  grande: [
    "/images/products_2560x1440px/grande_mirror.png",
    "/images/products_2560x1440px/grande_screen1.png",
    "/images/products_2560x1440px/grande_screen.png",
  ],
  classic: [
    "/images/products_2560x1440px/classic_mirror.png",
    "/images/products_2560x1440px/classic_screen1.png",
    "/images/products_2560x1440px/classic_screen.png",
  ],
};

const COPY = {
  en: {
    back: "Back to Collection",
    collection: (name: string) => `${name} Collection`,
    reviews: "156 reviews",
    size: "Size",
    frameColor: "Frame Color",
    tvSize: "TV Size",
    tvNote: "TV sold separately after order is confirmed.",
    chooseFirst: "Choose the previous option first.",
    unavailable: "Unavailable for this mirror size",
    tvAvailability: "TV Availability",
    tvOptions: {
      pickup: {
        title: "Yes, I already have a TV",
        body: "I’ll provide my TV for installation",
      },
      buy: {
        title: "No, MIRRAI buy it for me",
        body: "TV supplied and installed by MIRRAI",
      },
    },
    lighting: "Lighting",
    lightOptions: {
      backlight: "Backlight",
      frontlight: "Frontlight",
      noLight: "No Light",
      backlightBody: "Behind the mirror",
      frontlightBody: "In the frame",
    },
    lightColor: "Light Color",
    lightColorScope: "(For selected lighting)",
    lightColors: {
      warm: "Warm",
      white: "White",
      warmWhite: "Warm White",
    },
    frameColors: {
      white: "White",
      beige: "Beige",
      black: "Black",
      lightOak: "Light Oak",
      darkOak: "Dark Oak",
    },
    vatIncluded: "VAT included",
    shipping: "Shipping",
    shippingValue: "Will be calculated in Checkout",
    buyNow: "Buy Now",
    secure: "Secure checkout powered by Shopify.",
    referralCode: "Referral / discount code",
    referralPlaceholder: "Optional code",
    creatingCheckout: "Creating checkout...",
    checkoutError: "Could not start checkout. Please try again.",
    features: [
      ["Backlit LED Lighting", "Adjustable brightness"],
      ["Smart TV Optional", "Seamlessly integrated"],
      ["Premium Quality Mirror", "Crystal clear reflection"],
      ["Easy Installation", "Professional support"],
    ],
  },
  ar: {
    back: "العودة إلى المنتجات",
    collection: (name: string) => `مجموعة ${name}`,
    reviews: "156 تقييم",
    size: "المقاس",
    frameColor: "لون الإطار",
    tvSize: "مقاس التلفاز",
    tvNote: "يتم بيع التلفاز بشكل منفصل بعد تأكيد الطلب.",
    chooseFirst: "اختر الخيار السابق أولاً.",
    unavailable: "غير متاح لهذا المقاس",
    tvAvailability: "توفر التلفاز",
    tvOptions: {
      pickup: {
        title: "نعم، لدي تلفاز بالفعل",
        body: "سأوفر التلفاز الخاص بي للتركيب",
      },
      buy: {
        title: "لا، MIRRAI تشتريه",
        body: "يتم توفير التلفاز وتركيبه من MIRRAI",
      },
    },
    lighting: "الإضاءة",
    lightOptions: {
      backlight: "إضاءة خلفية",
      frontlight: "إضاءة أمامية",
      noLight: "بدون إضاءة",
      backlightBody: "خلف المرآة",
      frontlightBody: "داخل الإطار",
    },
    lightColor: "لون الإضاءة",
    lightColorScope: "(للإضاءة المختارة)",
    lightColors: {
      warm: "دافئ",
      white: "أبيض",
      warmWhite: "أبيض دافئ",
    },
    frameColors: {
      white: "أبيض",
      beige: "بيج",
      black: "أسود",
      lightOak: "أوك فاتح",
      darkOak: "أوك داكن",
    },
    vatIncluded: "شامل ضريبة القيمة المضافة",
    shipping: "الشحن",
    shippingValue: "يتم حسابه عند الدفع",
    buyNow: "اشتر الآن",
    secure: "دفع آمن عبر Shopify.",
    referralCode: "كود الإحالة / الخصم",
    referralPlaceholder: "كود اختياري",
    creatingCheckout: "جاري إنشاء الدفع...",
    checkoutError: "تعذر بدء الدفع. حاول مرة أخرى.",
    features: [
      ["إضاءة LED خلفية", "سطوع قابل للتعديل"],
      ["تلفاز ذكي اختياري", "دمج سلس داخل المرآة"],
      ["مرآة عالية الجودة", "انعكاس واضح ونقي"],
      ["تركيب سهل", "دعم احترافي"],
    ],
  },
} as const;

function versioned(src: string) {
  return `${src}?v=${IMAGE_VERSION}`;
}

function formatPrice(value: number) {
  return `EGP ${value.toLocaleString("en-US")}`;
}

function OptionIcon({ type }: { type: "tv" | "cart" | "light" | "lock" | "mirror" | "tools" }) {
  if (type === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 5h2l2 10h9l2-7H7" />
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
      </svg>
    );
  }

  if (type === "lock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (type === "mirror") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M10 8h4M10 12h4" />
      </svg>
    );
  }

  if (type === "tools") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="m14 6 4 4M16 4l4 4-9 9-4 1 1-4 8-10Z" />
        <path d="m5 5 4 4M7 3 3 7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

type ProductConfiguratorProps = {
  slug: ProductSlug;
  locale?: Locale;
};

export default function ProductConfigurator({
  slug,
  locale = DEFAULT_LOCALE,
}: ProductConfiguratorProps) {
  const dictionary = getDictionary(locale);
  const copy = COPY[locale];
  const product = dictionary.productCollection.products[slug];
  const displayName = product.name.replace("MIRRAI ", "");
  const gallery = PRODUCT_GALLERIES[slug];
  const [activeImage, setActiveImage] = useState(0);
  const [sizeIndex, setSizeIndex] = useState<MirrorSizeIndex | null>(null);
  const [frameColor, setFrameColor] = useState<FrameColorKey | null>(null);
  const [tvSize, setTvSize] = useState<TvSize | null>(null);
  const [tvAvailability, setTvAvailability] = useState<TvAvailabilityKey | null>(null);
  const [lights, setLights] = useState<LightKey[] | null>(null);
  const [lightColor, setLightColor] = useState<LightColorKey | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const selectedSize = sizeIndex === null ? null : MIRROR_SIZES[sizeIndex];
  const maxTvSize = selectedSize?.maxTv ?? 0;
  const selectedFrameColor = FRAME_COLORS.find((color) => color.key === frameColor) ?? null;
  const hasLighting = Array.isArray(lights) && lights.length > 0;
  const lightingSelected = lights !== null;
  const supportsFrontlight = slug === "frame";
  const frameColorLocked = sizeIndex === null;
  const tvSizeLocked = frameColor === null;
  const tvAvailabilityLocked = tvSize === null;
  const lightingLocked = tvAvailability === null;
  const lightColorLocked = !hasLighting;
  const productReady = Boolean(
    selectedSize
      && selectedFrameColor
      && tvSize
      && tvAvailability
      && lightingSelected
      && (!hasLighting || lightColor)
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("discount") || params.get("ref") || params.get("referral") || "";

    if (code) {
      setReferralCode(code.slice(0, 80));
    }
  }, []);

  const price = useMemo(() => {
    if (
      sizeIndex === null
      || !selectedFrameColor
      || !tvSize
      || !tvAvailability
      || !lightingSelected
      || (hasLighting && !lightColor)
    ) {
      return null;
    }

    return calculateMirraiPrice({
      slug,
      sizeIndex,
      frameColor: selectedFrameColor.key,
      tvSize,
      tvAvailability,
      lights: lights ?? [],
      lightColor: hasLighting ? lightColor : null,
      referralCode,
    }).price;
  }, [slug, sizeIndex, selectedFrameColor, tvSize, tvAvailability, lightingSelected, hasLighting, lightColor, lights, referralCode]);

  const selectSize = (index: MirrorSizeIndex) => {
    setSizeIndex(index);
    setFrameColor(null);
    setTvSize(null);
    setTvAvailability(null);
    setLights(null);
    setLightColor(null);
  };

  const selectFrameColor = (color: FrameColorKey) => {
    if (frameColorLocked) {
      return;
    }

    setFrameColor(color);
    setTvSize(null);
    setTvAvailability(null);
    setLights(null);
    setLightColor(null);
  };

  const selectTvSize = (size: TvSize) => {
    if (tvSizeLocked || size > maxTvSize) {
      return;
    }

    setTvSize(size);
    setTvAvailability(null);
    setLights(null);
    setLightColor(null);
  };

  const selectTvAvailability = (availability: TvAvailabilityKey) => {
    if (tvAvailabilityLocked) {
      return;
    }

    setTvAvailability(availability);
    setLights(null);
    setLightColor(null);
  };

  const toggleFrameLight = (light: LightKey) => {
    if (lightingLocked) {
      return;
    }

    setLights((current) => (
      current?.includes(light)
        ? (current.length === 1 ? null : current.filter((item) => item !== light))
        : [...(current ?? []), light]
    ));
    setLightColor(null);
  };

  const selectNoLight = () => {
    if (lightingLocked) {
      return;
    }

    setLights([]);
    setLightColor(null);
  };

  const moveImage = (direction: -1 | 1) => {
    setActiveImage((current) => (current + direction + gallery.length) % gallery.length);
  };

  const createCheckout = async () => {
    if (
      !productReady
      || sizeIndex === null
      || !selectedFrameColor
      || !tvSize
      || !tvAvailability
      || !lightingSelected
      || (hasLighting && !lightColor)
    ) {
      return;
    }

    setIsCreatingCheckout(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/shopify/create-draft-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          sizeIndex,
          frameColor: selectedFrameColor.key,
          tvSize,
          tvAvailability,
          lights: lights ?? [],
          lightColor: hasLighting ? lightColor : null,
          referralCode,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.invoiceUrl) {
        throw new Error(data.error || copy.checkoutError);
      }

      window.location.href = data.invoiceUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(error instanceof Error ? error.message : copy.checkoutError);
      setIsCreatingCheckout(false);
    }
  };

  return (
    <section className="product-configurator" aria-labelledby="product-configurator-title">
      <a className="product-configurator-back" href={getLocalizedHref("/collection", locale)}>
        <span aria-hidden>{locale === "ar" ? "→" : "←"}</span>
        <span>{copy.back}</span>
      </a>

      <div className="product-configurator-grid">
        <div className="product-gallery" aria-label={`${product.name} gallery`}>
          <div className="product-gallery-stage">
            <button
              className="product-gallery-arrow product-gallery-arrow--prev"
              type="button"
              aria-label="Previous image"
              onClick={() => moveImage(-1)}
            >
              ‹
            </button>
            <div className="product-gallery-image">
              <Image
                src={versioned(gallery[activeImage])}
                alt={`${product.name} view ${activeImage + 1}`}
                fill
                priority
                sizes="(max-width: 900px) 92vw, 52vw"
                quality={94}
              />
            </div>
            <button
              className="product-gallery-arrow product-gallery-arrow--next"
              type="button"
              aria-label="Next image"
              onClick={() => moveImage(1)}
            >
              ›
            </button>
          </div>

          <p className="product-gallery-count">
            {activeImage + 1} / {gallery.length}
          </p>

          <div className="product-gallery-thumbnails" aria-label="Product thumbnails">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className="product-gallery-thumbnail"
                data-active={activeImage === index}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={activeImage === index}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={versioned(image)}
                  alt=""
                  aria-hidden
                  fill
                  sizes="110px"
                  quality={90}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-config-panel">
          <p className="product-config-kicker">{copy.collection(displayName)}</p>
          <h1 id="product-configurator-title">{displayName}</h1>
          <p className="product-config-description">{product.description}</p>

          <div className="product-config-reviews" aria-label={copy.reviews}>
            <span aria-hidden>★★★★★</span>
            <span>{copy.reviews}</span>
          </div>

          <div className="product-config-divider" />

          <fieldset className="product-config-fieldset">
            <legend>{copy.size}</legend>
            <div className="product-pill-row">
              {MIRROR_SIZES.map((size, index) => (
                <button
                  key={size.label}
                  type="button"
                  className="product-pill"
                  data-active={sizeIndex === index}
                  aria-pressed={sizeIndex === index}
                  onClick={() => selectSize(index as MirrorSizeIndex)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="product-config-fieldset" data-locked={frameColorLocked}>
            <legend>{copy.frameColor}</legend>
            <div className="product-color-row">
              {FRAME_COLORS.map((color) => (
                <button
                  key={color.key}
                  type="button"
                  className="product-color-option"
                  data-active={frameColor === color.key}
                  disabled={frameColorLocked}
                  aria-pressed={frameColor === color.key}
                  onClick={() => selectFrameColor(color.key)}
                >
                  <span style={{ "--swatch-color": color.hex } as CSSProperties} />
                  <span>{copy.frameColors[color.key]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="product-config-fieldset" data-locked={tvSizeLocked}>
            <legend>{copy.tvSize}</legend>
            <div className="product-tv-size-row">
              {TV_SIZES.map((size) => {
                const unavailable = !tvSizeLocked && size > maxTvSize;
                const disabled = tvSizeLocked || unavailable;

                return (
                  <button
                    key={size}
                    type="button"
                    className="product-pill product-tv-size"
                    data-active={tvSize === size}
                    data-unavailable={unavailable}
                    disabled={disabled}
                    aria-pressed={tvSize === size}
                    aria-label={unavailable ? `${size} inch unavailable. ${copy.unavailable}` : `${size} inch`}
                    onClick={() => selectTvSize(size)}
                  >
                    <span>{size}&quot;</span>
                    {unavailable ? <span className="product-tv-size-x" aria-hidden>×</span> : null}
                  </button>
                );
              })}
            </div>
            <p className="product-config-note">{copy.tvNote}</p>
          </fieldset>

          <fieldset className="product-config-fieldset" data-locked={tvAvailabilityLocked}>
            <legend>{copy.tvAvailability}</legend>
            <div className="product-card-options product-card-options--two">
              {(Object.keys(copy.tvOptions) as TvAvailabilityKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="product-card-option"
                  data-active={tvAvailability === key}
                  disabled={tvAvailabilityLocked}
                  aria-pressed={tvAvailability === key}
                  onClick={() => selectTvAvailability(key)}
                >
                  <span className="product-radio-dot" aria-hidden />
                  <OptionIcon type={key === "pickup" ? "tv" : "cart"} />
                  <strong>{copy.tvOptions[key].title}</strong>
                  <span>{copy.tvOptions[key].body}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="product-config-fieldset" data-locked={lightingLocked}>
            <legend>{copy.lighting}</legend>
            <div className="product-card-options product-card-options--light">
              <button
                type="button"
                className="product-card-option product-light-option"
                data-active={lights?.includes("backlight") ?? false}
                disabled={lightingLocked}
                aria-pressed={lights?.includes("backlight") ?? false}
                onClick={() => {
                  if (lightingLocked) {
                    return;
                  }

                  if (supportsFrontlight) {
                    toggleFrameLight("backlight");
                    return;
                  }

                  setLights(["backlight"]);
                  setLightColor(null);
                }}
              >
                <span className="product-radio-dot" aria-hidden />
                <OptionIcon type="light" />
                <strong>{copy.lightOptions.backlight}</strong>
                <span>{copy.lightOptions.backlightBody}</span>
              </button>

              {supportsFrontlight ? (
                <button
                  type="button"
                  className="product-card-option product-light-option"
                  data-active={lights?.includes("frontlight") ?? false}
                  disabled={lightingLocked}
                  aria-pressed={lights?.includes("frontlight") ?? false}
                  onClick={() => toggleFrameLight("frontlight")}
                >
                  <span className="product-radio-dot" aria-hidden />
                  <OptionIcon type="light" />
                  <strong>{copy.lightOptions.frontlight}</strong>
                  <span>{copy.lightOptions.frontlightBody}</span>
                </button>
              ) : null}

              <button
                type="button"
                className="product-card-option product-light-option"
                data-active={lightingSelected && !hasLighting}
                disabled={lightingLocked}
                aria-pressed={lightingSelected && !hasLighting}
                onClick={selectNoLight}
              >
                <span className="product-radio-dot" aria-hidden />
                <strong>{copy.lightOptions.noLight}</strong>
              </button>
            </div>
          </fieldset>

          {hasLighting ? (
            <fieldset className="product-config-fieldset" data-locked={lightColorLocked}>
              <legend>
                {copy.lightColor} <span>{copy.lightColorScope}</span>
              </legend>
              <div className="product-pill-row">
                {(["warm", "white", "warmWhite"] as LightColorKey[]).map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="product-pill"
                    data-active={lightColor === color}
                    disabled={lightColorLocked}
                    aria-pressed={lightColor === color}
                    onClick={() => setLightColor(color)}
                  >
                    {copy.lightColors[color]}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          <fieldset className="product-config-fieldset product-referral-fieldset">
            <legend>{copy.referralCode}</legend>
            <input
              className="product-referral-input"
              type="text"
              value={referralCode}
              maxLength={80}
              placeholder={copy.referralPlaceholder}
              onChange={(event) => setReferralCode(event.currentTarget.value)}
            />
          </fieldset>

          <div className="product-price-panel" data-locked={!productReady}>
            <strong>{price === null ? "EGP --" : formatPrice(price)}</strong>
            <p>{copy.vatIncluded}</p>
            <button
              type="button"
              className="product-buy-button"
              disabled={!productReady || isCreatingCheckout}
              aria-disabled={!productReady || isCreatingCheckout}
              data-disabled={!productReady || isCreatingCheckout}
              onClick={createCheckout}
            >
              <span>{isCreatingCheckout ? copy.creatingCheckout : copy.buyNow}</span>
              <OptionIcon type="lock" />
            </button>
            {checkoutError ? <p className="product-checkout-error">{checkoutError}</p> : null}
            <p className="product-secure-note">
              <OptionIcon type="lock" />
              <span>{copy.secure}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="product-feature-strip">
        {copy.features.map((feature, index) => (
          <div className="product-feature-item" key={feature[0]}>
            <OptionIcon type={index === 0 ? "light" : index === 1 ? "tv" : index === 2 ? "mirror" : "tools"} />
            <div>
              <strong>{feature[0]}</strong>
              <span>{feature[1]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
