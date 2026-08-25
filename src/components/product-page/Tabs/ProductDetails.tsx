import React from "react";
import { Product } from "@/types/product.types";

export type SpecItem = {
  label: string;
  value: string;
};

type ProductDetailsProps = {
  product?: Product;
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const specsData: SpecItem[] = [
    {
      label: "Material composition",
      value: product?.material ?? "100% Cotton",
    },
    {
      label: "Care instructions",
      value: product?.careInstructions ?? "Machine wash warm, tumble dry",
    },
    {
      label: "Fit type",
      value: product?.fit ?? "Classic Fit",
    },
    {
      label: "Pattern",
      value: product?.pattern ?? "Solid",
    },
  ];

  return (
    <>
      {specsData.map((item, i) => (
        <div className="grid grid-cols-3" key={i}>
          <div>
            <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500">
              {item.label}
            </p>
          </div>
          <div className="col-span-2 py-3 lg:py-4 border-b">
            <p className="text-sm w-full leading-7 text-neutral-800 font-medium">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductDetails;
