"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { selectWishlistCount } from "@/lib/features/wishlist/wishlistSlice";
import { Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WishlistBtn = () => {
  const count = useAppSelector(selectWishlistCount);

  return (
    <Link href="/wishlist" className="relative p-1">
      <Heart size={22} className={cn("max-w-[22px] max-h-[22px]", count > 0 ? "fill-black text-black" : "text-black")} />
      {count > 0 && (
        <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
          {count}
        </span>
      )}
    </Link>
  );
};

export default WishlistBtn;
