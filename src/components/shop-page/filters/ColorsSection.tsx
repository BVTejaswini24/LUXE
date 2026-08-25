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

type ColorsSectionProps = {
  filters: ShopFilters;
  onUpdate: (overrides: Partial<ShopFilters>) => void;
};

const colorOptions = [
  { id: "green", hex: "#16a34a" },
  { id: "red", hex: "#dc2626" },
  { id: "yellow", hex: "#facc15" },
  { id: "orange", hex: "#ea580c" },
  { id: "cyan", hex: "#22d3ee" },
  { id: "blue", hex: "#2563eb" },
  { id: "purple", hex: "#9333ea" },
  { id: "pink", hex: "#ec4899" },
  { id: "white", hex: "#ffffff" },
  { id: "black", hex: "#000000" },
];

const ColorsSection = ({ filters, onUpdate }: ColorsSectionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="filter-colors">
      <AccordionItem value="filter-colors" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Colors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
            {colorOptions.map((color) => {
              const isSelected = filters.color.includes(color.id);
              return (
                <button
                  key={color.id}
                  type="button"
                  className={cn([
                    "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
                    isSelected && "ring-2 ring-black ring-offset-2",
                  ])}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    if (isSelected) {
                      onUpdate({
                        color: filters.color.filter((c) => c !== color.id),
                      });
                    } else {
                      onUpdate({
                        color: [...filters.color, color.id],
                      });
                    }
                  }}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={color.id === "white" ? "#000" : "#fff"}
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ColorsSection;
