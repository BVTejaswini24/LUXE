"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSlice";
import { selectUserOrders } from "@/lib/features/orders/ordersSlice";
import { DELIVERY_OPTIONS } from "@/components/checkout-page/checkout.types";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Button } from "@/components/ui/button";
import BreadcrumbAuth from "@/components/auth-page/BreadcrumbAuth";
import { ShoppingBag, User, Package, Truck, Calendar } from "lucide-react";

export default function OrdersPage() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const orders = useAppSelector(selectUserOrders);

  // Not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <BreadcrumbAuth page="Orders" />

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
                Please sign in to view your order history.
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

  // Empty orders state
  if (orders.length === 0) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <BreadcrumbAuth page="Orders" />

          <h1
            className={cn([
              integralCF.className,
              "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
            ])}
          >
            My Orders
          </h1>

          <div className="flex items-center justify-center mt-4 md:mt-16">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-black/5 mx-auto mb-6 flex items-center justify-center">
                <Package className="text-black/30" size={36} />
              </div>
              <h2 className="text-xl font-bold text-black mb-3">
                No Orders Yet
              </h2>
              <p className="text-black/60 text-sm mb-8">
                You haven&apos;t placed any orders yet. Start shopping to see your
                orders here.
              </p>
              <Button className="rounded-full h-12 bg-black text-white hover:bg-black/90" asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Orders list
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbAuth page="Orders" />

        <h1
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const deliveryOption = DELIVERY_OPTIONS.find(
              (d) => d.id === order.deliveryMethod
            );

            return (
              <div
                key={order.orderNumber}
                className="bg-white rounded-[20px] border border-black/10 p-5 md:p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                      <ShoppingBag size={18} className="text-black/60" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black font-mono">
                        {order.orderNumber}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-black/50">
                        <Calendar size={12} />
                        <span>
                          {new Date(order.orderDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        order.status === "confirmed" && "bg-green-100 text-green-700",
                        order.status === "processing" && "bg-blue-100 text-blue-700",
                        order.status === "shipped" && "bg-purple-100 text-purple-700",
                        order.status === "delivered" && "bg-gray-100 text-gray-700"
                      )}
                    >
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-black">
                      ${order.total}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#F0EEED] overflow-hidden flex-shrink-0">
                        <img
                          src={item.srcUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-black/50">
                          {item.attributes.join(" / ")} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-black">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-black/10">
                  <div className="flex items-center gap-2 text-sm text-black/60">
                    <Truck size={14} />
                    <span>{deliveryOption?.name ?? "Standard Delivery"}</span>
                    {order.deliveryFee > 0 && (
                      <span className="text-black/40">
                        (+${order.deliveryFee})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-black/60">
                    Total:{" "}
                    <span className="font-bold text-black">${order.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
