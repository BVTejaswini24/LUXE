import React, { useState, useRef, useEffect } from "react";
import Rating from "../ui/Rating";
import { IoEllipsisHorizontal, IoFlagOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Review } from "@/types/review.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ReviewCardProps = {
  blurChild?: React.ReactNode;
  isAction?: boolean;
  isDate?: boolean;
  data: Review;
  className?: string;
};

const ReviewCard = ({
  blurChild,
  isAction = false,
  isDate = false,
  data,
  className,
}: ReviewCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleReport = () => {
    setIsMenuOpen(false);
    toast.success("Review reported. Thank you for your feedback.");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  return (
    <div
      className={cn([
        "relative bg-white flex flex-col items-start aspect-auto border border-black/10 rounded-[20px] p-6 sm:px-8 sm:py-7 overflow-hidden",
        className,
      ])}
    >
      {blurChild && blurChild}
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
        <Rating
          initialValue={data.rating}
          allowFraction
          SVGclassName="inline-block"
          size={23}
          readonly
        />
        {isAction && (
          <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label="More options"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <IoEllipsisHorizontal className="text-black/40 text-2xl" />
            </Button>
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-white border border-black/10 rounded-xl shadow-lg py-1"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-black hover:bg-black/5 transition-colors text-left"
                  onClick={handleReport}
                >
                  <IoFlagOutline className="text-base" />
                  Report Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center mb-2 sm:mb-3">
        <strong className="text-black sm:text-xl mr-1">{data.user}</strong>
        <IoIosCheckmarkCircle className="text-[#01AB31] text-xl sm:text-2xl" />
      </div>
      <p className="text-sm sm:text-base text-black/60">{data.content}</p>
      {isDate && (
        <p className="text-black/60 text-sm font-medium mt-4 sm:mt-6">
          Posted on {data.date}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
