import Link from "next/link";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-center mt-4 md:mt-8">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-black mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="text-white" size={28} />
            </div>
            <h1
              className={cn([
                integralCF.className,
                "text-2xl md:text-3xl font-bold text-black mb-2",
              ])}
            >
              404
            </h1>
            <p className="text-black/60 text-sm mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <Button
              asChild
              className="rounded-full h-12 px-8 text-sm font-medium bg-black text-white hover:bg-black/90"
            >
              <Link href="/">Back to Homepage</Link>
            </Button>
            <p className="text-center text-sm text-black/60 mt-6">
              Continue Shopping?{" "}
              <Link
                href="/shop"
                className="font-medium text-black hover:underline"
              >
                Browse Store
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
