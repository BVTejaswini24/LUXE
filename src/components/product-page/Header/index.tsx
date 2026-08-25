"use client";

import React, { useState } from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCartSection from "./AddToCartSection";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { toggleWishlist, selectIsInWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";

const Header = ({ data }: { data: Product }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    data.sizes?.[2]?.name ?? "Large"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    data.colors?.[0]?.name ?? "Brown"
  );

  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector(selectIsInWishlist(String(data.id)));

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(String(data.id)));
    toast(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1
              className={cn([
                integralCF.className,
                "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
              ])}
            >
              {data.title}
            </h1>
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={isInWishlist ? `Remove ${data.title} from wishlist` : `Add ${data.title} to wishlist`}
              className={cn(
                "mt-1 p-2 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shrink-0",
                isInWishlist ? "text-red-500" : "text-black/40 hover:text-black/60"
              )}
            >
              <Heart
                size={24}
                className={cn(isInWishlist && "fill-red-500")}
              />
            </button>
          </div>
          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {data.rating.toFixed(1)}
              <span className="text-black/60">/5</span>
            </span>
          </div>
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
            {data.discount.percentage > 0 ? (
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                {`$${Math.round(
                  data.price - (data.price * data.discount.percentage) / 100
                )}`}
              </span>
            ) : data.discount.amount > 0 ? (
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                {`$${data.price - data.discount.amount}`}
              </span>
            ) : (
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                ${data.price}
              </span>
            )}
            {data.discount.percentage > 0 && (
              <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                ${data.price}
              </span>
            )}
            {data.discount.amount > 0 && (
              <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                ${data.price}
              </span>
            )}
            {data.discount.percentage > 0 ? (
              <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                {`-${data.discount.percentage}%`}
              </span>
            ) : (
              data.discount.amount > 0 && (
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  {`-$${data.discount.amount}`}
                </span>
              )
            )}
          </div>
          <p className="text-sm sm:text-base text-black/60 mb-5">
            {data.description}
          </p>
          <hr className="h-[1px] border-t-black/10 mb-5" />
          <ColorSelection
            colors={data.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
          <hr className="h-[1px] border-t-black/10 my-5" />
          <SizeSelection
            sizes={data.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
          <AddToCartSection
            data={data}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
