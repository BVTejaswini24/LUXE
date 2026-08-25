"use client";

import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import type { ShopFilters } from "@/lib/utils/productFilters";

type FiltersProps = {
  filters: ShopFilters;
  onUpdate: (overrides: Partial<ShopFilters>) => void;
  onClear: () => void;
};

const Filters = ({ filters, onUpdate, onClear }: FiltersProps) => {
  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection filters={filters} onUpdate={onUpdate} />
      <hr className="border-t-black/10" />
      <PriceSection filters={filters} onUpdate={onUpdate} />
      <hr className="border-t-black/10" />
      <ColorsSection filters={filters} onUpdate={onUpdate} />
      <hr className="border-t-black/10" />
      <SizeSection filters={filters} onUpdate={onUpdate} />
      <hr className="border-t-black/10" />
      <DressStyleSection filters={filters} onUpdate={onUpdate} />
      <Button
        type="button"
        onClick={onClear}
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
      >
        Clear All
      </Button>
    </>
  );
};

export default Filters;
