"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";
import { cn } from "@/lib/utils";
import type { ShopFilters } from "@/lib/utils/productFilters";

type DressStyleSectionProps = {
  filters: ShopFilters;
  onUpdate: (overrides: Partial<ShopFilters>) => void;
};

const dressStylesData: { title: string; slug: string }[] = [
  { title: "Casual", slug: "casual" },
  { title: "Formal", slug: "formal" },
  { title: "Party", slug: "party" },
  { title: "Gym", slug: "gym" },
];

const DressStyleSection = ({ filters, onUpdate }: DressStyleSectionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-0.5">
            {dressStylesData.map((dStyle) => {
              const isActive = filters.style.includes(dStyle.slug);
              return (
                <button
                  key={dStyle.slug}
                  type="button"
                  className={cn(
                    "flex items-center justify-between py-2 w-full text-left",
                    isActive && "text-black font-medium"
                  )}
                  onClick={() => {
                    if (isActive) {
                      onUpdate({
                        style: filters.style.filter((s) => s !== dStyle.slug),
                      });
                    } else {
                      onUpdate({
                        style: [...filters.style, dStyle.slug],
                      });
                    }
                  }}
                >
                  {dStyle.title} <MdKeyboardArrowRight />
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
