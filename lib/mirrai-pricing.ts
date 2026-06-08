import { isProductSlug, type ProductSlug } from "@/lib/products";

export const MIRRAI_PRODUCT_BASE_PRICE: Record<ProductSlug, readonly number[]> = {
  halo: [16000, 20000, 26000, 31000, 42000],
  frame: [19500, 25000],
  lounge: [16500, 21800, 32500, 43000],
  grande: [39000, 44000, 49000, 52000, 65000, 92000, 100000],
  classic: [35500, 48500, 68500],
};

export const MIRRAI_MIRROR_SIZES = [
  { label: "120 cm", maxTv: 55 },
  { label: "150 cm", maxTv: 65 },
  { label: "180 cm", maxTv: 85 },
] as const;

export const MIRRAI_TV_SIZES = [32, 43, 50, 55, 65, 75, 85] as const;

const MIRRAI_PRODUCT_MIRROR_SIZES: Partial<
  Record<ProductSlug, readonly { label: string; maxTv: number; tvSizes?: readonly TvSize[] }[]>
> = {
  halo: [
    { label: "91 cm", maxTv: 32, tvSizes: [32] },
    { label: "119 cm", maxTv: 43, tvSizes: [32, 43] },
    { label: "134 cm", maxTv: 50, tvSizes: [32, 43, 50] },
    { label: "147 cm", maxTv: 55, tvSizes: [32, 43, 50, 55] },
    { label: "172 cm", maxTv: 65, tvSizes: [32, 43, 50, 55, 65] },
  ],
  frame: [
    { label: "105 x 145 cm", maxTv: 43, tvSizes: [32, 43] },
    { label: "120 x 160 cm", maxTv: 50, tvSizes: [32, 43, 50] },
  ],
  lounge: [
    { label: "115 x 80 cm", maxTv: 50, tvSizes: [32, 43, 50] },
    { label: "135 x 90 cm", maxTv: 55, tvSizes: [32, 43, 50, 55] },
    { label: "175 x 110 cm", maxTv: 75, tvSizes: [32, 43, 65, 75] },
    { label: "200 x 120 cm", maxTv: 85, tvSizes: [32, 43, 50, 55, 65, 75, 85] },
  ],
  grande: [
    { label: "110 x 260 cm", maxTv: 43, tvSizes: [32, 43] },
    { label: "125 x 260 cm", maxTv: 50, tvSizes: [32, 43, 50] },
    { label: "150 x 260 cm", maxTv: 65, tvSizes: [32, 43, 50, 55, 65] },
    { label: "180 x 260 cm", maxTv: 75, tvSizes: [32, 43, 50, 55, 65, 75] },
    { label: "200 x 260 cm", maxTv: 85, tvSizes: [32, 43, 50, 55, 65, 75, 85] },
    { label: "230 x 260 cm", maxTv: 85, tvSizes: [32, 43, 50, 55, 65, 75, 85] },
    { label: "260 x 260 cm", maxTv: 85, tvSizes: [32, 43, 50, 55, 65, 75, 85] },
  ],
};

export const MIRRAI_FRAME_COLORS = [
  { key: "white", label: "White", hex: "#f8f7f3", price: 0 },
  { key: "beige", label: "Beige", hex: "#d9cbb7", price: 0 },
  { key: "black", label: "Black", hex: "#090909", price: 0 },
  { key: "lightOak", label: "Light Oak", hex: "#c39a67", price: 2500 },
  { key: "darkOak", label: "Dark Oak", hex: "#5c3d22", price: 3000 },
] as const;

export const MIRRAI_LIGHT_PRICE = {
  backlight: 4500,
  frontlight: 3500,
} as const;

const MIRRAI_HALO_OAK_FRAME_PRICE = [17000, 22000, 28000, 34000, 45000] as const;

export const MIRRAI_TV_AVAILABILITY_LABELS = {
  pickup: "Yes, I already have a TV",
  buy: "No, MIRRAI buy it for me",
} as const;

export const MIRRAI_LIGHT_LABELS = {
  backlight: "Backlight",
  frontlight: "Frontlight",
} as const;

export const MIRRAI_LIGHT_COLOR_LABELS = {
  warm: "Warm",
  white: "White",
  warmWhite: "Warm White",
} as const;

export type MirrorSizeIndex = number;
export type FrameColorKey = (typeof MIRRAI_FRAME_COLORS)[number]["key"];
export type TvSize = (typeof MIRRAI_TV_SIZES)[number];
export type TvAvailabilityKey = keyof typeof MIRRAI_TV_AVAILABILITY_LABELS;
export type LightKey = keyof typeof MIRRAI_LIGHT_LABELS;
export type LightColorKey = keyof typeof MIRRAI_LIGHT_COLOR_LABELS;

