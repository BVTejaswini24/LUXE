"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { Heart, ShoppingCart } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { removeFromWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { toast } from "sonner";
import Rating from "@/components/ui/Rating";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import SizeSelection from "@/components/product-page/Header/SizeSelection";
import ColorSelection from "@/components/product-page/Header/ColorSelection";

type WishlistProductCardProps = {
  data: Product;
};

const WishlistProductCard = ({ data }: WishlistProductCardProps) => {
  const dispatch = useAppDispatch();
  const isOutOfStock = data.stock !== undefined && data.stock <= 0;

  const [variantSheetOpen, setVariantSheetOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const hasSizes = data.sizes && data.sizes.length > 0;
  const hasColors = data.colors && data.colors.length > 0;
  const requiresSelection = hasSizes || hasColors;

  const handleRemove = () => {
    dispatch(removeFromWishlist(String(data.id)));
    toast("Removed from wishlist");
  };

  const resetVariantSelection = () => {
    setSelectedSize("");
    setSelectedColor("");
  };

  const openVariantSheet = () => {
    resetVariantSelection();
    setVariantSheetOpen(true);
  };

  const confirmAddToCart = () => {
    const size = hasSizes
      ? selectedSize || data.sizes![0].name
      : "Default";
    const color = hasColors
      ? selectedColor || data.colors![0].name
      : "Default";

    dispatch(
      addToCart({
        id: data.id,
        productId: data.id,
        name: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        attributes: [size, color],
        size,
        color,
        discount: data.discount,
        quantity: 1,
      })
    );
    setVariantSheetOpen(false);
    toast("Added to cart");
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (requiresSelection) {
      openVariantSheet();
    } else {
      dispatch(
        addToCart({
          id: data.id,
          productId: data.id,
          name: data.title,
          srcUrl: data.srcUrl,
          price: data.price,
          attributes: ["Default", "Default"],
          size: "Default",
          color: "Default",
          discount: data.discount,
          quantity: 1,
        })
      );
      toast("Added to cart");
    }
  };

  const hasSelections = (!hasSizes || selectedSize) && (!hasColors || selectedColor);

  return (
    <>
      <div className="flex flex-col">
        <Link
          href={`/shop/product/${data.id}/${data.slug}`}
          className="relative bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full aspect-square mb-2.5 xl:mb-4 overflow-hidden block"
        >
          <Image
            src={data.srcUrl}
            width={295}
            height={298}
            className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
            alt={data.title}
            priority
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove();
            }}
            aria-label={`Remove ${data.title} from wishlist`}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-sm text-red-500 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <Heart size={20} className="fill-red-500" />
          </button>
        </Link>
        <Link href={`/shop/product/${data.id}/${data.slug}`}>
          <strong className="text-black xl:text-xl">{data.title}</strong>
        </Link>
        <div className="flex items-end mb-1 xl:mb-2">
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            emptyClassName="fill-gray-50"
            size={19}
            readonly
          />
          <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
            {data.rating.toFixed(1)}
            <span className="text-black/60">/5</span>
          </span>
        </div>
        <div className="flex items-center space-x-[5px] xl:space-x-2.5 mb-3">
          {data.discount.percentage > 0 ? (
            <span className="font-bold text-black text-xl xl:text-2xl">
              {`$${Math.round(
                data.price - (data.price * data.discount.percentage) / 100
              )}`}
            </span>
          ) : data.discount.amount > 0 ? (
            <span className="font-bold text-black text-xl xl:text-2xl">
              {`$${data.price - data.discount.amount}`}
            </span>
          ) : (
            <span className="font-bold text-black text-xl xl:text-2xl">
              ${data.price}
            </span>
          )}
          {data.discount.percentage > 0 && (
            <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
              ${data.price}
            </span>
          )}
          {data.discount.amount > 0 && (
            <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
              ${data.price}
            </span>
          )}
        </div>
        {isOutOfStock ? (
          <span className="text-sm text-red-500 font-medium mb-2">Out of Stock</span>
        ) : null}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? `${data.title} is out of stock` : `Add ${data.title} to cart`}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-sm font-medium transition-all",
            isOutOfStock
              ? "bg-black/10 text-black/40 cursor-not-allowed"
              : "bg-black text-white hover:bg-black/80"
          )}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      <Sheet open={variantSheetOpen} onOpenChange={setVariantSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="text-lg">Select Variants</SheetTitle>
            <SheetDescription className="text-black/60">
              Choose options for {data.title}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pb-4">
            {hasColors && (
              <>
                <ColorSelection
                  colors={data.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
                <hr className="h-[1px] border-t-black/10" />
              </>
            )}
            {hasSizes && (
              <>
                <SizeSelection
                  sizes={data.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                />
                <hr className="h-[1px] border-t-black/10" />
              </>
            )}
            <button
              type="button"
              onClick={confirmAddToCart}
              disabled={!hasSelections}
              className={cn(
                "w-full rounded-full py-3 text-sm font-medium transition-all",
                hasSelections
                  ? "bg-black text-white hover:bg-black/80"
                  : "bg-black/10 text-black/40 cursor-not-allowed"
              )}
            >
              Confirm & Add to Cart
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WishlistProductCard;
