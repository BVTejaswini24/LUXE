"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { ShopFilters } from "@/lib/utils/productFilters";

type SizeSectionProps = {
  filters: ShopFilters;
  onUpdate: (overrides: Partial<ShopFilters>) => void;
};

const sizeOptions = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
  "4K",
  "5K",
  "6K",
  "7K",
  "8K",
  "9K",
  "10K",
  "11K",
  "12K",
  "13K",
  "1Y",
  "2Y",
  "3Y",
  "4-5Y",
  "6-7Y",
  "8-9Y",
  "10-11Y",
  "12-13Y",
  "5 US",
  "6 US",
  "7 US",
  "8 US",
  "9 US",
  "10 US",
  "11 US",
];

const SizeSection = ({ filters, onUpdate }: SizeSectionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Size
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center flex-wrap">
            {sizeOptions.map((size) => {
              const isSelected = filters.size.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  className={cn([
                    "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                    isSelected && "bg-black font-medium text-white",
                  ])}
                  onClick={() => {
                    if (isSelected) {
                      onUpdate({
                        size: filters.size.filter((s) => s !== size),
                      });
                    } else {
                      onUpdate({
                        size: [...filters.size, size],
                      });
                    }
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SizeSection;
