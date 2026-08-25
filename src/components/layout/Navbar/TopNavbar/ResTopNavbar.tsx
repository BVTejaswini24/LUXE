"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { NavMenu } from "../navbar.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, User, LogOut, LogIn } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { selectWishlistCount } from "@/lib/features/wishlist/wishlistSlice";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  logout,
} from "@/lib/features/auth/authSlice";
import { toast } from "sonner";

const ResTopNavbar = ({ data }: { data: NavMenu }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlistCount = useAppSelector(selectWishlistCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const handleSignOut = () => {
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Image
          priority
          src="/icons/menu.svg"
          height={100}
          width={100}
          alt="menu"
          className="max-w-[22px] max-h-[22px]"
        />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader className="mb-10">
          <SheetTitle asChild>
            <SheetClose asChild>
              <Link href="/" className={cn([integralCF.className, "text-2xl"])}>
                LUXE
              </Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-start">
          {data.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "MenuItem" && (
                <SheetClose asChild>
                  <Link href={item.url ?? "/"} className="mb-4">
                    {item.label}
                  </Link>
                </SheetClose>
              )}
              {item.type === "MenuList" && (
                <div className="mb-4 w-full">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={item.label} className="border-none">
                      <AccordionTrigger className="text-left p-0 py-0.5 font-normal text-base">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent className="p-4 pb-0 border-l flex flex-col">
                        {item.children.map((itemChild) => (
                          <SheetClose
                            key={itemChild.id}
                            asChild
                            className="w-fit py-2 text-base"
                          >
                            <Link href={itemChild.url ?? "/"}>
                              {itemChild.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <hr className="border-t-black/10 my-4" />
        <SheetClose asChild>
          <Link href="/wishlist" className="flex items-center gap-2 mb-4">
            <Heart size={18} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="border bg-black text-white rounded-full px-1.5 text-xs">
                {wishlistCount}
              </span>
            )}
          </Link>
        </SheetClose>
        <hr className="border-t-black/10 my-4" />
        {isAuthenticated && user ? (
          <>
            <SheetClose asChild>
              <Link href="/account" className="flex items-center gap-2 mb-4">
                <User size={18} />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </Link>
            </SheetClose>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 mb-4 text-red-500"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <SheetClose asChild>
              <Link href="/signin" className="flex items-center gap-2 mb-4">
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/signup" className="flex items-center gap-2 mb-4">
                <User size={18} />
                <span>Create Account</span>
              </Link>
            </SheetClose>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ResTopNavbar;
