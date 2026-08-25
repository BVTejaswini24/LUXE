import { Product } from "@/types/product.types";

export type SortOption =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating-desc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
];

export const ITEMS_PER_PAGE = 12;

export type ShopFilters = {
  search: string;
  category: string[];
  gender: string[];
  style: string[];
  size: string[];
  color: string[];
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
  page: number;
};

export function getFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): ShopFilters {
  const getArray = (key: string): string[] => {
    const val = searchParams[key];
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const page = Number(searchParams.page) || 1;

  return {
    search: typeof searchParams.search === "string" ? searchParams.search : "",
    category: getArray("category"),
    gender: getArray("gender"),
    style: getArray("style"),
    size: getArray("size"),
    color: getArray("color"),
    minPrice:
      typeof searchParams.minPrice === "string"
        ? Number(searchParams.minPrice) || 0
        : 0,
    maxPrice:
      typeof searchParams.maxPrice === "string"
        ? Number(searchParams.maxPrice) || 0
        : 0,
    sort:
      typeof searchParams.sort === "string"
        ? (searchParams.sort as SortOption)
        : "recommended",
    page: Math.max(1, page),
  };
}

function getEffectivePrice(product: Product): number {
  if (product.discount.percentage > 0) {
    return Math.round(
      product.price - (product.price * product.discount.percentage) / 100
    );
  }
  if (product.discount.amount > 0) {
    return product.price - product.discount.amount;
  }
  return product.price;
}

function matchesSearch(product: Product, search: string): boolean {
  if (!search) return true;
  const q = search.toLowerCase();
  const searchable = [
    product.title,
    product.description,
    product.brand,
    product.category,
    product.style,
    product.subcategory,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return searchable.includes(q);
}

function matchesCategory(product: Product, categories: string[]): boolean {
  if (categories.length === 0) return true;
  return categories.includes(product.category);
}

function matchesGender(product: Product, genders: string[]): boolean {
  if (genders.length === 0) return true;
  return genders.includes(product.gender || "unisex");
}

function matchesStyle(product: Product, styles: string[]): boolean {
  if (styles.length === 0) return true;
  return styles.includes((product.style || "").toLowerCase());
}

function matchesSize(product: Product, sizes: string[]): boolean {
  if (sizes.length === 0) return true;
  if (!product.sizes || product.sizes.length === 0) return false;
  return sizes.some((s) =>
    product.sizes!.some(
      (ps) =>
        ps.name.toLowerCase() === s.toLowerCase() ||
        ps.label.toLowerCase() === s.toLowerCase()
    )
  );
}

function matchesColor(product: Product, colors: string[]): boolean {
  if (colors.length === 0) return true;
  if (!product.colors || product.colors.length === 0) return false;
  return colors.some((c) =>
    product.colors!.some(
      (pc) =>
        pc.name.toLowerCase() === c.toLowerCase() ||
        pc.id.toLowerCase() === c.toLowerCase()
    )
  );
}

function matchesPrice(
  product: Product,
  minPrice: number,
  maxPrice: number
): boolean {
  const effectivePrice = getEffectivePrice(product);
  if (minPrice > 0 && effectivePrice < minPrice) return false;
  if (maxPrice > 0 && effectivePrice > maxPrice) return false;
  return true;
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case "price-asc":
      return sorted.sort(
        (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
      );
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "recommended":
    default:
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.rating - a.rating;
      });
  }
}

export function filterProducts(
  allProducts: Product[],
  filters: ShopFilters
): { products: Product[]; totalCount: number } {
  const filtered = allProducts.filter(
    (product) =>
      matchesSearch(product, filters.search) &&
      matchesCategory(product, filters.category) &&
      matchesGender(product, filters.gender) &&
      matchesStyle(product, filters.style) &&
      matchesSize(product, filters.size) &&
      matchesColor(product, filters.color) &&
      matchesPrice(product, filters.minPrice, filters.maxPrice)
  );

  const sorted = sortProducts(filtered, filters.sort);
  const totalCount = sorted.length;

  const start = (filters.page - 1) * ITEMS_PER_PAGE;
  const paginated = sorted.slice(start, start + ITEMS_PER_PAGE);

  return { products: paginated, totalCount };
}

export function getSearchParamsString(
  filters: ShopFilters,
  overrides?: Partial<ShopFilters>
): string {
  const f = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (f.search) params.set("search", f.search);
  f.category.forEach((c) => params.append("category", c));
  f.gender.forEach((g) => params.append("gender", g));
  f.style.forEach((s) => params.append("style", s));
  f.size.forEach((s) => params.append("size", s));
  f.color.forEach((c) => params.append("color", c));
  if (f.minPrice > 0) params.set("minPrice", String(f.minPrice));
  if (f.maxPrice > 0) params.set("maxPrice", String(f.maxPrice));
  if (f.sort !== "recommended") params.set("sort", f.sort);
  if (f.page > 1) params.set("page", String(f.page));

  return params.toString();
}

export function getEffectivePriceLabel(product: Product): string {
  return `$${getEffectivePrice(product)}`;
}

export function getAvailableColors(): { id: string; name: string; hex: string }[] {
  return [
    { id: "green", name: "Green", hex: "#16a34a" },
    { id: "red", name: "Red", hex: "#dc2626" },
    { id: "yellow", name: "Yellow", hex: "#facc15" },
    { id: "orange", name: "Orange", hex: "#ea580c" },
    { id: "cyan", name: "Cyan", hex: "#22d3ee" },
    { id: "blue", name: "Blue", hex: "#2563eb" },
    { id: "purple", name: "Purple", hex: "#9333ea" },
    { id: "pink", name: "Pink", hex: "#ec4899" },
    { id: "white", name: "White", hex: "#ffffff" },
    { id: "black", name: "Black", hex: "#000000" },
  ];
}
