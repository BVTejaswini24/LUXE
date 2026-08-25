"use client";

import React from "react";
import Image from "next/image";
import { CartItem } from "@/lib/features/carts/cartsSlice";
import { DeliveryMethod } from "./checkout.types";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks/redux";
import {
  selectSignupApplied,
  selectPromoCode,
  selectPromoDiscountPercent,
} from "@/lib/features/discount/discountSlice";
import { Tag } from "lucide-react";
import { calculateOrderTotal } from "@/lib/utils/pricing";

type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  adjustedTotal: number;
  delivery: DeliveryMethod;
};

const OrderSummary = ({
  items,
  subtotal,
  adjustedTotal,
  delivery,
}: OrderSummaryProps) => {
  const signupApplied = useAppSelector(selectSignupApplied);
  const promoCode = useAppSelector(selectPromoCode);
  const promoDiscountPercent = useAppSelector(selectPromoDiscountPercent);

  const { signupDiscount, promoDiscount, deliveryFee, total } =
    calculateOrderTotal({
      adjustedTotal,
      signupApplied,
      promoCode,
      promoDiscountPercent,
      delivery,
    });

  const productDiscount = Math.round(subtotal - adjustedTotal);

  return (
    <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6 space-y-5 sticky top-24">
      <h3 className="text-xl font-bold text-black">Order Summary</h3>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {items.map((item) => {
          const effectivePrice =
            item.discount.percentage > 0
              ? Math.round(
                  item.price - (item.price * item.discount.percentage) / 100
                )
              : item.discount.amount > 0
                ? item.price - item.discount.amount
                : item.price;

          return (
            <div key={`${item.id}-${item.attributes.join("-")}`} className="flex gap-3">
              <div className="relative bg-[#F0EEED] rounded-lg w-16 h-16 min-w-[64px] overflow-hidden">
                <Image
                  src={item.srcUrl}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">
                  {item.name}
                </p>
                <p className="text-xs text-black/60">
                  {item.attributes[0]} / {item.attributes[1]}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-black">
                    ${effectivePrice * item.quantity}
                  </span>
                  {(item.discount.percentage > 0 || item.discount.amount > 0) && (
                    <span className="text-xs text-black/40 line-through">
                      ${item.price * item.quantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-black/10 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black/60">Subtotal</span>
          <span className="text-sm font-bold text-black">${subtotal}</span>
        </div>

        {productDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60">Product Discount</span>
            <span className="text-sm font-bold text-red-600">
              -${productDiscount}
            </span>
          </div>
        )}

        {signupApplied && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60 flex items-center gap-1">
              <Tag size={12} />
              20% Sign-up Discount
            </span>
            <span className="text-sm font-bold text-red-600">
              -${signupDiscount}
            </span>
          </div>
        )}

        {promoCode && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60 flex items-center gap-1">
              <Tag size={12} />
              Promo Code ({promoCode})
            </span>
            <span className="text-sm font-bold text-red-600">
              -${promoDiscount}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-black/60">Delivery</span>
          <span className={cn("text-sm font-bold", deliveryFee === 0 ? "text-green-600" : "text-black")}>
            {deliveryFee === 0 ? "Free" : `$${deliveryFee}`}
          </span>
        </div>

        <div className="border-t border-black/10 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-xl font-bold text-black">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
