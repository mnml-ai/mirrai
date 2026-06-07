"use client";

import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

const MIRROR_MASK_POINTS = {
  tl: { x: 63.41, y: 27.91 },
  tr: { x: 93.35, y: 25.67 },
  br: { x: 93.39, y: 71.86 },
  bl: { x: 63.06, y: 67.74 },
};

const MIRROR_VIDEO_MASK_STORAGE_PREFIX = "smart-mirror-video-mask";
const MIRROR_VIDEO_MASK_GROUP_STORAGE_PREFIX = "smart-mirror-video-mask-group";

/** Pan + uniform scale around the quad centroid (stage %-space for x/y). */
export type MirrorVideoMaskGroupAdjust = {
  x: number;
  y: number;
  scale: number;
};

const MIRROR_VIDEO_MASK_GROUP_DEFAULT: {
  x: number;
  y: number;
  scale: number;
} = {
  x: 0,
  y: 0,
  scale: 1,
};

const MIRROR_VIDEO_MASK_GROUP_LIMITS = {
  translateMax: 40,
  scaleMin: 0.45,
  scaleMax: 1.95,
} as const;

/** Stage-space % (0–100). Corner labels match SVG debug polygon order: tl → tr → br → bl. */
export type MirrorVideoMaskPoints = {
  tl: { x: number; y: number };
  tr: { x: number; y: number };
  br: { x: number; y: number };
  bl: { x: number; y: number };
};

const VIDEO_MASK_CORNER_LABELS: Record<keyof MirrorVideoMaskPoints, string> = {
  tl: "Top-left",
  tr: "Top-right",
  br: "Bottom-right",
  bl: "Bottom-left",
};

const VIDEO_PREVIEW_SECONDS = 4;
const TRY_ME_SIZE_PERCENT = 130;

const MIRROR_SMART_UI_TRANSFORM_STORAGE_PREFIX = "smart-mirror-smart-ui-transform";

const MIRROR_SMART_UI_TRANSFORM_DEFAULT: {
  scale: number;
  x: number;
  y: number;
} = {
  scale: 1,
  x: 0,
  y: 0,
};

const MIRROR_SMART_UI_TRANSFORM_LIMITS = {
  scaleMin: 0.45,
  scaleMax: 1.65,
  translateMax: 140,
} as const;

const MIRROR_MODE_TITLE_STACK_STORAGE_PREFIX = "smart-mirror-mode-title-stack";

const MIRROR_MODE_TITLE_STACK_DEFAULT: {
  scale: number;
  x: number;
  y: number;
} = {
  scale: 1,
  x: 0,
  y: 0,
};

const MIRROR_MODE_TITLE_STACK_LIMITS = {
  scaleMin: 0.45,
  scaleMax: 1.95,
  translateMax: 360,
} as const;

const MIRROR_BUNDLE_STACK_STORAGE_PREFIX = "smart-mirror-bundle-stack";

const MIRROR_BUNDLE_STACK_DEFAULT: {
  scale: number;
  x: number;
  y: number;
} = {
  scale: 1,
  x: 0,
  y: 0,
};

const MIRROR_BUNDLE_STACK_LIMITS = {
  scaleMin: 0.35,
  scaleMax: 1.65,
  translateMax: 420,
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Subscribe to `window.matchMedia`; returns false until mounted (SSR-safe). */
function useMediaQuery(query: string | null): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!query || typeof window === "undefined") return;

    const mq = window.matchMedia(query);
    const apply = () => setMatches(mq.matches);
    apply();

    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [query]);

  return Boolean(query) && matches;
}

function cloneVideoMask(pts: MirrorVideoMaskPoints): MirrorVideoMaskPoints {
  return {
    tl: { ...pts.tl },
    tr: { ...pts.tr },
    br: { ...pts.br },
    bl: { ...pts.bl },
  };
}

function cloneDefaultVideoMask(): MirrorVideoMaskPoints {
  return cloneVideoMask(MIRROR_MASK_POINTS);
}

/** Mirror stack mount box — stage %-space; keep in sync with `.mirror-video-preview` / `.mirror-ui` in globals.css. */
const INTERACTION_MIRROR_MOUNT_PCT = {
  left: 63.06,
  top: 25.67,
  width: 30.33,
  height: 46.19,
} as const;

/** Clip-path on the mirror-video box: corners in full-stage % → local % inside the mount quad. */
function stageVideoMaskToClipPath(
  pts: MirrorVideoMaskPoints,
  mount: typeof INTERACTION_MIRROR_MOUNT_PCT
): string {
  const { left, top, width, height } = mount;
  const loc = (sx: number, sy: number) => {
    const lx = ((sx - left) / width) * 100;
    const ly = ((sy - top) / height) * 100;
    return `${lx.toFixed(2)}% ${ly.toFixed(2)}%`;
  };
  return `polygon(${loc(pts.tl.x, pts.tl.y)}, ${loc(pts.tr.x, pts.tr.y)}, ${loc(pts.br.x, pts.br.y)}, ${loc(pts.bl.x, pts.bl.y)})`;
}

function maskCornersToSvgPolygonPoints(pts: MirrorVideoMaskPoints): string {
  return [pts.tl, pts.tr, pts.br, pts.bl].map((p) => `${p.x},${p.y}`).join(" ");
}

/** Move / resize the whole video mask quad in stage space (uniform scale about its centroid). */
function applyMirrorVideoMaskGroup(
  pts: MirrorVideoMaskPoints,
  g: MirrorVideoMaskGroupAdjust
): MirrorVideoMaskPoints {
  const cx = (pts.tl.x + pts.tr.x + pts.br.x + pts.bl.x) / 4;
  const cy = (pts.tl.y + pts.tr.y + pts.br.y + pts.bl.y) / 4;

  const map = (p: { x: number; y: number }) => ({
    x: clamp(cx + (p.x - cx) * g.scale + g.x, 0, 100),
    y: clamp(cy + (p.y - cy) * g.scale + g.y, 0, 100),
  });

  return {
    tl: map(pts.tl),
    tr: map(pts.tr),
    br: map(pts.br),
    bl: map(pts.bl),
  };
}

/** Vertical offset applied inside the full-stack mirror bundle transform (positive = down). */
const MIRROR_UI_VERTICAL_OFFSET_PX = 0;

const INTERACTION_MIRROR_LAYER_MOUNT: CSSProperties = {
  position: "absolute",
  left: `${INTERACTION_MIRROR_MOUNT_PCT.left}%`,
  top: `${INTERACTION_MIRROR_MOUNT_PCT.top}%`,
  width: `${INTERACTION_MIRROR_MOUNT_PCT.width}%`,
  height: `${INTERACTION_MIRROR_MOUNT_PCT.height}%`,
  pointerEvents: "none",
};

/** Stage-space % at mirror glass centre (Try-me wrapper transform-origin when bundle transform is on). */
const MIRROR_GLASS_CENTER_ORIGIN_PCT = {
  x: INTERACTION_MIRROR_MOUNT_PCT.left + INTERACTION_MIRROR_MOUNT_PCT.width / 2,
  y: INTERACTION_MIRROR_MOUNT_PCT.top + INTERACTION_MIRROR_MOUNT_PCT.height / 2,
} as const;

function mirrorBundleCssTransform(
  active: boolean,
  t: { x: number; y: number; scale: number },
  verticalOffsetPx: number
): string | undefined {
  if (active) {
    return `translate(${t.x}px, ${t.y}px) scale(${t.scale}) translateY(${verticalOffsetPx}px)`;
  }

  if (verticalOffsetPx !== 0) {
    return `translateY(${verticalOffsetPx}px)`;
  }

  return undefined;
}

/** Mirror UI turn-on: iris expands from centre + blur clears (no black overlay) */
const UI_TURN_ON_CLIP_START = "circle(0% at 50% 50%)";
const UI_TURN_ON_CLIP_END = "circle(150% at 50% 50%)";

