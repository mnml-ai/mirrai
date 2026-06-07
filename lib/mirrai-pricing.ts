import { isProductSlug, type ProductSlug } from "@/lib/products";

export const MIRRAI_PRODUCT_BASE_PRICE: Record<ProductSlug, [number, number, number]> = {
  halo: [28500, 38500, 54500],
  frame: [31500, 42500, 59500],
  lounge: [42500, 56500, 76500],
  grande: [52500, 72500, 98500],
  classic: [35500, 48500, 68500],
};

export const MIRRAI_MIRROR_SIZES = [
  { label: "120 cm", maxTv: 55 },
  { label: "150 cm", maxTv: 65 },
  { label: "180 cm", maxTv: 85 },
] as const;

export const MIRRAI_TV_SIZES = [32, 43, 55, 65, 75, 85] as const;

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

export type MirrorSizeIndex = 0 | 1 | 2;
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

function isMirrorSizeIndex(value: unknown): value is MirrorSizeIndex {
  return value === 0 || value === 1 || value === 2;
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

  if (!isMirrorSizeIndex(sizeIndex)) {
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

  const selectedSize = MIRRAI_MIRROR_SIZES[sizeIndex];

  if (tvSize > selectedSize.maxTv) {
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
  const selectedSize = MIRRAI_MIRROR_SIZES[configuration.sizeIndex];
  const selectedFrameColor = MIRRAI_FRAME_COLORS.find((color) => color.key === configuration.frameColor);

  if (!selectedFrameColor) {
    throw new Error("Invalid frame color.");
  }

  const lightTotal = configuration.lights.reduce(
    (sum, light) => sum + MIRRAI_LIGHT_PRICE[light],
    0
  );
  const price =
    MIRRAI_PRODUCT_BASE_PRICE[configuration.slug][configuration.sizeIndex]
    + selectedFrameColor.price
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

export function priceMirraiConfiguration(input: unknown) {
  return calculateMirraiPrice(parseMirraiConfiguration(input));
}
