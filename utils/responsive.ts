/**
 * responsive.ts
 * Hanya berisi FUNGSI UTILITAS responsif.
 * Semua angka/token desain disimpan di masing-masing file styles/:
 *   - styles/LoginStyles.ts
 *   - styles/RegisterStyles.ts
 *
 * Breakpoint Android yang didukung:
 *   isSmall  → ≤ 360 px lebar  (360 × 800)
 *   isMedium → 361–399 px      (390 × 844)
 *   isLarge  → ≥ 400 px        (412 × 912)
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export const SCREEN_W = W;
export const SCREEN_H = H;

// ── vw / vh ──────────────────────────────────────────────────────────────────
/** Persentase dari lebar layar (seperti CSS vw) */
export const vw = (percent: number): number => (W * percent) / 100;

/** Persentase dari tinggi layar (seperti CSS vh) */
export const vh = (percent: number): number => (H * percent) / 100;

// ── Breakpoint flags ──────────────────────────────────────────────────────────
export const isSmall  = W <= 360;
export const isMedium = W > 360 && W < 400;
export const isLarge  = W >= 400;

// ── rs() — pilih nilai berdasarkan breakpoint ─────────────────────────────────
/**
 * Mengembalikan nilai berbeda sesuai ukuran layar.
 * @param small   nilai untuk layar ≤ 360 px
 * @param medium  nilai untuk layar 361–399 px
 * @param large   nilai untuk layar ≥ 400 px
 */
export const rs = (small: number, medium: number, large: number): number => {
  if (isSmall)  return small;
  if (isMedium) return medium;
  return large;
};

// ── scaleFont() — skala font relatif terhadap basis 390 px ───────────────────
const BASE_W = 390;
/**
 * Menyesuaikan ukuran font terhadap lebar layar aktual.
 * Basis desain: 390 px.
 */
export const scaleFont = (size: number): number => {
  const scaled = size * (W / BASE_W);
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};
