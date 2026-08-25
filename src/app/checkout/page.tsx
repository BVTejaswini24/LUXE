"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Button } from "@/components/ui/button";
import BreadcrumbCheckout from "@/components/checkout-page/BreadcrumbCheckout";
import ContactSection from "@/components/checkout-page/ContactSection";
import ShippingSection from "@/components/checkout-page/ShippingSection";
import DeliverySection from "@/components/checkout-page/DeliverySection";
import PaymentSection from "@/components/checkout-page/PaymentSection";
import OrderSummary from "@/components/checkout-page/OrderSummary";
import {
  CheckoutForm,
  CheckoutErrors,
  DeliveryMethod,
  PaymentMethod,
} from "@/components/checkout-page/checkout.types";
import { validateCheckoutForm } from "@/lib/utils/checkoutValidation";
import { applySignupDiscount, selectSignupApplied, selectPromoCode, selectPromoDiscountPercent } from "@/lib/features/discount/discountSlice";
import { selectCurrentUser, selectIsAuthenticated } from "@/lib/features/auth/authSlice";
import { clearCart } from "@/lib/features/carts/cartsSlice";
import { addOrder } from "@/lib/features/orders/ordersSlice";
import { calculateOrderTotal } from "@/lib/utils/pricing";
import { TbBasketExclamation } from "react-icons/tb";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const initialForm: CheckoutForm = {
  contact: { email: "", phone: "" },
  shipping: {
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  },
  delivery: "standard",
  paymentMethod: "card",
  card: { holderName: "", number: "", expiry: "", cvv: "" },
  upi: { upiId: "" },
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );
  const signupApplied = useAppSelector(selectSignupApplied);
  const promoCode = useAppSelector(selectPromoCode);
  const promoDiscountPercent = useAppSelector(selectPromoDiscountPercent);
  const authUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const getInitialForm = useCallback((): CheckoutForm => {
    if (isAuthenticated && authUser) {
      return {
        contact: {
          email: authUser.email,
          phone: authUser.phone ?? "",
        },
        shipping: {
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          address: "",
          apartment: "",
          city: "",
          state: "",
          pinCode: "",
          country: "",
        },
        delivery: "standard",
        paymentMethod: "card",
        card: {
          holderName: `${authUser.firstName} ${authUser.lastName}`,
          number: "",
          expiry: "",
          cvv: "",
        },
        upi: { upiId: "" },
      };
    }
    return initialForm;
  }, [isAuthenticated, authUser]);

  const [form, setForm] = useState<CheckoutForm>(getInitialForm);
  const [errors, setErrors] = useState<CheckoutErrors>({
    contact: {},
    shipping: {},
    card: {},
    upi: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [savedOrderTotal, setSavedOrderTotal] = useState<number | null>(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(!signupApplied);

  const updateContact = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: undefined },
      }));
    },
    []
  );

  const updateShipping = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [field]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [field]: undefined },
      }));
    },
    []
  );

  const updateDelivery = useCallback((method: DeliveryMethod) => {
    setForm((prev) => ({ ...prev, delivery: method }));
  }, []);

  const updatePaymentMethod = useCallback((method: PaymentMethod) => {
    setForm((prev) => ({ ...prev, paymentMethod: method }));
    setErrors({ contact: {}, shipping: {}, card: {}, upi: {} });
  }, []);

  const updateCard = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        card: { ...prev.card, [field]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        card: { ...prev.card, [field]: undefined },
      }));
    },
    []
  );

  const updateUpi = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        upi: { ...prev.upi, [field]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        upi: { ...prev.upi, [field]: undefined },
      }));
    },
    []
  );

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LX-${timestamp}-${random}`;
  };

  const handlePlaceOrder = async () => {
    const { valid, errors: validationErrors } = validateCheckoutForm(form);
    setErrors(validationErrors);

    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!cart || cart.items.length === 0) return;

    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderTotals = calculateOrderTotal({
      adjustedTotal: adjustedTotalPrice,
      signupApplied,
      promoCode,
      promoDiscountPercent,
      delivery: form.delivery,
    });

    const num = generateOrderNumber();

    dispatch(
      addOrder({
        orderNumber: num,
        userId: authUser?.id ?? "guest",
        items: cart.items,
        subtotal: orderTotals.subtotal,
        signupDiscount: orderTotals.signupDiscount,
        promoDiscount: orderTotals.promoDiscount,
        promoCode,
        deliveryMethod: form.delivery,
        deliveryFee: orderTotals.deliveryFee,
        total: orderTotals.total,
        orderDate: new Date().toISOString(),
        status: "confirmed",
      })
    );

    setOrderNumber(num);
    setSavedOrderTotal(orderTotals.total);
    setOrderPlaced(true);
    dispatch(clearCart());
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplySignupDiscount = () => {
    if (!isAuthenticated) {
      router.push("/signup");
      return;
    }
    dispatch(applySignupDiscount());
    setShowSignupPrompt(false);
  };

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <BreadcrumbCheckout />
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4 text-black/40">
              Your cart is empty. Add some items before checking out.
            </span>
            <Button className="rounded-full w-48" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Order success state
  if (orderPlaced) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="flex items-center flex-col mt-16 md:mt-32 max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <FaCheck className="text-green-600 text-3xl" />
            </div>
            <h1
              className={cn([
                integralCF.className,
                "text-2xl md:text-3xl font-bold text-black mb-3",
              ])}
            >
              Order Placed Successfully!
            </h1>
            <p className="text-black/60 mb-6">
              Thank you for your purchase. This is a demo order — no real
              payment was processed.
            </p>

            <div className="w-full bg-[#F8F8F8] rounded-xl p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Order Number</span>
                <span className="text-sm font-bold text-black font-mono">
                  {orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Total Amount</span>
                <span className="text-sm font-bold text-black">
                  ${savedOrderTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Delivery</span>
                <span className="text-sm font-bold text-black">
                  {form.delivery === "express"
                    ? "Express (2-3 days)"
                    : "Standard (5-7 days)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">
                  Shipping To
                </span>
                <span className="text-sm font-bold text-black text-right">
                  {form.shipping.firstName} {form.shipping.lastName},{" "}
                  {form.shipping.city}, {form.shipping.state},{" "}
                  {form.shipping.country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/60">Payment</span>
                <span className="text-sm font-bold text-black capitalize">
                  {form.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : form.paymentMethod === "upi"
                      ? "UPI"
                      : "Credit/Debit Card"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                className="flex-1 rounded-full h-12"
                asChild
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full h-12"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main checkout form
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbCheckout />
        <h1
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          Checkout
        </h1>

        {/* Signup discount prompt */}
        {showSignupPrompt && (
          <div className="bg-black text-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Have a promo code? Sign up for 20% off your first order!
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                This discount will be applied to your entire order.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="bg-white text-black hover:bg-white/90 rounded-full text-xs h-8"
                onClick={handleApplySignupDiscount}
              >
                Apply 20% Off
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full text-xs h-8"
                onClick={() => setShowSignupPrompt(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Form */}
          <div className="flex-1 w-full space-y-8">
            <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6">
              <ContactSection
                data={form.contact}
                errors={errors.contact}
                onChange={updateContact}
              />
            </div>

            <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6">
              <ShippingSection
                data={form.shipping}
                errors={errors.shipping}
                onChange={updateShipping}
              />
            </div>

            <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6">
              <DeliverySection
                selected={form.delivery}
                onSelect={updateDelivery}
              />
            </div>

            <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6">
              <PaymentSection
                method={form.paymentMethod}
                card={form.card}
                upi={form.upi}
                errors={errors}
                onMethodChange={updatePaymentMethod}
                onCardChange={updateCard}
                onUpiChange={updateUpi}
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[420px] lg:min-w-[420px]">
            <OrderSummary
              items={cart.items}
              subtotal={totalPrice}
              adjustedTotal={adjustedTotalPrice}
              delivery={form.delivery}
            />

            <Button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="mt-4 w-full text-sm md:text-base font-medium bg-black rounded-full py-4 h-[54px] md:h-[60px] group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-black/40 mt-3">
              This is a frontend demo. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
