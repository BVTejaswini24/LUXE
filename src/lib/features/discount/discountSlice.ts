import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

const VALID_PROMO_CODES: Record<string, number> = {
  LUXE10: 10,
};

interface DiscountState {
  signupApplied: boolean;
  promoCode: string | null;
  promoDiscountPercent: number;
}

const initialState: DiscountState = {
  signupApplied: false,
  promoCode: null,
  promoDiscountPercent: 0,
};

export const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    applySignupDiscount: (state) => {
      state.signupApplied = true;
    },
    removeSignupDiscount: (state) => {
      state.signupApplied = false;
    },
    setSignupDiscount: (state, action: PayloadAction<boolean>) => {
      state.signupApplied = action.payload;
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      const percent = VALID_PROMO_CODES[code];
      if (percent) {
        state.promoCode = code;
        state.promoDiscountPercent = percent;
      }
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.promoDiscountPercent = 0;
    },
  },
});

export const {
  applySignupDiscount,
  removeSignupDiscount,
  setSignupDiscount,
  applyPromoCode,
  removePromoCode,
} = discountSlice.actions;

export const selectSignupApplied = (state: RootState) =>
  state.discount.signupApplied;

export const selectPromoCode = (state: RootState) =>
  state.discount.promoCode;

export const selectPromoDiscountPercent = (state: RootState) =>
  state.discount.promoDiscountPercent;

export const isValidPromoCode = (code: string): boolean => {
  const trimmed = code.trim().toUpperCase();
  return trimmed in VALID_PROMO_CODES;
};

export const getPromoDiscountPercent = (code: string): number => {
  const trimmed = code.trim().toUpperCase();
  return VALID_PROMO_CODES[trimmed] ?? 0;
};

export default discountSlice.reducer;
