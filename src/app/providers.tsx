"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";
import SpinnerLoader from "@/components/ui/SpinnerLoader";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-96">
            <SpinnerLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        }
        persistor={storeRef.current.persistor}
      >
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </PersistGate>
    </Provider>
  );
};

export default Providers;