const PROCESS_STEPS = [
  { num: "1", image: "/images/step-1.png?v=20260531a" },
  { num: "2", image: "/images/step-2.png?v=20260531a" },
  { num: "3", image: "/images/step-3.png?v=20260531a" },
] as const;

/** Optional tablet / narrow-viewport mirror tuning: when `mediaQuery` matches, each set field overrides the desktop prop. */
export type MirrorTabletLayout = {
  /** Defaults to `(max-width: 1024px)`. Use e.g. `(max-width: 834px)` for portrait iPad only. */
  mediaQuery?: string;
  productPhotoTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  mirrorInteractionTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  mirrorModeTitleTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  mirrorVideoMask?: MirrorVideoMaskPoints;
  mirrorVideoMaskGroupTransform?: MirrorVideoMaskGroupAdjust;
};

type InteractionDemoSectionProps = {
  /** Set `data-section` so you can target one instance in CSS/inspector (e.g. `Trial2`). */
  sectionSlug?: string;
  /** Background product photo behind the mirror UI (path under `public/`). */
  productPhotoSrc?: string;
  /** Static product-photo framing: `object-fit: contain`, letterboxed stage, CSS transform. */
  productPhotoTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  /** Override `.interaction-demo-process-strip` height (CSS default 250px). */
  processStripHeightPx?: number;
  /**
   * Baked layout: translate + scale for the whole mirror interaction stack (Smart UI shell + video +
   * turn-on + titles). Try-me tracks this transform too.
   */
  mirrorInteractionTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  /** Sliders + localStorage for the whole stack + Try me (`mirrorInteractionTransform` wins if both passed). */
  mirrorInteractionTransformControls?: boolean;
  /**
   * Extra translate + scale for the Smart TV chrome only (icons / trending row), composed inside the
   * bundle. Omit when using `mirrorSmartUiTransformControls`.
   */
  mirrorSmartUiTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  /** Sliders + localStorage for TV chrome only (`mirrorSmartUiTransform` wins over slider state if both are passed). */
  mirrorSmartUiTransformControls?: boolean;
  /** Baked layout: Smart TV / Movie Mode / Mirror Mode labels only (inside the title layer). */
  mirrorModeTitleTransform?: {
    scale: number;
    x: number;
    y: number;
  };
  /** Sliders + localStorage for those mode labels (`mirrorModeTitleTransform` wins if both are passed). */
  mirrorModeTitleTransformControls?: boolean;
  mirrorVideoMask?: MirrorVideoMaskPoints;
  mirrorVideoMaskControls?: boolean;
  /** Default corners when the editor loads with empty localStorage (optional). */
  mirrorVideoMaskSeed?: MirrorVideoMaskPoints;
  /** Baked pan/scale on top of base corners (`mirrorVideoMaskGroupTransform` wins over sliders when both are set). */
  mirrorVideoMaskGroupTransform?: MirrorVideoMaskGroupAdjust;
  /** Sliders + localStorage: move/size whole video mask quad on top of base corners. */
  mirrorVideoMaskGroupControls?: boolean;
  /**
   * Separate mirror/product tuning when `mediaQuery` matches (e.g. iPad aspect). Desktop props stay as-is for MacBook.
   */
  mirrorTabletLayout?: MirrorTabletLayout;
  /** DOM `id` for anchor links / scroll targets (e.g. `#trial2`). */
  anchorId?: string;
  locale?: Locale;
};

