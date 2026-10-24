import type { ProductStatus } from "./types";

export const statusLabel: Record<ProductStatus, string> = {
  live: "منتشر شده",
  beta: "نسخه بتا",
  dev: "در حال توسعه",
};
