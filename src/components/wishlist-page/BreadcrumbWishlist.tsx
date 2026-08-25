import React from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

const BreadcrumbWishlist = () => {
  return (
    <div className="flex items-center py-5 sm:py-6">
      <Link href="/" className="text-sm text-black/60 hover:text-black transition-all">
        Home
      </Link>
      <FiChevronRight className="mx-1 text-black/60 text-sm" />
      <span className="text-sm text-black">Wishlist</span>
    </div>
  );
};

export default BreadcrumbWishlist;
