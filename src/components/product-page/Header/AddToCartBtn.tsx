"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import React from "react";
import { toast } from "sonner";

type AddToCartBtnProps = {
  data: Product & { quantity: number };
  selectedSize: string;
  selectedColor: string;
};

const AddToCartBtn = ({
  data,
  selectedSize,
  selectedColor,
}: AddToCartBtnProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (data.sizes && data.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    dispatch(
      addToCart({
        id: data.id,
        productId: data.id,
        name: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        attributes: [selectedSize, selectedColor],
        size: selectedSize,
        color: selectedColor,
        discount: data.discount,
        quantity: data.quantity,
      })
    );
    toast.success(`${data.title} added to cart!`);
  };

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
