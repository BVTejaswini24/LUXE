import React from "react";
import WishlistContent from "@/components/wishlist-page/WishlistContent";
import SpinnerLoader from "@/components/ui/SpinnerLoader";

export default function WishlistPage() {
  return (
    <React.Suspense
      fallback={
        <main className="pb-20">
          <div className="max-w-frame mx-auto px-4 xl:px-0 flex items-center justify-center h-96">
            <SpinnerLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        </main>
      }
    >
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <WishlistContent />
        </div>
      </main>
    </React.Suspense>
  );
}
