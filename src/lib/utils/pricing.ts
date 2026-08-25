import { DeliveryMethod, DELIVERY_OPTIONS } from "@/components/checkout-page/checkout.types";

type CalculateOrderTotalParams = {
  adjustedTotal: number;
  signupApplied: boolean;
  promoCode: string | null;
  promoDiscountPercent: number;
  delivery: DeliveryMethod;
};

type OrderTotalResult = {
  subtotal: number;
  productDiscount: number;
  signupDiscount: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
};

export const calculateOrderTotal = ({
  adjustedTotal,
  signupApplied,
  promoCode,
  promoDiscountPercent,
  delivery,
}: CalculateOrderTotalParams): OrderTotalResult => {
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery);
  const deliveryFee = deliveryOption?.price ?? 0;

  const maxDiscountPercent = 30;

  const rawSignupDiscount = signupApplied ? Math.round(adjustedTotal * 0.2) : 0;
  const rawPromoDiscount = promoCode
    ? Math.round((adjustedTotal * promoDiscountPercent) / 100)
    : 0;

  const rawCombinedDiscount = rawSignupDiscount + rawPromoDiscount;
  const maxDiscountAmount = Math.round(
    (adjustedTotal * maxDiscountPercent) / 100
  );

  let signupDiscount: number;
  let promoDiscount: number;

  if (rawCombinedDiscount <= maxDiscountAmount) {
    signupDiscount = rawSignupDiscount;
    promoDiscount = rawPromoDiscount;
  } else if (adjustedTotal === 0) {
    signupDiscount = 0;
    promoDiscount = 0;
  } else {
    const scale = maxDiscountAmount / rawCombinedDiscount;
    signupDiscount = Math.round(rawSignupDiscount * scale);
    promoDiscount = Math.round(rawPromoDiscount * scale);
  }

  const total = Math.max(
    0,
    Math.round(adjustedTotal - signupDiscount - promoDiscount + deliveryFee)
  );

  return {
    subtotal: adjustedTotal,
    productDiscount: 0,
    signupDiscount,
    promoDiscount,
    deliveryFee,
    total,
  };
};
