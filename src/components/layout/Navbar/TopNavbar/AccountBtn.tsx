"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { selectIsAuthenticated, selectCurrentUser } from "@/lib/features/auth/authSlice";
import Image from "next/image";
import Link from "next/link";

const AccountBtn = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  return (
    <Link href="/account" className="p-1 relative group" aria-label="Account">
      <Image
        priority
        src="/icons/user.svg"
        height={100}
        width={100}
        alt="account"
        className="max-w-[22px] max-h-[22px]"
      />
      {isAuthenticated && user && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
      )}
    </Link>
  );
};

export default AccountBtn;
