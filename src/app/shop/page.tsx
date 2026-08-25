"use client";

import React from "react";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  filterProducts,
  getFiltersFromSearchParams,
  getSearchParamsString,
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
  type ShopFilters,
} from "@/lib/utils/productFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

function readSearchParams(
  sp: ReturnType<typeof useSearchParams>
): Record<string, string | string[] | undefined> {
  const obj: Record<string, string | string[] | undefined> = {};
  sp.forEach((value, key) => {
    const existing = obj[key];
    if (existing) {
      obj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsObj = useMemo(() => readSearchParams(searchParams), [searchParams]);

  const filters = useMemo(
    () => getFiltersFromSearchParams(paramsObj),
    [paramsObj]
  );

  const { products: displayProducts, totalCount } = useMemo(
    () => filterProducts(products, filters),
    [filters]
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const updateFilter = useCallback(
    (overrides: Partial<ShopFilters>) => {
      const newFilters = { ...filters, ...overrides, page: 1 };
      const qs = getSearchParamsString(newFilters);
      router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [filters, router]
  );

  const clearFilters = useCallback(() => {
    router.push("/shop", { scroll: false });
  }, [router]);

  const handlePageChange = useCallback(
    (page: number) => {
      const qs = getSearchParamsString(filters, { page });
      router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [filters, router]
  );

  const heading = useMemo(() => {
    if (filters.search) return `Search: "${filters.search}"`;
    if (filters.category.length === 1) {
      const name = filters.category[0]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return name;
    }
    if (filters.gender.length === 1) {
      const g = filters.gender[0];
      return `${g.charAt(0).toUpperCase() + g.slice(1)}'s Collection`;
    }
    return "All Clothing";
  }, [filters.search, filters.category, filters.gender]);

  const startItem = totalCount > 0 ? (filters.page - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(filters.page * ITEMS_PER_PAGE, totalCount);

  const hasActiveFilters =
    filters.search ||
    filters.category.length > 0 ||
    filters.gender.length > 0 ||
    filters.style.length > 0 ||
    filters.size.length > 0 ||
    filters.color.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice > 0;

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters filters={filters} onUpdate={updateFilter} onClear={clearFilters} />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">{heading}</h1>
                <MobileFilters
                  filters={filters}
                  onUpdate={updateFilter}
                  onClear={clearFilters}
                />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  {totalCount === 0
                    ? "No products"
                    : `Showing ${startItem}-${endItem} of ${totalCount} Products`}
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select
                    value={filters.sort}
                    onValueChange={(value) =>
                      updateFilter({ sort: value as ShopFilters["sort"] })
                    }
                  >
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center flex-wrap gap-2">
                {filters.category.map((c) => (
                  <button
                    key={`cat-${c}`}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    {c.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}
                    <button
                      type="button"
                      onClick={() =>
                        updateFilter({
                          category: filters.category.filter((x) => x !== c),
                        })
                      }
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                ))}
                {filters.gender.map((g) => (
                  <button
                    key={`gender-${g}`}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                    <button
                      type="button"
                      onClick={() =>
                        updateFilter({
                          gender: filters.gender.filter((x) => x !== g),
                        })
                      }
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                ))}
                {filters.size.map((s) => (
                  <button
                    key={`size-${s}`}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    Size: {s}
                    <button
                      type="button"
                      onClick={() =>
                        updateFilter({
                          size: filters.size.filter((x) => x !== s),
                        })
                      }
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                ))}
                {filters.color.map((c) => (
                  <button
                    key={`color-${c}`}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    Color: {c}
                    <button
                      type="button"
                      onClick={() =>
                        updateFilter({
                          color: filters.color.filter((x) => x !== c),
                        })
                      }
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                ))}
                {filters.style.map((s) => (
                  <button
                    key={`style-${s}`}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        updateFilter({
                          style: filters.style.filter((x) => x !== s),
                        })
                      }
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                ))}
                {(filters.minPrice > 0 || filters.maxPrice > 0) && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    ${filters.minPrice || 0} – ${filters.maxPrice || "∞"}
                    <button
                      type="button"
                      onClick={() =>
                        updateFilter({ minPrice: 0, maxPrice: 0 })
                      }
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                )}
                {filters.search && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded-full"
                  >
                    &quot;{filters.search}&quot;
                    <button
                      type="button"
                      onClick={() => updateFilter({ search: "" })}
                      className="ml-1 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-black/60 underline hover:text-black ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {displayProducts.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-2xl font-bold text-black mb-2">
                  No pieces found
                </p>
                <p className="text-black/60 text-sm sm:text-base mb-6 text-center">
                  Try adjusting your filters or search.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <>
                <hr className="border-t-black/10" />
                <Pagination className="justify-between">
                  <PaginationPrevious
                    href="#"
                    className="border border-black/10"
                    onClick={(e) => {
                      e.preventDefault();
                      if (filters.page > 1) handlePageChange(filters.page - 1);
                    }}
                  />
                  <PaginationContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (totalPages <= 5) return true;
                        if (p === 1 || p === totalPages) return true;
                        if (Math.abs(p - filters.page) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                        if (idx > 0) {
                          const prev = arr[idx - 1];
                          if (p - prev > 1) acc.push("ellipsis");
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href="#"
                              className="text-black/50 font-medium text-sm"
                              isActive={item === filters.page}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                  </PaginationContent>
                  <PaginationNext
                    href="#"
                    className="border border-black/10"
                    onClick={(e) => {
                      e.preventDefault();
                      if (filters.page < totalPages)
                        handlePageChange(filters.page + 1);
                    }}
                  />
                </Pagination>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <main className="pb-20">
          <div className="max-w-frame mx-auto px-4 xl:px-0 flex items-center justify-center h-96">
            <SpinnerLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        </main>
      }
    >
      <ShopContent />
    </React.Suspense>
  );
}
