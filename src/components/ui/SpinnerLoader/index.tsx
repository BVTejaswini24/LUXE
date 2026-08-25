import React from "react";
import s from "./SpinnerLoader.module.css";
import cn from "clsx";

const SpinnerLoader = ({ className }: any) => {
  return <span className={cn(s.Loader, {}, className && className)}></span>;
};

export default SpinnerLoader;
