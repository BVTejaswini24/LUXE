"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
  updateProfile,
} from "@/lib/features/auth/authSlice";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Button } from "@/components/ui/button";
import BreadcrumbAuth from "@/components/auth-page/BreadcrumbAuth";
import { toast } from "sonner";
import {
  User,
  LogOut,
  Pencil,
  Save,
  X,
  ShoppingCart,
  Heart,
  Loader2,
  Package,
} from "lucide-react";

type FormErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSignOut = () => {
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/");
  };

  const handleSave = async () => {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (phone && !/^[+\d\s()-]{7,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    dispatch(
      updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
      })
    );

    setIsSaving(false);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setPhone(user?.phone ?? "");
    setErrors({});
    setIsEditing(false);
  };

  const inputClass =
    "w-full rounded-lg border border-black/20 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all";

  // Not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <BreadcrumbAuth page="Account" />

          <div className="flex items-center justify-center mt-4 md:mt-16">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-black/5 mx-auto mb-6 flex items-center justify-center">
                <User className="text-black/30" size={36} />
              </div>
              <h1
                className={cn([
                  integralCF.className,
                  "text-2xl md:text-3xl font-bold text-black mb-3",
                ])}
              >
                Sign In Required
              </h1>
              <p className="text-black/60 text-sm mb-8">
                Please sign in to view your account details and manage your
                profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 rounded-full h-12 bg-black text-white hover:bg-black/90"
                  asChild
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full h-12"
                  asChild
                >
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated state
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbAuth page="Account" />

        <h1
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          My Account
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card */}
          <div className="flex-1">
            <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-black">Profile Details</h2>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="edit-firstName"
                        className="block text-sm font-medium text-black mb-1.5"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="edit-firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            firstName: undefined,
                          }));
                        }}
                        className={cn(
                          inputClass,
                          errors.firstName && "border-red-500"
                        )}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="edit-lastName"
                        className="block text-sm font-medium text-black mb-1.5"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="edit-lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            lastName: undefined,
                          }));
                        }}
                        className={cn(
                          inputClass,
                          errors.lastName && "border-red-500"
                        )}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-email"
                      className="block text-sm font-medium text-black mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      value={user.email}
                      disabled
                      className={cn(inputClass, "bg-black/5 cursor-not-allowed")}
                    />
                    <p className="mt-1 text-xs text-black/40">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-phone"
                      className="block text-sm font-medium text-black mb-1.5"
                    >
                      Phone{" "}
                      <span className="text-black/40">(optional)</span>
                    </label>
                    <input
                      id="edit-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      className={cn(
                        inputClass,
                        errors.phone && "border-red-500"
                      )}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-full h-10 px-6 bg-black text-white hover:bg-black/90 gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Save size={14} />
                      )}
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="rounded-full h-10 px-6 gap-2"
                    >
                      <X size={14} />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-black/50 mb-1">First Name</p>
                      <p className="text-sm font-medium text-black">
                        {user.firstName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-black/50 mb-1">Last Name</p>
                      <p className="text-sm font-medium text-black">
                        {user.lastName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Email</p>
                    <p className="text-sm font-medium text-black">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Phone</p>
                    <p className="text-sm font-medium text-black">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">
                      Member Since
                    </p>
                    <p className="text-sm font-medium text-black">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-[360px]">
            <div className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-bold text-black">Quick Links</h2>

              <Link
                href="/shop"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors"
              >
                <ShoppingCart size={18} className="text-black/60" />
                <span className="text-sm font-medium text-black">
                  Continue Shopping
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors"
              >
                <Heart size={18} className="text-black/60" />
                <span className="text-sm font-medium text-black">
                  My Wishlist
                </span>
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors"
              >
                <ShoppingCart size={18} className="text-black/60" />
                <span className="text-sm font-medium text-black">
                  View Cart
                </span>
              </Link>

              <Link
                href="/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors"
              >
                <Package size={18} className="text-black/60" />
                <span className="text-sm font-medium text-black">
                  My Orders
                </span>
              </Link>

              <hr className="border-black/10" />

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut size={18} className="text-red-500" />
                <span className="text-sm font-medium text-red-500">
                  Sign Out
                </span>
              </button>
            </div>

            <p className="text-xs text-center text-black/40 mt-4">
              This is a frontend demo. Profile data is stored in your browser.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
