import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@/components/storage";
import productsReducer from "./features/products/productsSlice";
import cartsReducer from "./features/carts/cartsSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import discountReducer from "./features/discount/discountSlice";
import authReducer from "./features/auth/authSlice";
import ordersReducer from "./features/orders/ordersSlice";
import reviewsReducer from "./features/reviews/reviewsSlice";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["carts", "wishlist", "discount", "auth", "orders", "reviews"],
};

const rootReducer = combineReducers({
  products: productsReducer,
  carts: cartsReducer,
  wishlist: wishlistReducer,
  discount: discountReducer,
  auth: authReducer,
  orders: ordersReducer,
  reviews: reviewsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

const store = makeStore().store;

// Infer the type of the store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
