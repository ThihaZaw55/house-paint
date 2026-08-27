export interface Product {
  Proid: number;
  item: string;
  unit: string;
  category: string;
  quantity: number | string;
  buyPrice: number | string;
  salePrice: number | string;
  description: string;
  createdDate: string;
  imagePath?: string;
}

export interface PaintItemOption {
  id: number;
  item: string;
}

export interface PaintUnitOption {
  id: number;
  unit: string;
}

export interface StoredImageData {
  name: string;
  dataUrl: string;
}

export const STORAGE_KEYS = {
  PRODUCTS: "products",
  PAINT_ITEMS: "paint_items",
  PAINT_UNITS: "paint_units",
} as const;