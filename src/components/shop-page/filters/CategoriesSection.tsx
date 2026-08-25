"use client";

import React from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { cn } from "@/lib/utils";
import type { ShopFilters } from "@/lib/utils/productFilters";

type CategoriesSectionProps = {
  filters: ShopFilters;
  onUpdate: (overrides: Partial<ShopFilters>) => void;
};

const categoryMap: { title: string; slug: string }[] = [
  { title: "T-Shirts", slug: "t-shirts" },
  { title: "Shirts", slug: "shirts" },
  { title: "Jeans", slug: "jeans" },
  { title: "Pants", slug: "pants" },
  { title: "Shorts", slug: "shorts" },
  { title: "Hoodies", slug: "hoodies" },
  { title: "Jackets", slug: "jackets" },
  { title: "Accessories", slug: "accessories" },
];

const CategoriesSection = ({ filters, onUpdate }: CategoriesSectionProps) => {
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoryMap.map((category) => {
        const isActive = filters.category.includes(category.slug);
        return (
          <button
            key={category.slug}
            type="button"
            className={cn(
              "flex items-center justify-between py-2 w-full text-left",
              isActive && "text-black font-medium"
            )}
            onClick={() => {
              if (isActive) {
                onUpdate({
                  category: filters.category.filter((c) => c !== category.slug),
                });
              } else {
                onUpdate({
                  category: [...filters.category, category.slug],
                });
              }
            }}
          >
            {category.title} <MdKeyboardArrowRight />
          </button>
        );
      })}
    </div>
  );
};

export default CategoriesSection;
