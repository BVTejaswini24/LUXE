"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import type { ShopFilters } from "@/lib/utils/productFilters";

type PriceSectionProps = {
  filters: ShopFilters;
  onUpdate: (overrides: Partial<ShopFilters>) => void;
};

const PriceSection = ({ filters, onUpdate }: PriceSectionProps) => {
  const [localMin, setLocalMin] = useState(filters.minPrice || 0);
  const [localMax, setLocalMax] = useState(filters.maxPrice || 300);

  useEffect(() => {
    setLocalMin(filters.minPrice || 0);
    setLocalMax(filters.maxPrice || 300);
  }, [filters.minPrice, filters.maxPrice]);

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            defaultValue={[localMin, localMax]}
            value={[localMin, localMax]}
            min={0}
            max={300}
            step={5}
            label="$"
            onValueChange={(value: number[]) => {
              setLocalMin(value[0]);
              setLocalMax(value[1]);
            }}
            onValueCommit={(value: number[]) => {
              onUpdate({ minPrice: value[0], maxPrice: value[1] });
            }}
          />
          <div className="mb-3" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
