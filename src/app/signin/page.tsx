"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  login,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSlice";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Button } from "@/components/ui/button";
import BreadcrumbAuth from "@/components/auth-page/BreadcrumbAuth";
import { toast } from "sonner";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { simpleHash } from "@/lib/utils/simpleHash";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!loginAttempted) return;
    if (isAuthenticated) {
      toast.success("Welcome back!");
      router.push("/account");
    } else {
      toast.error("Invalid email or password. Try creating an account first.");
    }
    setLoginAttempted(false);
  }, [isAuthenticated, loginAttempted, router]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    dispatch(
      login({
        email: email.trim().toLowerCase(),
        passwordHash: simpleHash(password),
      })
    );

    setIsSubmitting(false);
    setLoginAttempted(true);
  };

  const inputClass =
    "w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all";

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbAuth page="Sign In" />

        <div className="flex items-center justify-center mt-4 md:mt-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-black mx-auto mb-4 flex items-center justify-center">
                <LogIn className="text-white" size={28} />
              </div>
              <h1
                className={cn([
                  integralCF.className,
                  "text-2xl md:text-3xl font-bold text-black mb-2",
                ])}
              >
                Welcome Back
              </h1>
              <p className="text-black/60 text-sm">
                Sign in to your LUXE account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={cn(inputClass, errors.email && "border-red-500")}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-1.5"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={cn(
                      inputClass,
                      "pr-10",
                      errors.password && "border-red-500"
                    )}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full h-12 text-sm font-medium bg-black text-white hover:bg-black/90 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-xs text-center text-black/40 mt-2">
                This is a frontend demo. No real authentication is performed.
              </p>
            </form>

            <p className="text-center text-sm text-black/60 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-black hover:underline"
              >
                Sign Up
              </Link>
            </p>

            <p className="text-center text-sm text-black/60 mt-2">
              <Link href="/shop" className="font-medium text-black hover:underline">
                Continue Shopping
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
