"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewCard from "@/components/common/ReviewCard";
import { reviewsData } from "@/lib/data/reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";
import { useSelector, useDispatch } from "react-redux";
import {
  addReview,
  selectSubmittedReviews,
} from "@/lib/features/reviews/reviewsSlice";
import { AppDispatch } from "@/lib/store";
import { toast } from "sonner";
import Rating from "@/components/ui/Rating";

type ReviewsContentProps = {
  product?: Product;
};

const ReviewsContent = ({ product }: ReviewsContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const submittedReviews = useSelector(
    selectSubmittedReviews(product?.id ?? 0)
  );
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    rating?: string;
    reviewText?: string;
  }>({});
  const REVIEWS_PER_PAGE = 4;
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const allReviews = useMemo(() => {
    const staticReviews = reviewsData.filter(
      (r) => r.productId === product?.id
    );
    return [...staticReviews, ...submittedReviews];
  }, [product?.id, submittedReviews]);

  const reviewCount = product?.reviewCount ?? 0;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (rating === 0) newErrors.rating = "Rating is required";
    if (!reviewText.trim()) newErrors.reviewText = "Review text is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      productId: product?.id ?? 0,
      user: name.trim(),
      content: reviewText.trim(),
      rating,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    dispatch(addReview(newReview));
    toast.success("Your review has been submitted!");

    setName("");
    setRating(0);
    setReviewText("");
    setErrors({});
    setShowForm(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">
            All Reviews
          </h3>
          <span className="text-sm sm:text-base text-black/60">
            ({reviewCount})
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Select defaultValue="latest">
            <SelectTrigger className="min-w-[120px] font-medium text-xs sm:text-base px-4 py-3 sm:px-5 sm:py-4 text-black bg-[#F0F0F0] border-none rounded-full h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most-relevant">Most Relevant</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
            onClick={() => setShowForm(!showForm)}
          >
            Write a Review
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-black/10 rounded-[20px] bg-white">
          <h4 className="text-lg font-bold text-black mb-4">
            Write a Review for {product?.title ?? "this product"}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-black/10 rounded-lg text-black bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Rating *
              </label>
              <Rating
                initialValue={rating}
                onClick={(rate: number) => setRating(rate)}
                size={28}
                SVGclassName="inline-block"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Review *
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-black/10 rounded-lg text-black bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                placeholder="Write your review..."
              />
              {errors.reviewText && (
                <p className="text-red-500 text-sm mt-1">{errors.reviewText}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 rounded-full bg-black font-medium text-sm h-11"
              >
                Submit Review
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setRating(0);
                  setReviewText("");
                  setErrors({});
                }}
                className="px-6 py-3 rounded-full font-medium text-sm h-11 border border-black/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-9">
        {allReviews.slice(0, visibleCount).map((review) => (
          <ReviewCard key={review.id} data={review} isAction isDate />
        ))}
      </div>
      {visibleCount < allReviews.length && (
        <div className="w-full px-4 sm:px-0 text-center">
          <button
            type="button"
            className="inline-block w-[230px] px-11 py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
            onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)}
          >
            Load More Reviews
          </button>
        </div>
      )}
    </section>
  );
};

export default ReviewsContent;
