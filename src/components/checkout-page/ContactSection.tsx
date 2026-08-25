"use client";

import React from "react";
import { ContactInfo, CheckoutErrors } from "./checkout.types";

type ContactSectionProps = {
  data: ContactInfo;
  errors: Partial<ContactInfo>;
  onChange: (field: string, value: string) => void;
};

const ContactSection = ({ data, errors, onChange }: ContactSectionProps) => {
  return (
    <section aria-labelledby="contact-heading">
      <h3
        id="contact-heading"
        className="text-lg font-bold text-black mb-4"
      >
        Contact Information
      </h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-1.5"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-black mb-1.5"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
