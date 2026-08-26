"use client";

import { addToCart, CartItem } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import React from "react";
import { toast } from "sonner";
import { RootState } from "@/lib/store";
import { compareArrays } from "@/lib/utils";

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
  const cart = useAppSelector((state: RootState) => state.carts.cart);

  const handleAddToCart = () => {
    if (data.sizes && data.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    const stock = data.stock;
    if (typeof stock === "number" && stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const attributes = [selectedSize, selectedColor];
    const existingItem = cart?.items.find(
      (item: CartItem) =>
        item.id === data.id && compareArrays(attributes, item.attributes)
    );

    const currentQty = existingItem?.quantity ?? 0;
    const requestedQty = data.quantity;

    if (typeof stock === "number" && currentQty + requestedQty > stock) {
      const remaining = stock - currentQty;
      if (remaining <= 0) {
        toast.error(`You already have the maximum available quantity (${stock}) in your cart.`);
        return;
      }
      toast.error(`Only ${remaining} more available. Adding ${remaining} instead.`);
      dispatch(
        addToCart({
          id: data.id,
          productId: data.id,
          name: data.title,
          srcUrl: data.srcUrl,
          price: data.price,
          attributes,
          size: selectedSize,
          color: selectedColor,
          discount: data.discount,
          quantity: remaining,
          stock,
        })
      );
      return;
    }

    dispatch(
      addToCart({
        id: data.id,
        productId: data.id,
        name: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        attributes,
        size: selectedSize,
        color: selectedColor,
        discount: data.discount,
        quantity: requestedQty,
        stock,
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
