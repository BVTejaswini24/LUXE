"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-center mt-4 md:mt-8">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-black mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="text-white" size={28} />
            </div>
            <h1
              className={cn([
                integralCF.className,
                "text-2xl md:text-3xl font-bold text-black mb-2",
              ])}
            >
              Something went wrong
            </h1>
            <p className="text-black/60 text-sm mb-8">
              An unexpected error occurred. Please try again or head back to the
              homepage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => reset()}
                className="rounded-full h-12 px-8 text-sm font-medium bg-black text-white hover:bg-black/90"
              >
                Try Again
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full h-12 px-8 text-sm font-medium border-black/10 text-black hover:bg-black hover:text-white"
              >
                <Link href="/">Back to Homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
