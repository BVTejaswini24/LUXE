"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { products } from "@/lib/data/products";
import type { Product } from "@/types/product.types";
import { Search, X } from "lucide-react";

const DEBOUNCE_MS = 200;
const MAX_RESULTS = 8;

function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products
    .filter((p) => {
      const searchable = [
        p.title,
        p.description,
        p.brand,
        p.category,
        p.subcategory,
        p.style,
        p.gender,
        ...(p.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    })
    .slice(0, MAX_RESULTS);
}

function getEffectivePrice(product: Product): string {
  if (product.discount.percentage > 0) {
    const price = Math.round(
      product.price - (product.price * product.discount.percentage) / 100
    );
    return `$${price}`;
  }
  if (product.discount.amount > 0) {
    return `$${product.price - product.discount.amount}`;
  }
  return `$${product.price}`;
}

function formatCategory(category: string): string {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MobileSearchSheet() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => searchProducts(query), [query]);

  const totalMatchCount = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    return products.filter((p) => {
      const searchable = [
        p.title,
        p.description,
        p.brand,
        p.category,
        p.subcategory,
        p.style,
        p.gender,
        ...(p.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    }).length;
  }, [query]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      setIsOpen(false);
      setQuery("");
      if (q) {
        router.push(`/shop?search=${encodeURIComponent(q)}`);
      } else {
        router.push("/shop");
      }
    },
    [query, router]
  );

  const handleResultClick = useCallback(
    (product: Product) => {
      setIsOpen(false);
      setQuery("");
      router.push(`/shop/product/${product.id}/${product.slug}`);
    },
    [router]
  );

  const handleViewAll = useCallback(() => {
    const q = query.trim();
    setIsOpen(false);
    setQuery("");
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/shop");
    }
  }, [query, router]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {}, DEBOUNCE_MS);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden cursor-pointer">
        <button type="button" className="mr-[14px] p-1" aria-label="Search">
          <Image
            priority
            src="/icons/search-black.svg"
            height={100}
            width={100}
            alt="search"
            className="max-w-[22px] max-h-[22px]"
          />
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Search Products</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="input-group focus-within:shadow-lg pl-4 transition-all relative flex items-center w-full rounded-full overflow-hidden bg-[#F0F0F0]">
            <div className="input-group-text mr-3">
              <Image
                priority
                src="/icons/search.svg"
                height={20}
                width={20}
                alt="search"
                className="min-w-5 min-h-5"
              />
            </div>
            <input
              ref={inputRef}
              type="text"
              name="search"
              placeholder="Search for products..."
              className="input-control w-full py-3 pr-4 outline-none placeholder:font-normal placeholder:text-sm bg-transparent placeholder:text-black/40"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={handleInputChange}
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="mr-3 p-0.5 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X size={16} className="text-black/40" />
              </button>
            )}
          </div>
        </form>

        {query.trim() && (
          <div className="space-y-1">
            {results.length > 0 ? (
              <>
                <div className="space-y-1">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#F0F0F0] transition-colors"
                      onClick={() => handleResultClick(product)}
                    >
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#F0F0F0] flex-shrink-0">
                        <Image
                          src={product.srcUrl}
                          alt={product.title}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-black/50 mt-0.5">
                          {formatCategory(product.category)}
                          {product.gender && product.gender !== "unisex"
                            ? ` · ${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}'s`
                            : ""}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-black flex-shrink-0">
                        {getEffectivePrice(product)}
                      </span>
                    </button>
                  ))}
                </div>
                {totalMatchCount > MAX_RESULTS && (
                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="w-full px-3 py-2.5 text-center text-sm font-medium text-black/60 hover:text-black rounded-xl hover:bg-[#F0F0F0] transition-colors"
                  >
                    View all {totalMatchCount} results →
                  </button>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                <Search size={28} className="mx-auto text-black/20 mb-2" />
                <p className="text-sm font-medium text-black mb-0.5">
                  No results found
                </p>
                <p className="text-xs text-black/50">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
