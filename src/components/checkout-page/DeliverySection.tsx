"use client";

import React from "react";
import { DeliveryMethod, DELIVERY_OPTIONS } from "./checkout.types";
import { cn } from "@/lib/utils";
import { Truck, Zap } from "lucide-react";

type DeliverySectionProps = {
  selected: DeliveryMethod;
  onSelect: (method: DeliveryMethod) => void;
};

const DeliverySection = ({ selected, onSelect }: DeliverySectionProps) => {
  return (
    <section aria-labelledby="delivery-heading">
      <h3 id="delivery-heading" className="text-lg font-bold text-black mb-4">
        Delivery Method
      </h3>
      <div className="space-y-3">
        {DELIVERY_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
              selected === option.id
                ? "border-black bg-black/5"
                : "border-black/10 hover:border-black/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  selected === option.id ? "border-black" : "border-black/30"
                )}
              >
                {selected === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-black" />
                )}
              </div>
              <input
                type="radio"
                name="delivery"
                value={option.id}
                checked={selected === option.id}
                onChange={() => onSelect(option.id)}
                className="sr-only"
                aria-label={`${option.name} - ${option.description} - ${
                  option.price === 0 ? "Free" : `$${option.price}`
                }`}
              />
              <div className="flex items-center gap-2">
                {option.id === "standard" ? (
                  <Truck size={18} className="text-black/60" />
                ) : (
                  <Zap size={18} className="text-black/60" />
                )}
                <div>
                  <p className="text-sm font-medium text-black">
                    {option.name}
                  </p>
                  <p className="text-xs text-black/60">{option.description}</p>
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-black">
              {option.price === 0 ? "Free" : `$${option.price}`}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default DeliverySection;
