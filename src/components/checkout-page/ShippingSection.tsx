"use client";

import React from "react";
import {
  ShippingAddress,
  CheckoutErrors,
  COUNTRIES,
  INDIAN_STATES,
  US_STATES,
} from "./checkout.types";

type ShippingSectionProps = {
  data: ShippingAddress;
  errors: Partial<ShippingAddress>;
  onChange: (field: string, value: string) => void;
};

const ShippingSection = ({ data, errors, onChange }: ShippingSectionProps) => {
  const getStatesForCountry = (country: string): string[] => {
    switch (country) {
      case "India":
        return INDIAN_STATES;
      case "United States":
        return US_STATES;
      default:
        return [];
    }
  };

  const availableStates = getStatesForCountry(data.country);

  return (
    <section aria-labelledby="shipping-heading">
      <h3 id="shipping-heading" className="text-lg font-bold text-black mb-4">
        Shipping Address
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-black mb-1.5"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="John"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-black mb-1.5"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              placeholder="Doe"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-black mb-1.5"
          >
            Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="123 Main Street"
            className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
          />
          {errors.address && (
            <p id="address-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.address}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="apartment"
            className="block text-sm font-medium text-black mb-1.5"
          >
            Apartment, Suite, etc. <span className="text-black/40">(optional)</span>
          </label>
          <input
            id="apartment"
            type="text"
            value={data.apartment}
            onChange={(e) => onChange("apartment", e.target.value)}
            placeholder="Apt 4B"
            className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-black mb-1.5"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="New York"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
            />
            {errors.city && (
              <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.city}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-black mb-1.5"
            >
              State <span className="text-red-500">*</span>
            </label>
            {availableStates.length > 0 ? (
              <select
                id="state"
                required
                aria-required="true"
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? "state-error" : undefined}
                value={data.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all bg-white"
              >
                <option value="">Select state</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="state"
                type="text"
                required
                aria-required="true"
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? "state-error" : undefined}
                value={data.state}
                onChange={(e) => onChange("state", e.target.value)}
                placeholder="State"
                className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
              />
            )}
            {errors.state && (
              <p id="state-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.state}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pinCode"
              className="block text-sm font-medium text-black mb-1.5"
            >
              PIN / ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              id="pinCode"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.pinCode}
              aria-describedby={errors.pinCode ? "pinCode-error" : undefined}
              value={data.pinCode}
              onChange={(e) => onChange("pinCode", e.target.value)}
              placeholder="10001"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
            />
            {errors.pinCode && (
              <p id="pinCode-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.pinCode}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-black mb-1.5"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              required
              aria-required="true"
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "country-error" : undefined}
              value={data.country}
              onChange={(e) => {
                onChange("country", e.target.value);
                onChange("state", "");
              }}
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all bg-white"
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p id="country-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.country}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingSection;
