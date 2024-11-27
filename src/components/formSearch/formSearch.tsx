import React from "react";
import { SearchIcon } from "../icons/searchIcon";

interface InputSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  inputClassName?: string;
  formClassName?: string;
}

export const FormSearch = (props: InputSearchProps) => {
  return (
    <form
      className={`flex gap-2 z-20 rounded-full px-4 border-[1px] border-white/20 ${props.formClassName}`}
      onSubmit={props.searchHandler}
    >
      <input
        value={props.searchValue}
        onChange={(e) => props.setSearchValue(e.target.value)}
        className={`rounded-2xl w-full focus:outline-none bg-transparent  placeholder:text-black/60 ${props.inputClassName}`}
        type="text"
        placeholder="Search..."
      />
      <button type="submit">
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  );
};
