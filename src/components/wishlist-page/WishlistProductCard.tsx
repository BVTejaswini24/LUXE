"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { Heart, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { removeFromWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { addToCart, CartItem } from "@/lib/features/carts/cartsSlice";
import { RootState } from "@/lib/store";
import { compareArrays } from "@/lib/utils";
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
  const cart = useAppSelector((state: RootState) => state.carts.cart);
  const isOutOfStock = data.stock !== undefined && data.stock <= 0;

  const [variantSheetOpen, setVariantSheetOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

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

  const dispatchAddToCart = (
    size: string,
    color: string,
    quantity: number
  ) => {
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
        quantity,
        stock: data.stock,
      })
    );
  };

  const confirmAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);

    const size = hasSizes ? selectedSize : "Default";
    const color = hasColors ? selectedColor : "Default";

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      setIsAdding(false);
      return;
    }

    if (hasColors && !selectedColor) {
      toast.error("Please select a color before adding to cart.");
      setIsAdding(false);
      return;
    }

    const stock = data.stock;
    if (typeof stock === "number" && stock <= 0) {
      toast.error("This product is out of stock.");
      setIsAdding(false);
      return;
    }

    const attributes = [size, color];
    const existingItem = cart?.items.find(
      (item: CartItem) =>
        item.id === data.id && compareArrays(attributes, item.attributes)
    );

    const currentQty = existingItem?.quantity ?? 0;
    const requestedQty = 1;

    if (typeof stock === "number" && currentQty + requestedQty > stock) {
      const remaining = stock - currentQty;
      if (remaining <= 0) {
        toast.error(
          `You already have the maximum available quantity (${stock}) in your cart.`
        );
        setIsAdding(false);
        return;
      }
      toast.error(`Only ${remaining} more available. Adding ${remaining} instead.`);
      dispatchAddToCart(size, color, remaining);
      setVariantSheetOpen(false);
      toast.success(`${data.title} added to cart!`);
      setIsAdding(false);
      return;
    }

    dispatchAddToCart(size, color, requestedQty);
    setVariantSheetOpen(false);
    toast.success(`${data.title} added to cart!`);
    setIsAdding(false);
  };

  const handleAddToCart = () => {
    if (isAdding) return;
    if (isOutOfStock) return;
    setIsAdding(true);

    const stock = data.stock;
    if (typeof stock === "number" && stock <= 0) {
      toast.error("This product is out of stock.");
      setIsAdding(false);
      return;
    }

    if (requiresSelection) {
      setIsAdding(false);
      openVariantSheet();
      return;
    }

    const attributes = ["Default", "Default"];
    const existingItem = cart?.items.find(
      (item: CartItem) =>
        item.id === data.id && compareArrays(attributes, item.attributes)
    );

    const currentQty = existingItem?.quantity ?? 0;
    const requestedQty = 1;

    if (typeof stock === "number" && currentQty + requestedQty > stock) {
      const remaining = stock - currentQty;
      if (remaining <= 0) {
        toast.error(
          `You already have the maximum available quantity (${stock}) in your cart.`
        );
        setIsAdding(false);
        return;
      }
      toast.error(`Only ${remaining} more available. Adding ${remaining} instead.`);
      dispatchAddToCart("Default", "Default", remaining);
      toast.success(`${data.title} added to cart!`);
      setIsAdding(false);
      return;
    }

    dispatchAddToCart("Default", "Default", requestedQty);
    toast.success(`${data.title} added to cart!`);
    setIsAdding(false);
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
        ) : typeof data.stock === "number" && data.stock > 0 && data.stock <= 5 ? (
          <span className="text-sm text-orange-500 font-medium mb-2">Only {data.stock} left</span>
        ) : null}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          aria-label={isOutOfStock ? `${data.title} is out of stock` : `Add ${data.title} to cart`}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-sm font-medium transition-all",
            isOutOfStock
              ? "bg-black/10 text-black/40 cursor-not-allowed"
              : "bg-black text-white hover:bg-black/80"
          )}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
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
              disabled={!hasSelections || isAdding}
              className={cn(
                "w-full rounded-full py-3 text-sm font-medium transition-all",
                hasSelections && !isAdding
                  ? "bg-black text-white hover:bg-black/80"
                  : "bg-black/10 text-black/40 cursor-not-allowed"
              )}
            >
              {isAdding ? "Adding..." : "Confirm & Add to Cart"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WishlistProductCard;
