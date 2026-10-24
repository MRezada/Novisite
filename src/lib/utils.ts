/** عدد پایدار از روی یک رشته (برای ساخت نمودار پیش‌نمایش محصول) */
export function seeded(seed: string, count: number): number[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: count }, () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return 28 + (h % 68);
  });
}
