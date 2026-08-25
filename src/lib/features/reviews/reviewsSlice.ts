import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { Review } from "@/types/review.types";

interface ReviewsState {
  submittedReviews: Review[];
}

const initialState: ReviewsState = {
  submittedReviews: [],
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.submittedReviews.push(action.payload);
    },
  },
});

export const { addReview } = reviewsSlice.actions;

export const selectSubmittedReviews =
  (productId: number) => (state: RootState) =>
    state.reviews.submittedReviews.filter((r) => r.productId === productId);

export default reviewsSlice.reducer;