/** Homepage demo below MoonIntroSection — 25/75 split + bottom photo strip; timeline matches Hero behavior. */
export default function InteractionDemoSection({
  sectionSlug = "InteractionDemoSection",
  productPhotoSrc = "/hero-product.png?v=20260531a",
  productPhotoTransform,
  processStripHeightPx,
  mirrorInteractionTransform,
  mirrorInteractionTransformControls = false,
  mirrorSmartUiTransform,
  mirrorSmartUiTransformControls = false,
  mirrorModeTitleTransform,
  mirrorModeTitleTransformControls = false,
  mirrorVideoMask,
  mirrorVideoMaskControls = false,
  mirrorVideoMaskSeed,
  mirrorVideoMaskGroupTransform,
  mirrorVideoMaskGroupControls = false,
  mirrorTabletLayout,
  anchorId,
  locale = DEFAULT_LOCALE,
}: InteractionDemoSectionProps) {
  const dictionary = getDictionary(locale);
  const containerRef = useRef<HTMLElement>(null);
  const mirrorUiRef = useRef<HTMLDivElement>(null);
  const mirrorVideoRef = useRef<HTMLDivElement>(null);
  const mirrorVideoElementRef = useRef<HTMLVideoElement>(null);
  const shutdownTopRef = useRef<HTMLDivElement>(null);
  const shutdownBottomRef = useRef<HTMLDivElement>(null);
  const shutdownLineRef = useRef<HTMLDivElement>(null);
  const turnOnLineRef = useRef<HTMLDivElement>(null);
  const shutdownTopVideoRef = useRef<HTMLVideoElement>(null);
  const shutdownBottomVideoRef = useRef<HTMLVideoElement>(null);
  const modeTitleLayerRef = useRef<HTMLDivElement>(null);
  const smartTitleRef = useRef<HTMLSpanElement>(null);
  const movieTitleRef = useRef<HTMLSpanElement>(null);
  const mirrorTitleRef = useRef<HTMLSpanElement>(null);
  const mirrorPromptRef = useRef<HTMLButtonElement>(null);
  const transformationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const tabletMediaQuery =
    mirrorTabletLayout !== undefined
      ? mirrorTabletLayout.mediaQuery ?? "(max-width: 1024px)"
      : null;

  const tabletMediaMatches = useMediaQuery(tabletMediaQuery);

  const effectiveProductPhotoTransform =
    tabletMediaMatches && mirrorTabletLayout?.productPhotoTransform !== undefined
      ? mirrorTabletLayout.productPhotoTransform
      : productPhotoTransform;

  const effectiveMirrorInteractionTransform =
    tabletMediaMatches && mirrorTabletLayout?.mirrorInteractionTransform !== undefined
      ? mirrorTabletLayout.mirrorInteractionTransform
      : mirrorInteractionTransform;

  const effectiveMirrorModeTitleTransform =
    tabletMediaMatches && mirrorTabletLayout?.mirrorModeTitleTransform !== undefined
      ? mirrorTabletLayout.mirrorModeTitleTransform
      : mirrorModeTitleTransform;

  const effectiveMirrorVideoMask =
    tabletMediaMatches && mirrorTabletLayout?.mirrorVideoMask !== undefined
      ? mirrorTabletLayout.mirrorVideoMask
      : mirrorVideoMask;

  const effectiveMirrorVideoMaskGroupTransform =
    tabletMediaMatches && mirrorTabletLayout?.mirrorVideoMaskGroupTransform !== undefined
      ? mirrorTabletLayout.mirrorVideoMaskGroupTransform
      : mirrorVideoMaskGroupTransform;

  const hasProductPhotoLayout = effectiveProductPhotoTransform !== undefined;

  const mirrorSmartUiTransformStorageKey = `${MIRROR_SMART_UI_TRANSFORM_STORAGE_PREFIX}:${sectionSlug}`;
  const [smartUiTransform, setSmartUiTransform] = useState({
    scale: MIRROR_SMART_UI_TRANSFORM_DEFAULT.scale,
    x: MIRROR_SMART_UI_TRANSFORM_DEFAULT.x,
    y: MIRROR_SMART_UI_TRANSFORM_DEFAULT.y,
  });

  const mirrorModeTitleStackStorageKey = `${MIRROR_MODE_TITLE_STACK_STORAGE_PREFIX}:${sectionSlug}`;
  const [modeTitleStackTransform, setModeTitleStackTransform] = useState({
    scale: MIRROR_MODE_TITLE_STACK_DEFAULT.scale,
    x: MIRROR_MODE_TITLE_STACK_DEFAULT.x,
    y: MIRROR_MODE_TITLE_STACK_DEFAULT.y,
  });

  const mirrorBundleStackStorageKey = `${MIRROR_BUNDLE_STACK_STORAGE_PREFIX}:${sectionSlug}`;
  const [mirrorBundleStackLive, setMirrorBundleStackLive] = useState({
    scale: MIRROR_BUNDLE_STACK_DEFAULT.scale,
    x: MIRROR_BUNDLE_STACK_DEFAULT.x,
    y: MIRROR_BUNDLE_STACK_DEFAULT.y,
  });

  const mirrorVideoMaskStorageKey = `${MIRROR_VIDEO_MASK_STORAGE_PREFIX}:${sectionSlug}`;
  const [mirrorVideoMaskLive, setMirrorVideoMaskLive] = useState<MirrorVideoMaskPoints>(() =>
    mirrorVideoMaskSeed ? cloneVideoMask(mirrorVideoMaskSeed) : cloneDefaultVideoMask()
  );
  const [videoMaskCopyFlash, setVideoMaskCopyFlash] = useState(false);

  const mirrorVideoMaskGroupStorageKey = `${MIRROR_VIDEO_MASK_GROUP_STORAGE_PREFIX}:${sectionSlug}`;
  const [mirrorVideoMaskGroupLive, setMirrorVideoMaskGroupLive] = useState({
    x: MIRROR_VIDEO_MASK_GROUP_DEFAULT.x,
    y: MIRROR_VIDEO_MASK_GROUP_DEFAULT.y,
    scale: MIRROR_VIDEO_MASK_GROUP_DEFAULT.scale,
  });

  const smartUiAdjust =
    mirrorSmartUiTransform ??
    (mirrorSmartUiTransformControls ? smartUiTransform : undefined);

  const bundleAdjust =
    effectiveMirrorInteractionTransform ??
    (mirrorInteractionTransformControls ? mirrorBundleStackLive : undefined);

  const mirrorVideoMaskBase =
    effectiveMirrorVideoMask ?? (mirrorVideoMaskControls ? mirrorVideoMaskLive : undefined);

  const mirrorVideoMaskGroupAdjust =
    effectiveMirrorVideoMaskGroupTransform ??
    (mirrorVideoMaskGroupControls ? mirrorVideoMaskGroupLive : undefined);

  const mirrorVideoMaskResolved =
    mirrorVideoMaskBase === undefined
      ? undefined
      : mirrorVideoMaskGroupAdjust === undefined ||
          (mirrorVideoMaskGroupAdjust.x === 0 &&
            mirrorVideoMaskGroupAdjust.y === 0 &&
            mirrorVideoMaskGroupAdjust.scale === 1)
        ? mirrorVideoMaskBase
        : applyMirrorVideoMaskGroup(mirrorVideoMaskBase, mirrorVideoMaskGroupAdjust);

  const showVideoMaskCornerPanel = mirrorVideoMaskControls && effectiveMirrorVideoMask === undefined;
  const showVideoMaskGroupPanel =
    mirrorVideoMaskGroupControls &&
    effectiveMirrorVideoMaskGroupTransform === undefined &&
    mirrorVideoMaskBase !== undefined;

  const mirrorVideoClipCss = mirrorVideoMaskResolved
    ? stageVideoMaskToClipPath(mirrorVideoMaskResolved, INTERACTION_MIRROR_MOUNT_PCT)
    : undefined;

  const mirrorVideoPreviewClipStyle: CSSProperties | undefined = mirrorVideoClipCss
    ? { clipPath: mirrorVideoClipCss, WebkitClipPath: mirrorVideoClipCss }
    : undefined;

  const polygonPoints = maskCornersToSvgPolygonPoints(mirrorVideoMaskResolved ?? MIRROR_MASK_POINTS);

  const mirrorBundleCss = mirrorBundleCssTransform(
    bundleAdjust !== undefined,
    bundleAdjust ?? { scale: 1, x: 0, y: 0 },
    MIRROR_UI_VERTICAL_OFFSET_PX
  );

  const mirrorBundleStyle: CSSProperties = {
    ...INTERACTION_MIRROR_LAYER_MOUNT,
    zIndex: 20,
    ...(mirrorBundleCss
      ? {
          transform: mirrorBundleCss,
          transformOrigin: bundleAdjust !== undefined ? "center center" : undefined,
        }
      : {}),
  };

  const smartUiShellStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 22,
    ...(smartUiAdjust
      ? {
          transform: `translate(${smartUiAdjust.x}px, ${smartUiAdjust.y}px) scale(${smartUiAdjust.scale})`,
          transformOrigin: "center center",
        }
      : {}),
  };

  const modeTitleStackAdjust =
    effectiveMirrorModeTitleTransform ??
    (mirrorModeTitleTransformControls ? modeTitleStackTransform : undefined);

  const modeTitleStackShellStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    ...(modeTitleStackAdjust
      ? {
          transform: `translate(${modeTitleStackAdjust.x}px, ${modeTitleStackAdjust.y}px) scale(${modeTitleStackAdjust.scale})`,
          transformOrigin: "50% 85%",
        }
      : {}),
  };

  useEffect(() => {
    if (!mirrorSmartUiTransformControls) return;

    try {
      const raw = localStorage.getItem(mirrorSmartUiTransformStorageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        scale?: unknown;
        x?: unknown;
        y?: unknown;
      };

      setSmartUiTransform((prev) => ({
        scale:
          typeof parsed.scale === "number"
            ? clamp(parsed.scale, MIRROR_SMART_UI_TRANSFORM_LIMITS.scaleMin, MIRROR_SMART_UI_TRANSFORM_LIMITS.scaleMax)
            : prev.scale,
        x:
          typeof parsed.x === "number"
            ? clamp(parsed.x, -MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax, MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax)
            : prev.x,
        y:
          typeof parsed.y === "number"
            ? clamp(parsed.y, -MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax, MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax)
            : prev.y,
      }));
    } catch {
      /* ignore corrupt storage */
    }
  }, [mirrorSmartUiTransformControls, mirrorSmartUiTransformStorageKey]);

  const persistSmartUiTransform = (next: { scale: number; x: number; y: number }) => {
    try {
      localStorage.setItem(mirrorSmartUiTransformStorageKey, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
  };

  const patchSmartUiTransform = (patch: Partial<{ scale: number; x: number; y: number }>) => {
    setSmartUiTransform((prev) => {
      const next = {
        scale:
          patch.scale !== undefined
            ? clamp(patch.scale, MIRROR_SMART_UI_TRANSFORM_LIMITS.scaleMin, MIRROR_SMART_UI_TRANSFORM_LIMITS.scaleMax)
            : prev.scale,
        x:
          patch.x !== undefined
            ? clamp(patch.x, -MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax, MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax)
            : prev.x,
        y:
          patch.y !== undefined
            ? clamp(patch.y, -MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax, MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax)
            : prev.y,
      };

      if (mirrorSmartUiTransformControls) persistSmartUiTransform(next);
      return next;
    });
  };

  useEffect(() => {
    if (!mirrorModeTitleTransformControls) return;

    try {
      const raw = localStorage.getItem(mirrorModeTitleStackStorageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        scale?: unknown;
        x?: unknown;
        y?: unknown;
      };

      setModeTitleStackTransform((prev) => ({
        scale:
          typeof parsed.scale === "number"
            ? clamp(parsed.scale, MIRROR_MODE_TITLE_STACK_LIMITS.scaleMin, MIRROR_MODE_TITLE_STACK_LIMITS.scaleMax)
            : prev.scale,
        x:
          typeof parsed.x === "number"
            ? clamp(parsed.x, -MIRROR_MODE_TITLE_STACK_LIMITS.translateMax, MIRROR_MODE_TITLE_STACK_LIMITS.translateMax)
            : prev.x,
        y:
          typeof parsed.y === "number"
            ? clamp(parsed.y, -MIRROR_MODE_TITLE_STACK_LIMITS.translateMax, MIRROR_MODE_TITLE_STACK_LIMITS.translateMax)
            : prev.y,
      }));
    } catch {
      /* ignore corrupt storage */
    }
  }, [mirrorModeTitleTransformControls, mirrorModeTitleStackStorageKey]);

  const persistModeTitleStackTransform = (next: { scale: number; x: number; y: number }) => {
    try {
      localStorage.setItem(mirrorModeTitleStackStorageKey, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
  };

  const patchModeTitleStackTransform = (patch: Partial<{ scale: number; x: number; y: number }>) => {
    setModeTitleStackTransform((prev) => {
      const next = {
        scale:
          patch.scale !== undefined
            ? clamp(patch.scale, MIRROR_MODE_TITLE_STACK_LIMITS.scaleMin, MIRROR_MODE_TITLE_STACK_LIMITS.scaleMax)
            : prev.scale,
        x:
          patch.x !== undefined
            ? clamp(patch.x, -MIRROR_MODE_TITLE_STACK_LIMITS.translateMax, MIRROR_MODE_TITLE_STACK_LIMITS.translateMax)
            : prev.x,
        y:
          patch.y !== undefined
            ? clamp(patch.y, -MIRROR_MODE_TITLE_STACK_LIMITS.translateMax, MIRROR_MODE_TITLE_STACK_LIMITS.translateMax)
            : prev.y,
      };

      if (mirrorModeTitleTransformControls) persistModeTitleStackTransform(next);
      return next;
    });
  };

  useEffect(() => {
    if (!mirrorInteractionTransformControls) return;

    try {
      const raw = localStorage.getItem(mirrorBundleStackStorageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        scale?: unknown;
        x?: unknown;
        y?: unknown;
      };

      setMirrorBundleStackLive((prev) => ({
        scale:
          typeof parsed.scale === "number"
            ? clamp(parsed.scale, MIRROR_BUNDLE_STACK_LIMITS.scaleMin, MIRROR_BUNDLE_STACK_LIMITS.scaleMax)
            : prev.scale,
        x:
          typeof parsed.x === "number"
            ? clamp(parsed.x, -MIRROR_BUNDLE_STACK_LIMITS.translateMax, MIRROR_BUNDLE_STACK_LIMITS.translateMax)
            : prev.x,
        y:
          typeof parsed.y === "number"
            ? clamp(parsed.y, -MIRROR_BUNDLE_STACK_LIMITS.translateMax, MIRROR_BUNDLE_STACK_LIMITS.translateMax)
            : prev.y,
      }));
    } catch {
      /* ignore corrupt storage */
    }
  }, [mirrorInteractionTransformControls, mirrorBundleStackStorageKey]);

  const persistMirrorBundleStack = (next: { scale: number; x: number; y: number }) => {
    try {
      localStorage.setItem(mirrorBundleStackStorageKey, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
  };

  const patchMirrorBundleStack = (patch: Partial<{ scale: number; x: number; y: number }>) => {
    setMirrorBundleStackLive((prev) => {
      const next = {
        scale:
          patch.scale !== undefined
            ? clamp(patch.scale, MIRROR_BUNDLE_STACK_LIMITS.scaleMin, MIRROR_BUNDLE_STACK_LIMITS.scaleMax)
            : prev.scale,
        x:
          patch.x !== undefined
            ? clamp(patch.x, -MIRROR_BUNDLE_STACK_LIMITS.translateMax, MIRROR_BUNDLE_STACK_LIMITS.translateMax)
            : prev.x,
        y:
          patch.y !== undefined
            ? clamp(patch.y, -MIRROR_BUNDLE_STACK_LIMITS.translateMax, MIRROR_BUNDLE_STACK_LIMITS.translateMax)
            : prev.y,
      };

      if (mirrorInteractionTransformControls) persistMirrorBundleStack(next);
      return next;
    });
  };

  useEffect(() => {
    if (!mirrorVideoMaskControls) return;

    try {
      const raw = localStorage.getItem(mirrorVideoMaskStorageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<
        Record<keyof MirrorVideoMaskPoints, { x?: unknown; y?: unknown } | undefined>
      >;

      setMirrorVideoMaskLive((prev) => {
        const corners: (keyof MirrorVideoMaskPoints)[] = ["tl", "tr", "br", "bl"];
        const next: MirrorVideoMaskPoints = {
          tl: { ...prev.tl },
          tr: { ...prev.tr },
          br: { ...prev.br },
          bl: { ...prev.bl },
        };

        for (const c of corners) {
          const pt = parsed[c];
          if (!pt || typeof pt !== "object") continue;
          next[c] = {
            x: typeof pt.x === "number" ? clamp(pt.x, 0, 100) : next[c].x,
            y: typeof pt.y === "number" ? clamp(pt.y, 0, 100) : next[c].y,
          };
        }

        return next;
      });
    } catch {
      /* ignore corrupt storage */
    }
  }, [mirrorVideoMaskControls, mirrorVideoMaskStorageKey]);

  const persistMirrorVideoMaskGroup = (next: MirrorVideoMaskGroupAdjust) => {
    try {
      localStorage.setItem(mirrorVideoMaskGroupStorageKey, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
  };

  useEffect(() => {
    if (!mirrorVideoMaskGroupControls) return;

    try {
      const raw = localStorage.getItem(mirrorVideoMaskGroupStorageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        scale?: unknown;
        x?: unknown;
        y?: unknown;
      };

      setMirrorVideoMaskGroupLive((prev) => ({
        scale:
          typeof parsed.scale === "number"
            ? clamp(parsed.scale, MIRROR_VIDEO_MASK_GROUP_LIMITS.scaleMin, MIRROR_VIDEO_MASK_GROUP_LIMITS.scaleMax)
            : prev.scale,
        x:
          typeof parsed.x === "number"
            ? clamp(parsed.x, -MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax, MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax)
            : prev.x,
        y:
          typeof parsed.y === "number"
            ? clamp(parsed.y, -MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax, MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax)
            : prev.y,
      }));
    } catch {
      /* ignore corrupt storage */
    }
  }, [mirrorVideoMaskGroupControls, mirrorVideoMaskGroupStorageKey]);

  const patchMirrorVideoMaskGroup = (patch: Partial<MirrorVideoMaskGroupAdjust>) => {
    setMirrorVideoMaskGroupLive((prev) => {
      const next: MirrorVideoMaskGroupAdjust = {
        scale:
          patch.scale !== undefined
            ? clamp(patch.scale, MIRROR_VIDEO_MASK_GROUP_LIMITS.scaleMin, MIRROR_VIDEO_MASK_GROUP_LIMITS.scaleMax)
            : prev.scale,
        x:
          patch.x !== undefined
            ? clamp(patch.x, -MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax, MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax)
            : prev.x,
        y:
          patch.y !== undefined
            ? clamp(patch.y, -MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax, MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax)
            : prev.y,
      };

      if (mirrorVideoMaskGroupControls) persistMirrorVideoMaskGroup(next);
      return next;
    });
  };

  const resetMirrorVideoMaskGroup = () => {
    const next: MirrorVideoMaskGroupAdjust = {
      x: MIRROR_VIDEO_MASK_GROUP_DEFAULT.x,
      y: MIRROR_VIDEO_MASK_GROUP_DEFAULT.y,
      scale: MIRROR_VIDEO_MASK_GROUP_DEFAULT.scale,
    };
    setMirrorVideoMaskGroupLive(next);
    if (mirrorVideoMaskGroupControls) persistMirrorVideoMaskGroup(next);
  };

  const persistMirrorVideoMask = (next: MirrorVideoMaskPoints) => {
    try {
      localStorage.setItem(mirrorVideoMaskStorageKey, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
  };

  const patchMirrorVideoMaskCorner = (
    corner: keyof MirrorVideoMaskPoints,
    axis: "x" | "y",
    value: number
  ) => {
    const v = clamp(value, 0, 100);
    setMirrorVideoMaskLive((prev) => {
      const next: MirrorVideoMaskPoints = {
        ...prev,
        [corner]: { ...prev[corner], [axis]: v },
      };
      if (mirrorVideoMaskControls) persistMirrorVideoMask(next);
      return next;
    });
  };

  const resetMirrorVideoMask = () => {
    const next = mirrorVideoMaskSeed ? cloneVideoMask(mirrorVideoMaskSeed) : cloneDefaultVideoMask();
    setMirrorVideoMaskLive(next);
    if (mirrorVideoMaskControls) persistMirrorVideoMask(next);
  };

  const copyVideoMaskJsx = async () => {
    const o = mirrorVideoMaskResolved;
    if (!o) return;

    const text = `mirrorVideoMask={{\n  tl: { x: ${o.tl.x.toFixed(2)}, y: ${o.tl.y.toFixed(2)} },\n  tr: { x: ${o.tr.x.toFixed(2)}, y: ${o.tr.y.toFixed(2)} },\n  br: { x: ${o.br.x.toFixed(2)}, y: ${o.br.y.toFixed(2)} },\n  bl: { x: ${o.bl.x.toFixed(2)}, y: ${o.bl.y.toFixed(2)} },\n}}`;

    try {
      await navigator.clipboard.writeText(text);
      setVideoMaskCopyFlash(true);
      window.setTimeout(() => setVideoMaskCopyFlash(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const startTransformation = () => {
    const ui = mirrorUiRef.current;
    const video = mirrorVideoRef.current;
    const videoElement = mirrorVideoElementRef.current;
    const shutdownTop = shutdownTopRef.current;
    const shutdownBottom = shutdownBottomRef.current;
    const shutdownLine = shutdownLineRef.current;
    const shutdownTopVideo = shutdownTopVideoRef.current;
    const shutdownBottomVideo = shutdownBottomVideoRef.current;
    const modeTitleLayer = modeTitleLayerRef.current;
    const smartTitle = smartTitleRef.current;
    const movieTitle = movieTitleRef.current;
    const mirrorTitle = mirrorTitleRef.current;
    const modeTitles = [smartTitle, movieTitle, mirrorTitle];
    const prompt = mirrorPromptRef.current;

    if (!ui || !video) return;

    const turnOnLine = turnOnLineRef.current;

    transformationTimelineRef.current?.kill();
    gsap.killTweensOf([
      ui,
      video,
      prompt,
      shutdownTop,
      shutdownBottom,
      shutdownLine,
      turnOnLine,
      modeTitleLayer,
      ...modeTitles,
    ]);

    transformationTimelineRef.current = gsap
      .timeline()
      .to(prompt, { autoAlpha: 0, duration: 0.25, ease: "power2.out" }, 0)
      .set(video, { autoAlpha: 0, y: 10 })
      .set([shutdownTop, shutdownBottom], { autoAlpha: 0, scaleY: 1 })
      .set(shutdownLine, { autoAlpha: 0, scaleY: 1 })
      .set(modeTitleLayer, { autoAlpha: 1 })
      .set(modeTitles, { autoAlpha: 0, y: 8, clipPath: "inset(0 100% 0 0)" })
      .set(ui, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "brightness(1.06) blur(9px)",
        clipPath: UI_TURN_ON_CLIP_START,
      })
      .set(turnOnLine, { autoAlpha: 1 })
      .to(
        ui,
        {
          clipPath: UI_TURN_ON_CLIP_END,
          filter: "brightness(1) blur(0px)",
          duration: 0.72,
          ease: "power2.out",
        },
        "+=0.06"
      )
      .to(turnOnLine, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }, "<0.14")
      .to(
        smartTitle,
        { autoAlpha: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.out" },
        "<"
      )
      .to(
        smartTitle,
        { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.inOut" },
        "+=0.45"
      )
      .to(ui, { autoAlpha: 0, y: -10, duration: 0.75, ease: "power2.inOut" }, "<")
      .call(() => {
        if (videoElement) {
          gsap.set(videoElement, { autoAlpha: 1 });
          videoElement.load();
          videoElement.currentTime = 0;
          void videoElement.play();
        }
      })
      .to(video, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, "<0.15")
      .to(movieTitle, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.72,
        ease: "power3.out",
      }, "<0.18")
      .call(() => {
        if (!videoElement) return;

        const shutdownTime = Math.max(videoElement.currentTime - 0.04, 0);

        [shutdownTopVideo, shutdownBottomVideo].forEach((splitVideo) => {
          if (!splitVideo) return;
          splitVideo.currentTime = shutdownTime;
          splitVideo.pause();
        });

        videoElement.pause();
      }, undefined, `+=${VIDEO_PREVIEW_SECONDS}`)
      .to(movieTitle, { autoAlpha: 0, y: -8, duration: 0.28, ease: "power2.inOut" })
      .set([shutdownTop, shutdownBottom], { autoAlpha: 1, scaleY: 1 })
      .set(shutdownLine, { autoAlpha: 0, scaleY: 1 })
      .set(mirrorVideoElementRef.current, { autoAlpha: 0 })
      .to([shutdownTop, shutdownBottom], {
        scaleY: 0.018,
        duration: 0.62,
        ease: "power3.inOut",
      })
      .to(shutdownLine, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, "-=0.18")
      .to([shutdownTop, shutdownBottom], { autoAlpha: 0, duration: 0.16, ease: "power2.out" }, "<")
      .to(shutdownLine, { autoAlpha: 0, duration: 0.42, ease: "power2.inOut" }, "+=0.08")
      .to(mirrorTitle, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.72,
        ease: "power3.out",
      }, "-=0.08")
      .to(mirrorTitle, { autoAlpha: 0, y: -8, duration: 0.45, ease: "power2.inOut" }, "+=0.55")
      .to(video, { autoAlpha: 0, duration: 0.2, ease: "power2.out" })
      .call(() => {
        gsap.set(mirrorVideoElementRef.current, { autoAlpha: 1 });
        videoElement?.pause();
      })
      .to(prompt, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, "-=0.2");
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set([mirrorUiRef.current, mirrorVideoRef.current], {
        autoAlpha: 0,
        y: 0,
      });
      gsap.set([shutdownTopRef.current, shutdownBottomRef.current, shutdownLineRef.current], {
        autoAlpha: 0,
      });
      gsap.set(
        [smartTitleRef.current, movieTitleRef.current, mirrorTitleRef.current],
        { autoAlpha: 0, y: 8, clipPath: "inset(0 100% 0 0)" }
      );
      gsap.set(modeTitleLayerRef.current, { autoAlpha: 0 });

      tl.from(".hero-label", { y: 18, opacity: 0, duration: 0.55 })
        .from(".hero-line", { y: "105%", duration: 0.85, stagger: 0.12 }, "-=0.3")
        .from(".hero-body", { y: 18, opacity: 0, duration: 0.55 }, "-=0.45");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id={anchorId}
      className="interaction-demo-section relative flex w-full flex-col overflow-hidden lg:h-svh lg:max-h-svh"
      data-section={sectionSlug}
      data-try-me-style="gold-pulse"
      aria-label={
        sectionSlug === "InteractionDemoSection"
          ? dictionary.interactionDemo.ariaLabel
          : `${dictionary.interactionDemo.ariaLabel} ${sectionSlug}`
      }
    >
      <div className="interaction-demo-main-row flex min-h-[65svh] w-full flex-col lg:min-h-0 lg:flex-1 lg:flex-row">
      {/* ── Left column (25%) — copy + steps ── */}
      <div
        className="interaction-demo-copy relative z-10 flex w-full flex-col bg-[#F2F0ED] pb-14 pt-[clamp(3rem,10vw,5.5rem)] lg:h-full lg:min-h-0 lg:w-[25%] lg:max-w-[25%] lg:flex-[0_0_25%] lg:shrink-0 lg:overflow-y-auto lg:pb-12 lg:pt-[clamp(2.25rem,7vh,4.25rem)]"
      >
        <div className="flex w-full max-w-full flex-1 flex-col justify-center gap-0">
        <p
          data-copy-part="hands-on-label"
          className="hero-label mb-2 font-medium"
          style={{
            color: "#A67C52",
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textAlign: "left",
          }}
        >
          {dictionary.interactionDemo.kicker}
        </p>

        <div className="clip-wrap">
          <h2
            data-copy-part="try-me-headline"
            className="hero-line text-pretty leading-[0.98]"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw + 0.6rem, 2.85rem)",
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            {dictionary.interactionDemo.headline}
          </h2>
        </div>

        <div className="hero-body flex flex-col gap-10 lg:gap-12">
          <p
            data-copy-part="interaction-intro"
            className="interaction-demo-intro text-pretty mt-[clamp(2rem,5vh,3.25rem)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9375rem, 1.1vw + 0.35rem, 1.125rem)",
              color: "#454240",
              lineHeight: 1.5,
              maxWidth: "100%",
            }}
          >
            {dictionary.interactionDemo.intro}
          </p>

          <ol className="m-0 flex list-none flex-col gap-8 p-0 lg:gap-8">
            <li className="flex items-start gap-5">
              <span className="interaction-demo-step-icon" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/Remote.png?v=20260531a" alt="" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  data-copy-part="step-remote-title"
                  className="uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.8125rem, 0.95vw + 0.22rem, 0.9375rem)",
                    fontWeight: 700,
                    color: "#121212",
                  }}
                >
                  {dictionary.interactionDemo.steps[0].title}
                </p>
                <p
                  data-copy-part="step-remote-body"
                  className="mt-1.5 text-pretty"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.75rem, 0.72vw + 0.14rem, 0.8125rem)",
                    fontWeight: 400,
                    color: "#5c5956",
                    lineHeight: 1.55,
                  }}
                >
                  {dictionary.interactionDemo.steps[0].body}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-5">
              <span className="interaction-demo-step-icon" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/TV.png?v=20260531a" alt="" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  data-copy-part="step-transform-title"
                  className="uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.8125rem, 0.95vw + 0.22rem, 0.9375rem)",
                    fontWeight: 700,
                    color: "#121212",
                  }}
                >
                  {dictionary.interactionDemo.steps[1].title}
                </p>
                <p
                  data-copy-part="step-transform-body"
                  className="mt-1.5 text-pretty"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.75rem, 0.72vw + 0.14rem, 0.8125rem)",
                    fontWeight: 400,
                    color: "#5c5956",
                    lineHeight: 1.55,
                  }}
                >
                  {dictionary.interactionDemo.steps[1].body}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-5">
              <span className="interaction-demo-step-icon" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/Mirror.png?v=20260531a" alt="" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  data-copy-part="step-return-title"
                  className="uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.8125rem, 0.95vw + 0.22rem, 0.9375rem)",
                    fontWeight: 700,
                    color: "#121212",
                  }}
                >
                  {dictionary.interactionDemo.steps[2].title}
                </p>
                <p
                  data-copy-part="step-return-body"
                  className="mt-1.5 text-pretty"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.75rem, 0.72vw + 0.14rem, 0.8125rem)",
                    fontWeight: 400,
                    color: "#5c5956",
                    lineHeight: 1.55,
                  }}
                >
                  {dictionary.interactionDemo.steps[2].body}
                </p>
              </div>
            </li>
          </ol>
        </div>

        </div>
      </div>

      {/* ── Right column (75%) — mirror stage + TV interaction ── */}
      <div className="interaction-demo-visual-rail relative flex min-h-[65svh] w-full flex-[1_1_auto] lg:h-full lg:min-h-0 lg:w-[75%] lg:max-w-[75%] lg:flex-[0_0_75%] lg:shrink-0">
        <div
          className={
            hasProductPhotoLayout
              ? "interaction-demo-mirror-stage interaction-demo-mirror-stage--product-letterbox"
              : "interaction-demo-mirror-stage"
          }
        >
          <button
            type="button"
            onClick={startTransformation}
            className="interaction-demo-full-area-trigger absolute inset-0 z-10 bg-transparent p-0"
            style={{ border: 0 }}
            aria-label={dictionary.interactionDemo.startAreaAria}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={
              hasProductPhotoLayout
                ? "interaction-demo-product-photo interaction-demo-product-photo--contain"
                : "interaction-demo-product-photo"
            }
            src={productPhotoSrc}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: hasProductPhotoLayout ? "contain" : "cover",
              objectPosition: hasProductPhotoLayout ? "center center" : "82% center",
              userSelect: "none",
              pointerEvents: "none",
              ...(effectiveProductPhotoTransform
                ? {
                    transform: `translate(${effectiveProductPhotoTransform.x}px, ${effectiveProductPhotoTransform.y}px) scale(${effectiveProductPhotoTransform.scale})`,
                    transformOrigin: "center center",
                  }
                : {}),
            }}
          />

          {/* Mirror glass: full-stack bundle transform + optional extra transform on Smart TV chrome only. */}
          <div className="interaction-demo-mirror-animation-bundle" style={mirrorBundleStyle}>
            <div className="interaction-demo-mirror-smart-ui-shell" style={smartUiShellStyle}>
              <div ref={mirrorUiRef} className="mirror-ui interaction-demo-mirror-ui-fill" aria-hidden>
                <div className="mirror-ui-inner">
                  <div className="mirror-time-block">
                    <div className="mirror-time">10:30</div>
                    <div className="mirror-date">{dictionary.mirrorUi.date}</div>
                    <div className="mirror-weather">{dictionary.mirrorUi.weather}</div>
                  </div>

                  <div className="mirror-section-label">{dictionary.mirrorUi.trending}</div>
                  <div className="mirror-show-strip" aria-label={dictionary.mirrorUi.trendingAria}>
                    <img src="/icons/Shows.png?v=20260531a" alt="" />
                  </div>

                  <div className="mirror-section-label">{dictionary.mirrorUi.apps}</div>
                  <div className="mirror-app-row" aria-label={dictionary.mirrorUi.appsAria}>
                    <span className="app-card">
                      <img className="app-logo app-logo-netflix" src="/icons/Netflix.png?v=20260531a" alt="" />
                    </span>
                    <span className="app-card">
                      <img className="app-logo app-logo-youtube" src="/icons/YouTub.png?v=20260531a" alt="" />
                    </span>
                    <span className="app-card">
                      <img className="app-logo app-logo-prime" src="/icons/PrimeVideo.png?v=20260531a" alt="" />
                    </span>
                    <span className="app-card">
                      <img className="app-logo app-logo-apple" src="/icons/AppleTV.png?v=20260531a" alt="" />
                    </span>
                  </div>

                  <div className="mirror-section-label">{dictionary.mirrorUi.shortcuts}</div>
                  <div className="mirror-shortcuts" aria-label={dictionary.mirrorUi.controlsAria}>
                    <span>
                      <img src="/icons/Music.png?v=20260531a" alt="" />
                      <small>{dictionary.mirrorUi.music}</small>
                    </span>
                    <span>
                      <img src="/icons/Apps.png?v=20260531a" alt="" />
                      <small>{dictionary.mirrorUi.apps}</small>
                    </span>
                    <span>
                      <img src="/icons/AirPlay.png?v=20260531a" alt="" />
                      <small>{dictionary.mirrorUi.airPlay}</small>
                    </span>
                    <span>
                      <img src="/icons/Settings.png?v=20260531a" alt="" />
                      <small>{dictionary.mirrorUi.settings}</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={mirrorVideoRef}
              className="mirror-video-preview interaction-demo-mirror-video-fill"
              style={mirrorVideoPreviewClipStyle}
              aria-hidden
            >
              <video
                ref={mirrorVideoElementRef}
                className="mirror-video-element"
                src="/videos/Beachhhh.mov?v=1"
                muted
                playsInline
                preload="auto"
              />
              <div className="mirror-shutdown-layer" aria-hidden>
                <div ref={shutdownTopRef} className="mirror-shutdown-half mirror-shutdown-top">
                  <video
                    ref={shutdownTopVideoRef}
                    className="mirror-shutdown-video mirror-shutdown-video-top"
                    src="/videos/Beachhhh.mov?v=1"
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
                <div ref={shutdownBottomRef} className="mirror-shutdown-half mirror-shutdown-bottom">
                  <video
                    ref={shutdownBottomVideoRef}
                    className="mirror-shutdown-video mirror-shutdown-video-bottom"
                    src="/videos/Beachhhh.mov?v=1"
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
                <div ref={shutdownLineRef} className="mirror-shutdown-line" />
              </div>
            </div>

            <div className="mirror-turnon-layer interaction-demo-mirror-turnon-fill" aria-hidden>
              <div ref={turnOnLineRef} className="mirror-turnon-line" />
            </div>

            <div
              ref={modeTitleLayerRef}
              className="mirror-mode-title-layer interaction-demo-mirror-title-fill"
              aria-hidden
            >
              <div className="interaction-demo-mode-title-stack-shell" style={modeTitleStackShellStyle}>
                <span ref={smartTitleRef} className="mirror-mode-title">
                  {dictionary.mirrorUi.modeSmart}
                </span>
                <span ref={movieTitleRef} className="mirror-mode-title">
                  {dictionary.mirrorUi.modeMovie}
                </span>
                <span ref={mirrorTitleRef} className="mirror-mode-title">
                  {dictionary.mirrorUi.modeMirror}
                </span>
              </div>
            </div>
          </div>

          {bundleAdjust !== undefined ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 59,
                pointerEvents: "none",
                ...(mirrorBundleCss
                  ? {
                      transform: mirrorBundleCss,
                      transformOrigin: `${MIRROR_GLASS_CENTER_ORIGIN_PCT.x}% ${MIRROR_GLASS_CENTER_ORIGIN_PCT.y}%`,
                    }
                  : {}),
              }}
            >
              <button
                ref={mirrorPromptRef}
                type="button"
                className="mirror-press-prompt"
                onClick={startTransformation}
                style={
                  {
                    ["--try-me-scale"]: TRY_ME_SIZE_PERCENT / 100,
                    pointerEvents: "auto",
                  } as CSSProperties
                }
              >
                <span className="mirror-press-prompt-bounce">
                  <span className="mirror-press-prompt-inner">
                    <span className="mirror-press-icon" aria-hidden>
                      ☝
                    </span>
                    <span>
                      {dictionary.interactionDemo.pressPrompt.title}
                      <small>{dictionary.interactionDemo.pressPrompt.subtitle}</small>
                    </span>
                  </span>
                </span>
              </button>
            </div>
          ) : (
            <button
              ref={mirrorPromptRef}
              type="button"
              className="mirror-press-prompt"
              onClick={startTransformation}
              style={
                {
                  ["--try-me-scale"]: TRY_ME_SIZE_PERCENT / 100,
                } as CSSProperties
              }
            >
              <span className="mirror-press-prompt-bounce">
                <span className="mirror-press-prompt-inner">
                  <span className="mirror-press-icon" aria-hidden>
                    ☝
                  </span>
                  <span>
                    {dictionary.interactionDemo.pressPrompt.title}
                    <small>{dictionary.interactionDemo.pressPrompt.subtitle}</small>
                  </span>
                </span>
              </span>
            </button>
          )}

          <svg className="mirror-shape-debug" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points={polygonPoints} />
          </svg>
        </div>
      </div>
      </div>

      <div
        className="interaction-demo-process-strip"
        aria-label={dictionary.interactionDemo.processAria}
        style={
          processStripHeightPx !== undefined
            ? {
                height: `${processStripHeightPx}px`,
              }
            : undefined
        }
      >
        {PROCESS_STEPS.map((step, index) => (
          <React.Fragment key={step.num}>
            <div className="interaction-step">
              <div className="interaction-step-copy">
                <span className="interaction-step-num">{step.num}</span>
                <p>{dictionary.interactionDemo.processSteps[index]}</p>
              </div>
              <div className="interaction-step-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt={dictionary.interactionDemo.processSteps[index]} />
              </div>
            </div>

            {index < PROCESS_STEPS.length - 1 && (
              <div className="interaction-demo-process-arrow" aria-hidden>›</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {(showVideoMaskCornerPanel || showVideoMaskGroupPanel) && (
        <div
          className="interaction-mode-title-transform-panel interaction-video-mask-panel"
          aria-label="Video mask"
        >
          <p className="interaction-mode-title-transform-panel-title">Video mask</p>
          <p className="interaction-mode-title-transform-panel-hint">
            {showVideoMaskGroupPanel && showVideoMaskCornerPanel
              ? "Adjust overall position & size, then fine-tune corners if needed. Copy JSX bakes the final quad."
              : showVideoMaskGroupPanel
                ? "Move/size the video clip quad on top of your base corners (stage %). Copy JSX bakes final corners."
                : "Stage % (0–100), four corners — clips video only. Copy JSX when done."}
          </p>

          {showVideoMaskGroupPanel && (
            <>
              <label className="interaction-mode-title-transform-row">
                <span className="interaction-mode-title-transform-label">Size</span>
                <input
                  type="range"
                  min={MIRROR_VIDEO_MASK_GROUP_LIMITS.scaleMin}
                  max={MIRROR_VIDEO_MASK_GROUP_LIMITS.scaleMax}
                  step={0.01}
                  value={mirrorVideoMaskGroupLive.scale}
                  onChange={(e) => patchMirrorVideoMaskGroup({ scale: Number(e.target.value) })}
                />
                <span className="interaction-mode-title-transform-value">
                  {mirrorVideoMaskGroupLive.scale.toFixed(2)}
                </span>
              </label>
              <label className="interaction-mode-title-transform-row">
                <span className="interaction-mode-title-transform-label">Up / down</span>
                <input
                  type="range"
                  min={-MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax}
                  max={MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax}
                  step={0.05}
                  value={mirrorVideoMaskGroupLive.y}
                  onChange={(e) => patchMirrorVideoMaskGroup({ y: Number(e.target.value) })}
                />
                <span className="interaction-mode-title-transform-value">{mirrorVideoMaskGroupLive.y.toFixed(2)}%</span>
              </label>
              <label className="interaction-mode-title-transform-row">
                <span className="interaction-mode-title-transform-label">Left / right</span>
                <input
                  type="range"
                  min={-MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax}
                  max={MIRROR_VIDEO_MASK_GROUP_LIMITS.translateMax}
                  step={0.05}
                  value={mirrorVideoMaskGroupLive.x}
                  onChange={(e) => patchMirrorVideoMaskGroup({ x: Number(e.target.value) })}
                />
                <span className="interaction-mode-title-transform-value">{mirrorVideoMaskGroupLive.x.toFixed(2)}%</span>
              </label>
              <button
                type="button"
                className="interaction-mode-title-transform-reset interaction-video-mask-section-reset"
                onClick={resetMirrorVideoMaskGroup}
              >
                Reset position & size
              </button>
            </>
          )}

          {showVideoMaskGroupPanel && showVideoMaskCornerPanel && (
            <div className="interaction-video-mask-section-rule" aria-hidden />
          )}

          {showVideoMaskCornerPanel &&
            (["tl", "tr", "br", "bl"] as const).map((corner) => (
              <div key={corner} className="interaction-video-mask-corner-block">
                <p className="interaction-video-mask-corner-title">{VIDEO_MASK_CORNER_LABELS[corner]}</p>
                <label className="interaction-mode-title-transform-row">
                  <span className="interaction-mode-title-transform-label">X</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.05}
                    value={mirrorVideoMaskLive[corner].x}
                    onChange={(e) => patchMirrorVideoMaskCorner(corner, "x", Number(e.target.value))}
                  />
                  <span className="interaction-mode-title-transform-value">
                    {mirrorVideoMaskLive[corner].x.toFixed(2)}
                  </span>
                </label>
                <label className="interaction-mode-title-transform-row">
                  <span className="interaction-mode-title-transform-label">Y</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.05}
                    value={mirrorVideoMaskLive[corner].y}
                    onChange={(e) => patchMirrorVideoMaskCorner(corner, "y", Number(e.target.value))}
                  />
                  <span className="interaction-mode-title-transform-value">
                    {mirrorVideoMaskLive[corner].y.toFixed(2)}
                  </span>
                </label>
              </div>
            ))}

          {showVideoMaskCornerPanel && (
            <button type="button" className="interaction-mode-title-transform-reset" onClick={resetMirrorVideoMask}>
              Reset corners
            </button>
          )}

          {mirrorVideoMaskResolved && (
            <button
              type="button"
              className="interaction-mode-title-transform-reset interaction-video-mask-copy-btn"
              onClick={() => void copyVideoMaskJsx()}
            >
              {videoMaskCopyFlash ? "Copied" : "Copy JSX values"}
            </button>
          )}
        </div>
      )}

      {mirrorInteractionTransformControls && (
        <div
          className="interaction-mode-title-transform-panel interaction-mirror-bundle-panel"
          aria-label="Whole mirror interaction position"
        >
          <p className="interaction-mode-title-transform-panel-title">Mirror stack</p>
          <p className="interaction-mode-title-transform-panel-hint">
            Moves Smart UI, video, turn-on, titles — and Try me — together
          </p>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Size</span>
            <input
              type="range"
              min={MIRROR_BUNDLE_STACK_LIMITS.scaleMin}
              max={MIRROR_BUNDLE_STACK_LIMITS.scaleMax}
              step={0.01}
              value={mirrorBundleStackLive.scale}
              onChange={(e) => patchMirrorBundleStack({ scale: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">
              {mirrorBundleStackLive.scale.toFixed(2)}
            </span>
          </label>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Up / down</span>
            <input
              type="range"
              min={-MIRROR_BUNDLE_STACK_LIMITS.translateMax}
              max={MIRROR_BUNDLE_STACK_LIMITS.translateMax}
              step={1}
              value={mirrorBundleStackLive.y}
              onChange={(e) => patchMirrorBundleStack({ y: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">{mirrorBundleStackLive.y}px</span>
          </label>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Left / right</span>
            <input
              type="range"
              min={-MIRROR_BUNDLE_STACK_LIMITS.translateMax}
              max={MIRROR_BUNDLE_STACK_LIMITS.translateMax}
              step={1}
              value={mirrorBundleStackLive.x}
              onChange={(e) => patchMirrorBundleStack({ x: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">{mirrorBundleStackLive.x}px</span>
          </label>
          <button
            type="button"
            className="interaction-mode-title-transform-reset"
            onClick={() => {
              const next = {
                scale: MIRROR_BUNDLE_STACK_DEFAULT.scale,
                x: MIRROR_BUNDLE_STACK_DEFAULT.x,
                y: MIRROR_BUNDLE_STACK_DEFAULT.y,
              };
              setMirrorBundleStackLive(next);
              persistMirrorBundleStack(next);
            }}
          >
            Reset
          </button>
        </div>
      )}

      {mirrorSmartUiTransformControls && (
        <div className="interaction-mode-title-transform-panel" aria-label="Smart TV UI position">
          <p className="interaction-mode-title-transform-panel-title">Smart TV UI</p>
          <p className="interaction-mode-title-transform-panel-hint">
            Icons / trending row — extra nudge on top of the main mirror stack
          </p>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Size</span>
            <input
              type="range"
              min={MIRROR_SMART_UI_TRANSFORM_LIMITS.scaleMin}
              max={MIRROR_SMART_UI_TRANSFORM_LIMITS.scaleMax}
              step={0.01}
              value={smartUiTransform.scale}
              onChange={(e) => patchSmartUiTransform({ scale: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">
              {smartUiTransform.scale.toFixed(2)}
            </span>
          </label>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Up / down</span>
            <input
              type="range"
              min={-MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax}
              max={MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax}
              step={1}
              value={smartUiTransform.y}
              onChange={(e) => patchSmartUiTransform({ y: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">{smartUiTransform.y}px</span>
          </label>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Left / right</span>
            <input
              type="range"
              min={-MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax}
              max={MIRROR_SMART_UI_TRANSFORM_LIMITS.translateMax}
              step={1}
              value={smartUiTransform.x}
              onChange={(e) => patchSmartUiTransform({ x: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">{smartUiTransform.x}px</span>
          </label>
          <button
            type="button"
            className="interaction-mode-title-transform-reset"
            onClick={() => {
              const next = {
                scale: MIRROR_SMART_UI_TRANSFORM_DEFAULT.scale,
                x: MIRROR_SMART_UI_TRANSFORM_DEFAULT.x,
                y: MIRROR_SMART_UI_TRANSFORM_DEFAULT.y,
              };
              setSmartUiTransform(next);
              persistSmartUiTransform(next);
            }}
          >
            Reset
          </button>
        </div>
      )}

      {mirrorModeTitleTransformControls && (
        <div
          className="interaction-mode-title-transform-panel interaction-mode-title-stack-panel"
          aria-label="Mode title position"
        >
          <p className="interaction-mode-title-transform-panel-title">Mode titles</p>
          <p className="interaction-mode-title-transform-panel-hint">
            Smart TV · Movie Mode · Mirror Mode — labels only
          </p>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Size</span>
            <input
              type="range"
              min={MIRROR_MODE_TITLE_STACK_LIMITS.scaleMin}
              max={MIRROR_MODE_TITLE_STACK_LIMITS.scaleMax}
              step={0.01}
              value={modeTitleStackTransform.scale}
              onChange={(e) => patchModeTitleStackTransform({ scale: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">
              {modeTitleStackTransform.scale.toFixed(2)}
            </span>
          </label>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Up / down</span>
            <input
              type="range"
              min={-MIRROR_MODE_TITLE_STACK_LIMITS.translateMax}
              max={MIRROR_MODE_TITLE_STACK_LIMITS.translateMax}
              step={1}
              value={modeTitleStackTransform.y}
              onChange={(e) => patchModeTitleStackTransform({ y: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">{modeTitleStackTransform.y}px</span>
          </label>
          <label className="interaction-mode-title-transform-row">
            <span className="interaction-mode-title-transform-label">Left / right</span>
            <input
              type="range"
              min={-MIRROR_MODE_TITLE_STACK_LIMITS.translateMax}
              max={MIRROR_MODE_TITLE_STACK_LIMITS.translateMax}
              step={1}
              value={modeTitleStackTransform.x}
              onChange={(e) => patchModeTitleStackTransform({ x: Number(e.target.value) })}
            />
            <span className="interaction-mode-title-transform-value">{modeTitleStackTransform.x}px</span>
          </label>
          <button
            type="button"
            className="interaction-mode-title-transform-reset"
            onClick={() => {
              const next = {
                scale: MIRROR_MODE_TITLE_STACK_DEFAULT.scale,
                x: MIRROR_MODE_TITLE_STACK_DEFAULT.x,
                y: MIRROR_MODE_TITLE_STACK_DEFAULT.y,
              };
              setModeTitleStackTransform(next);
              persistModeTitleStackTransform(next);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </section>
  );
}