export type MirraiProductConfiguration = {
  slug: ProductSlug;
  sizeIndex: MirrorSizeIndex;
  frameColor: FrameColorKey;
  tvSize: TvSize;
  tvAvailability: TvAvailabilityKey;
  lights: LightKey[];
  lightColor: LightColorKey | null;
  referralCode?: string;
};

export type MirraiPricedConfiguration = MirraiProductConfiguration & {
  productTitle: string;
  sizeLabel: string;
  frameColorLabel: string;
  tvAvailabilityLabel: string;
  lightingLabel: string;
  lightColorLabel: string;
  price: number;
};

const PRODUCT_TITLES: Record<ProductSlug, string> = {
  halo: "MIRRAI Halo",
  frame: "MIRRAI Frame",
  lounge: "MIRRAI Lounge",
  grande: "MIRRAI Grande",
  classic: "MIRRAI Classic",
};

const MIRRAI_PRODUCT_LIGHT_PRICE: Partial<Record<ProductSlug, Partial<Record<LightKey, readonly number[]>>>> = {
  halo: {
    backlight: [1200, 1400, 1600, 1800, 2000],
  },
  frame: {
    backlight: [1400, 2000],
    frontlight: [1400, 2000],
  },
  lounge: {
    backlight: [1200, 1500, 1800, 2000],
  },
  grande: {
    backlight: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
  },
};

export function getMirraiMirrorSizes(slug: ProductSlug) {
  return MIRRAI_PRODUCT_MIRROR_SIZES[slug] ?? MIRRAI_MIRROR_SIZES;
}

export function getMirraiTvSizes(slug: ProductSlug) {
  const exactTvSizes = new Set(
    MIRRAI_PRODUCT_MIRROR_SIZES[slug]?.flatMap((size) => size.tvSizes ?? []) ?? []
  );

  if (exactTvSizes.size > 0) {
    return MIRRAI_TV_SIZES.filter((size) => exactTvSizes.has(size));
  }

  return MIRRAI_TV_SIZES.filter((size) => size !== 50);
}

export function getMirraiCompatibleTvSizes(slug: ProductSlug, sizeIndex: MirrorSizeIndex) {
  const selectedSize = getMirraiMirrorSizes(slug)[sizeIndex];

  if (!selectedSize) {
    return [];
  }

  if ("tvSizes" in selectedSize && selectedSize.tvSizes) {
    return selectedSize.tvSizes;
  }

  return getMirraiTvSizes(slug).filter((size) => size <= selectedSize.maxTv);
}

function isMirrorSizeIndex(slug: ProductSlug, value: unknown): value is MirrorSizeIndex {
  return (
    typeof value === "number"
    && Number.isInteger(value)
    && value >= 0
    && value < getMirraiMirrorSizes(slug).length
  );
}

function isFrameColor(value: unknown): value is FrameColorKey {
  return MIRRAI_FRAME_COLORS.some((color) => color.key === value);
}

function isTvSize(value: unknown): value is TvSize {
  return MIRRAI_TV_SIZES.includes(value as TvSize);
}

function isTvAvailability(value: unknown): value is TvAvailabilityKey {
  return value === "pickup" || value === "buy";
}

function isLight(value: unknown): value is LightKey {
  return value === "backlight" || value === "frontlight";
}

function isLightColor(value: unknown): value is LightColorKey {
  return value === "warm" || value === "white" || value === "warmWhite";
}

function normalizeReferralCode(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 80) : "";
}

export function parseMirraiConfiguration(input: unknown): MirraiProductConfiguration {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid product configuration.");
  }

  const raw = input as Record<string, unknown>;
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const sizeIndex = raw.sizeIndex;
  const frameColor = raw.frameColor;
  const tvSize = raw.tvSize;
  const tvAvailability = raw.tvAvailability;

  if (!isProductSlug(slug)) {
    throw new Error("Invalid product model.");
  }

  if (!isMirrorSizeIndex(slug, sizeIndex)) {
    throw new Error("Invalid mirror size.");
  }

  if (!isFrameColor(frameColor)) {
    throw new Error("Invalid frame color.");
  }

  if (!isTvSize(tvSize)) {
    throw new Error("Invalid TV size.");
  }

  if (!isTvAvailability(tvAvailability)) {
    throw new Error("Invalid TV availability.");
  }

  if (!Array.isArray(raw.lights) || raw.lights.some((light) => !isLight(light))) {
    throw new Error("Invalid lighting option.");
  }

  const lights = Array.from(new Set(raw.lights)) as LightKey[];
  const supportsFrontlight = slug === "frame";

  if (!supportsFrontlight && lights.includes("frontlight")) {
    throw new Error("Frontlight is only available for MIRRAI Frame.");
  }

  if (!supportsFrontlight && lights.length > 1) {
    throw new Error("This model supports backlight or no light only.");
  }

  const rawLightColor = raw.lightColor === null || raw.lightColor === undefined
    ? null
    : raw.lightColor;

  let lightColor: LightColorKey | null = null;

  if (lights.length > 0) {
    if (!isLightColor(rawLightColor)) {
      throw new Error("Light color is required when lighting is selected.");
    }

    lightColor = rawLightColor;
  } else if (rawLightColor !== null && rawLightColor !== "") {
    throw new Error("Light color is only available when lighting is selected.");
  }

  if (!getMirraiCompatibleTvSizes(slug, sizeIndex).includes(tvSize)) {
    throw new Error("Selected TV size is not available for this mirror size.");
  }

  return {
    slug,
    sizeIndex,
    frameColor,
    tvSize,
    tvAvailability,
    lights,
    lightColor,
    referralCode: normalizeReferralCode(raw.referralCode),
  };
}

