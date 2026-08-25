"use client";

import { ProductSize } from "@/types/product.types";
import { cn } from "@/lib/utils";
import React from "react";

type SizeSelectionProps = {
  sizes?: ProductSize[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
};

const SizeSelection = ({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectionProps) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Choose Size
      </span>
      <div className="flex items-center flex-wrap lg:space-x-3">
        {sizes.map((size) => (
          <button
            key={size.id}
            type="button"
            className={cn([
              "bg-[#F0F0F0] flex items-center justify-center px-5 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-full m-1 lg:m-0 max-h-[46px]",
              selectedSize === size.name && "bg-black font-medium text-white",
            ])}
            onClick={() => onSelectSize(size.name)}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelection;
