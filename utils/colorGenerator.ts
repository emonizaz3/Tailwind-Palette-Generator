import { Palette } from '../types';

// Helper to convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const num = parseInt(c.join(''), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
}

// Helper to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

// Helper to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// Generate a full palette from a base color
// Generate a full palette from a base color
export function generatePalette(baseHex: string): Palette {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Helper for linear interpolation
  const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

  const generateShade = (targetLightness: number, sAdjust: number, hAdjust: number) => {
    // We ignore targetLightness for the new logic, but keep signature if needed.
    // Actually, let's just use the new logic directly in the return.
    return baseHex; // Placeholder
  };

  // New logic: Interpolate lightness relative to the base color
  const baseL = hsl.l;

  const getShade = (t: number, range: 'light' | 'dark') => {
    let newL;
    if (range === 'light') {
      // Interpolate from White (0.98) down to BaseL
      // t goes from 0 (near white) to 1 (near base)
      newL = lerp(0.98, baseL, t);
    } else {
      // Interpolate from BaseL down to Black (0.02)
      // t goes from 0 (near base) to 1 (near black)
      newL = lerp(baseL, 0.02, t);
    }

    // Adjust saturation and hue slightly for richness
    // Lighter shades: slightly less saturated? Or more?
    // Darker shades: usually more saturated or shifted hue.
    // For now, keep saturation mostly constant but clamp it.
    const newS = Math.min(1, Math.max(0, hsl.s));

    // Hue shift (optional, but makes it look "designed")
    // Light shades often shift slightly warmer or cooler depending on the color.
    // Let's keep it simple for now to ensure "fit".
    const newH = hsl.h;

    const newRgb = hslToRgb(newH, newS, newL);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };

  return {
    50: getShade(0.1, 'light'),
    100: getShade(0.25, 'light'),
    200: getShade(0.45, 'light'),
    300: getShade(0.65, 'light'),
    400: getShade(0.85, 'light'),
    500: baseHex,
    600: getShade(0.2, 'dark'),
    700: getShade(0.4, 'dark'),
    800: getShade(0.6, 'dark'),
    900: getShade(0.8, 'dark'),
    950: getShade(0.9, 'dark'),
  };
}

export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getContrastYIQ(hexcolor: string) {
  const rgb = hexToRgb(hexcolor);
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export type ColorScheme = 'auto' | 'complementary' | 'analogous' | 'triadic' | 'split';

export function getHarmoniousColor(baseHex: string, type: ColorScheme): string {
  if (type === 'auto') type = 'complementary';

  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  let newH = 0;

  switch (type) {
    case 'complementary': newH = (hsl.h + 180) % 360; break;
    case 'analogous': newH = (hsl.h + 30) % 360; break;
    case 'triadic': newH = (hsl.h + 120) % 360; break;
    case 'split': newH = (hsl.h + 150) % 360; break;
  }

  const newRgb = hslToRgb(newH, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}