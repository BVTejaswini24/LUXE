"use client";

import React from "react";
import Rating from "../ui/Rating";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { toggleWishlist, selectIsInWishlist } from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector(selectIsInWishlist(String(data.id)));

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(String(data.id)));
    toast(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link
      href={`/shop/product/${data.id}/${data.slug}`}
      className="flex flex-col items-start aspect-auto group"
    >
      <div className="relative bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <Image
          src={data.srcUrl}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
          alt={data.title}
          priority
        />
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isInWishlist ? `Remove ${data.title} from wishlist` : `Add ${data.title} to wishlist`}
          className={cn(
            "absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
            isInWishlist ? "text-red-500" : "text-black/40 hover:text-black/60"
          )}
        >
          <Heart
            size={20}
            className={cn(isInWishlist && "fill-red-500")}
          />
        </button>
      </div>
      <strong className="text-black xl:text-xl">{data.title}</strong>
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
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
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
        {data.discount.percentage > 0 ? (
          <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
            {`-${data.discount.percentage}%`}
          </span>
        ) : (
          data.discount.amount > 0 && (
            <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              {`-$${data.discount.amount}`}
            </span>
          )
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
