"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  applySignupDiscount,
  selectSignupApplied,
} from "@/lib/features/discount/discountSlice";
import { selectIsAuthenticated } from "@/lib/features/auth/authSlice";

const TopBannerClient = () => {
  const dispatch = useAppDispatch();
  const signupApplied = useAppSelector(selectSignupApplied);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || signupApplied) return null;

  return (
    <div className="bg-black text-white text-center py-2 px-2 sm:px-4 xl:px-0">
      <div className="relative max-w-frame mx-auto">
        <p className="text-xs sm:text-sm">
          Sign up and get 20% off to your first order.{" "}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => dispatch(applySignupDiscount())}
              className="underline font-medium cursor-pointer"
            >
              Apply Discount
            </button>
          ) : (
            <Link href="/signup" className="underline font-medium">
              Sign Up Now
            </Link>
          )}
        </p>
        <Button
          variant="ghost"
          className="hover:bg-transparent absolute right-0 top-1/2 -translate-y-1/2 w-fit h-fit p-1 hidden sm:flex"
          size="icon"
          type="button"
          aria-label="close banner"
          onClick={() => setDismissed(true)}
        >
          <Image
            priority
            src="/icons/times.svg"
            height={13}
            width={13}
            alt="close banner"
          />
        </Button>
      </div>
    </div>
  );
};

export default TopBannerClient;
