import { Search } from "lucide-react";
import React from "react";

export const NoResultFound = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full mt-[6.4rem]">
      <Search className="w-20 h-20" />
      <p className="text-2xl font-bold mb-48">No result found</p>
    </div>
  );
};
