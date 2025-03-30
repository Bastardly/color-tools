function getValidatedValue({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}) {
  return Math.min(Math.max(value, min), max);
}

// Constants
export enum EColor {
  COMPARER = 0.03928,
  DIVIDER = 12.92,
  BIAS = 0.055,
  BIAS_DIVIDER = 1.055,
  POWER = 2.4,
  R_BRIGHTNESS_FACTOR = 0.2126,
  G_BRIGHTNESS_FACTOR = 0.7152,
  B_BRIGHTNESS_FACTOR = 0.0722,
  LUMINANCE_BIAS = 0.05,
}

export interface IHSL {
  H: number;
  S: number;
  L: number;
}

export interface IHSLa extends IHSL {
  A: number;
}

export interface IRGB {
  R: number;
  G: number;
  B: number;
}
export interface IRGBa extends IRGB {
  A: number;
}

// Functions
export const channelBlendByPercentage = (
  percentage: number,
  baseChannel: number,
  mixChannel: number
): number => {
  const diff = mixChannel - baseChannel;
  return baseChannel + diff * percentage;
};

export const mixColors = (
  firstColor: IRGB,
  oppositeColor: IRGB,
  steps: number
): IRGB => {
  const percentage = 1 / steps;

  return {
    R: channelBlendByPercentage(percentage, firstColor.R, oppositeColor.R),
    G: channelBlendByPercentage(percentage, firstColor.G, oppositeColor.G),
    B: channelBlendByPercentage(percentage, firstColor.B, oppositeColor.B),
  };
};

export const getBrightnessFactor = (value: number): number => {
  const normalizedValue = value / 255;

  if (normalizedValue <= EColor.COMPARER) {
    return normalizedValue / EColor.DIVIDER;
  }

  return Math.pow(
    (normalizedValue + EColor.BIAS) / EColor.BIAS_DIVIDER,
    EColor.POWER
  );
};

export const getRGBBrightness = (R: number, G: number, B: number): number => {
  const r = getBrightnessFactor(R) * EColor.R_BRIGHTNESS_FACTOR;
  const g = getBrightnessFactor(G) * EColor.G_BRIGHTNESS_FACTOR;
  const b = getBrightnessFactor(B) * EColor.B_BRIGHTNESS_FACTOR;

  return r + g + b;
};

export const getContrastRatio = (
  brightness1: number,
  brightness2: number
): number => {
  const b1 = brightness1 + EColor.LUMINANCE_BIAS;
  const b2 = brightness2 + EColor.LUMINANCE_BIAS;

  return brightness1 > brightness2 ? b1 / b2 : b2 / b1;
};

export const hexToRGBA = (
  hex: string
): { R: number; G: number; B: number; A: number } => {
  const normalizedHex = hex.replace("#", "");
  const bigint = parseInt(normalizedHex, 16);
  const R = (bigint >> 16) & 255;
  const G = (bigint >> 8) & 255;
  const B = bigint & 255;
  const A = normalizedHex.length === 8 ? (bigint & 255) / 255 : 1;

  return { R, G, B, A };
};

export const hexToHSLA = (
  hex: string
): { H: number; S: number; L: number; A: number } => {
  const { R, G, B, A } = hexToRGBA(hex);
  return rgbaToHSLA(R, G, B, A);
};

export const hslaToHex = (
  H: number,
  S: number,
  L: number,
  A: number = 1
): string => {
  const { R, G, B } = hslaToRGBA(H, S, L, A);
  const toHex = (c: number) => c.toString(16).padStart(2, "0");

  const alphaHex = A < 1 ? toHex(Math.round(A * 255)) : "";
  return `#${toHex(R)}${toHex(G)}${toHex(B)}${alphaHex}`;
};

export const rgbaToHex = (
  R: number,
  G: number,
  B: number,
  A: number = 1
): string => {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  const alphaHex = A < 1 ? toHex(Math.round(A * 255)) : "";

  return `#${toHex(R)}${toHex(G)}${toHex(B)}${alphaHex}`;
};

export const hslaToRGBA = (
  H: number,
  S: number,
  L: number,
  A: number = 1
): IRGBa => {
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - C / 2;

  let R = 0,
    G = 0,
    B = 0;
  if (H >= 0 && H < 60) {
    R = C;
    G = X;
    B = 0;
  } else if (H >= 60 && H < 120) {
    R = X;
    G = C;
    B = 0;
  } else if (H >= 120 && H < 180) {
    R = 0;
    G = C;
    B = X;
  } else if (H >= 180 && H < 240) {
    R = 0;
    G = X;
    B = C;
  } else if (H >= 240 && H < 300) {
    R = X;
    G = 0;
    B = C;
  } else if (H >= 300 && H < 360) {
    R = C;
    G = 0;
    B = X;
  }

  return {
    R: Math.round((R + m) * 255),
    G: Math.round((G + m) * 255),
    B: Math.round((B + m) * 255),
    A,
  };
};

export const rgbaToHSLA = (
  R: number,
  G: number,
  B: number,
  A: number = 1
): { H: number; S: number; L: number; A: number } => {
  const r = R / 255;
  const g = G / 255;
  const b = B / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let H = 0;
  if (delta !== 0) {
    if (max === r) {
      H = ((g - b) / delta) % 6;
    } else if (max === g) {
      H = (b - r) / delta + 2;
    } else if (max === b) {
      H = (r - g) / delta + 4;
    }
  }

  H = Math.round(H * 60);
  if (H < 0) H += 360;

  const L = (max + min) / 2;
  const S = delta === 0 ? 0 : delta / (1 - Math.abs(2 * L - 1));

  return { H, S, L, A };
};

export function getValidatedHSLAValues({ H, S, L, A }: IHSLa) {
  return {
    H: getValidatedValue({
      value: H,
      min: 0,
      max: 359,
    }),
    S: getValidatedValue({
      value: S,
      min: 0,
      max: 100,
    }),
    L: getValidatedValue({
      value: L,
      min: 0,
      max: 100,
    }),
    A: getValidatedValue({
      value: A,
      min: 0,
      max: 1,
    }),
  };
}

function getHSLaAsStringPure(HSLA: IHSLa) {
  return `hsl(${HSLA.H}deg ${HSLA.S}% ${HSLA.L}% / ${HSLA.A})`;
}

function isValidNumber(value?: unknown) {
  return typeof value === "number" && !Number.isNaN(value);
}

export function getHSLaAsString(baseHSLA: IHSLa, modifyHSLA?: Partial<IHSLa>) {
  if (!modifyHSLA) return getHSLaAsStringPure(baseHSLA);
  const HSLaRaw = {
    H: isValidNumber(modifyHSLA.H)
      ? (modifyHSLA.H + baseHSLA.H) % 360
      : baseHSLA.H,
    S: isValidNumber(modifyHSLA.S) ? modifyHSLA.S + baseHSLA.S : baseHSLA.S,
    L: isValidNumber(modifyHSLA.L) ? modifyHSLA.L + baseHSLA.L : baseHSLA.L,
    A: isValidNumber(modifyHSLA.A) ? modifyHSLA.A + baseHSLA.A : baseHSLA.A,
  };

  const HSLA = getValidatedHSLAValues(HSLaRaw);

  return `hsl(${HSLA.H}deg ${HSLA.S}% ${HSLA.L}% / ${HSLA.A})`;
}
