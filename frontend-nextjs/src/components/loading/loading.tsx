"use client"

import loadingBasket from "@/lottieJson/loadingBasket.json";
import Lottie from "lottie-react";

export const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full mt-4">
      <Lottie animationData={loadingBasket} loop={true} className="w-[70%]"/>
      <p className="text-[#c63d53] font-semibold animate-blink text-xl -mt-14 mb-6">Retrieving...</p>
    </div>
  )
}
