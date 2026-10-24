/** Native image/RSS URLs need the deployment prefix; Next Link adds it itself. */
export function assetPath(value: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base || !value.startsWith("/") || value.startsWith("//") || value === base || value.startsWith(`${base}/`)) return value;
  return `${base}${value}`;
}
