export type Discount = {
  amount: number;
  percentage: number;
};

export type ProductSize = {
  id: string;
  name: string;
  label: string;
};

export type ProductColor = {
  id: string;
  name: string;
  code: string;
  hex?: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorCode: string;
  price: number;
  stock: number;
  image?: string;
};

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  gender?: "men" | "women" | "kids" | "unisex";
  srcUrl: string;
  thumbnail?: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  discount: Discount;
  rating: number;
  reviewCount?: number;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  variants?: ProductVariant[];
  material?: string;
  careInstructions?: string;
  fit?: string;
  pattern?: string;
  style?: string;
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  stock?: number;
  sku?: string;
  createdAt?: string;
};