export function calculateMirraiPrice(configuration: MirraiProductConfiguration): MirraiPricedConfiguration {
  const selectedSize = getMirraiMirrorSizes(configuration.slug)[configuration.sizeIndex];
  const selectedFrameColor = MIRRAI_FRAME_COLORS.find((color) => color.key === configuration.frameColor);

  if (!selectedFrameColor) {
    throw new Error("Invalid frame color.");
  }

  if (!selectedSize) {
    throw new Error("Invalid mirror size.");
  }

  const lightTotal = configuration.lights.reduce(
    (sum, light) => sum + getMirraiLightPrice(configuration.slug, configuration.sizeIndex, light),
    0
  );
  const basePrice = getMirraiBasePrice(configuration.slug, configuration.sizeIndex);
  const price =
    basePrice
    + getMirraiFrameColorPrice(configuration.slug, configuration.sizeIndex, selectedFrameColor)
    + lightTotal;
  const lightingLabel =
    configuration.lights.length > 0
      ? configuration.lights.map((light) => MIRRAI_LIGHT_LABELS[light]).join(" + ")
      : "No Light";
  const lightColorLabel = configuration.lightColor
    ? MIRRAI_LIGHT_COLOR_LABELS[configuration.lightColor]
    : "None";

  return {
    ...configuration,
    productTitle: PRODUCT_TITLES[configuration.slug],
    sizeLabel: selectedSize.label,
    frameColorLabel: selectedFrameColor.label,
    tvAvailabilityLabel: MIRRAI_TV_AVAILABILITY_LABELS[configuration.tvAvailability],
    lightingLabel,
    lightColorLabel,
    price,
  };
}

function getMirraiBasePrice(slug: ProductSlug, sizeIndex: MirrorSizeIndex) {
  const basePrice = MIRRAI_PRODUCT_BASE_PRICE[slug][sizeIndex];

  if (typeof basePrice !== "number") {
    throw new Error("Invalid product price.");
  }

  return basePrice;
}

function getMirraiFrameColorPrice(
  slug: ProductSlug,
  sizeIndex: MirrorSizeIndex,
  frameColor: (typeof MIRRAI_FRAME_COLORS)[number]
) {
  if (slug !== "halo") {
    if (slug === "frame" || slug === "lounge" || slug === "grande") {
      return 0;
    }

    return frameColor.price;
  }

  if (frameColor.key !== "lightOak" && frameColor.key !== "darkOak") {
    return 0;
  }

  const oakPrice = MIRRAI_HALO_OAK_FRAME_PRICE[sizeIndex];
  const basePrice = getMirraiBasePrice(slug, sizeIndex);

  if (typeof oakPrice !== "number") {
    throw new Error("Invalid Halo frame price.");
  }

  return oakPrice - basePrice;
}

function getMirraiLightPrice(slug: ProductSlug, sizeIndex: MirrorSizeIndex, light: LightKey) {
  const productLightPrice = MIRRAI_PRODUCT_LIGHT_PRICE[slug]?.[light]?.[sizeIndex];

  if (typeof productLightPrice === "number") {
    return productLightPrice;
  }

  if (slug in MIRRAI_PRODUCT_LIGHT_PRICE) {
    if (light === "frontlight" && slug !== "frame") {
      throw new Error("Frontlight is only available for MIRRAI Frame.");
    }

    throw new Error("Invalid product lighting price.");
  }

  return MIRRAI_LIGHT_PRICE[light];
}

export function priceMirraiConfiguration(input: unknown) {
  return calculateMirraiPrice(parseMirraiConfiguration(input));
}
