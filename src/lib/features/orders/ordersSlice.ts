import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { CartItem } from "@/lib/features/carts/cartsSlice";
import { DeliveryMethod } from "@/components/checkout-page/checkout.types";

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export type Order = {
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  signupDiscount: number;
  promoDiscount: number;
  promoCode: string | null;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  total: number;
  orderDate: string;
  status: OrderStatus;
};

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
  },
});

export const { addOrder } = ordersSlice.actions;

export const selectUserOrders = (state: RootState) => {
  const user = state.auth.user;
  if (!user) return [];
  return state.orders.orders.filter((o) => o.userId === user.id);
};

export default ordersSlice.reducer;
