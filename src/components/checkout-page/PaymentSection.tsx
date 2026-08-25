"use client";

import React from "react";
import { PaymentMethod, CardInfo, UpiInfo, CheckoutErrors } from "./checkout.types";
import { cn } from "@/lib/utils";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

type PaymentSectionProps = {
  method: PaymentMethod;
  card: CardInfo;
  upi: UpiInfo;
  errors: CheckoutErrors;
  onMethodChange: (method: PaymentMethod) => void;
  onCardChange: (field: string, value: string) => void;
  onUpiChange: (field: string, value: string) => void;
};

const PaymentSection = ({
  method,
  card,
  upi,
  errors,
  onMethodChange,
  onCardChange,
  onUpiChange,
}: PaymentSectionProps) => {
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) {
      return v.slice(0, 2) + "/" + v.slice(2);
    }
    return v;
  };

  const paymentMethods = [
    { id: "card" as PaymentMethod, label: "Credit/Debit Card", icon: CreditCard },
    { id: "upi" as PaymentMethod, label: "UPI", icon: Smartphone },
    { id: "cod" as PaymentMethod, label: "Cash on Delivery", icon: Banknote },
  ];

  return (
    <section aria-labelledby="payment-heading">
      <h3 id="payment-heading" className="text-lg font-bold text-black mb-4">
        Payment
      </h3>

      <div className="space-y-3 mb-6">
        {paymentMethods.map((pm) => (
          <label
            key={pm.id}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
              method === pm.id
                ? "border-black bg-black/5"
                : "border-black/10 hover:border-black/30"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                method === pm.id ? "border-black" : "border-black/30"
              )}
            >
              {method === pm.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
              )}
            </div>
            <input
              type="radio"
              name="payment"
              value={pm.id}
              checked={method === pm.id}
              onChange={() => onMethodChange(pm.id)}
              className="sr-only"
              aria-label={pm.label}
            />
            <pm.icon size={18} className="text-black/60" />
            <span className="text-sm font-medium text-black">{pm.label}</span>
          </label>
        ))}
      </div>

      {method === "card" && (
        <div className="space-y-4 p-4 rounded-lg border border-black/10">
          <div>
            <label
              htmlFor="cardHolder"
              className="block text-sm font-medium text-black mb-1.5"
            >
              Cardholder Name <span className="text-red-500">*</span>
            </label>
            <input
              id="cardHolder"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.card.holderName}
              aria-describedby={
                errors.card.holderName ? "cardHolder-error" : undefined
              }
              value={card.holderName}
              onChange={(e) => onCardChange("holderName", e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
            />
            {errors.card.holderName && (
              <p
                id="cardHolder-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.card.holderName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-black mb-1.5"
            >
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              id="cardNumber"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.card.number}
              aria-describedby={
                errors.card.number ? "cardNumber-error" : undefined
              }
              value={card.number}
              onChange={(e) =>
                onCardChange("number", formatCardNumber(e.target.value))
              }
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all tracking-wider"
            />
            {errors.card.number && (
              <p
                id="cardNumber-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.card.number}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cardExpiry"
                className="block text-sm font-medium text-black mb-1.5"
              >
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                id="cardExpiry"
                type="text"
                required
                aria-required="true"
                aria-invalid={!!errors.card.expiry}
                aria-describedby={
                  errors.card.expiry ? "cardExpiry-error" : undefined
                }
                value={card.expiry}
                onChange={(e) =>
                  onCardChange("expiry", formatExpiry(e.target.value))
                }
                placeholder="MM/YY"
                maxLength={5}
                className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
              />
              {errors.card.expiry && (
                <p
                  id="cardExpiry-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.card.expiry}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="cardCvv"
                className="block text-sm font-medium text-black mb-1.5"
              >
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                id="cardCvv"
                type="password"
                required
                aria-required="true"
                aria-invalid={!!errors.card.cvv}
                aria-describedby={
                  errors.card.cvv ? "cardCvv-error" : undefined
                }
                value={card.cvv}
                onChange={(e) =>
                  onCardChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="***"
                maxLength={4}
                className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
              />
              {errors.card.cvv && (
                <p
                  id="cardCvv-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.card.cvv}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-black/40 flex items-center gap-1">
            <CreditCard size={12} />
            This is a demo checkout. No real payment will be processed.
          </p>
        </div>
      )}

      {method === "upi" && (
        <div className="space-y-4 p-4 rounded-lg border border-black/10">
          <div>
            <label
              htmlFor="upiId"
              className="block text-sm font-medium text-black mb-1.5"
            >
              UPI ID <span className="text-red-500">*</span>
            </label>
            <input
              id="upiId"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.upi.upiId}
              aria-describedby={
                errors.upi.upiId ? "upiId-error" : undefined
              }
              value={upi.upiId}
              onChange={(e) => onUpiChange("upiId", e.target.value)}
              placeholder="yourname@upi"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
            />
            {errors.upi.upiId && (
              <p
                id="upiId-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.upi.upiId}
              </p>
            )}
          </div>
          <p className="text-xs text-black/40 flex items-center gap-1">
            <Smartphone size={12} />
            This is a demo checkout. No real payment will be processed.
          </p>
        </div>
      )}

      {method === "cod" && (
        <div className="p-4 rounded-lg border border-black/10">
          <p className="text-sm text-black/60">
            Pay with cash when your order is delivered. Please keep the exact
            amount ready.
          </p>
        </div>
      )}
    </section>
  );
};

export default PaymentSection;
