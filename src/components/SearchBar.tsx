import React, { Dispatch, SetStateAction } from "react";
import { FC } from "react";

interface SearchBarProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}
const SearchBar: FC<SearchBarProps> = ({ text, setText }) => {
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="w-full border-b-2 border-indigo-600 bg-transparent py-1 placeholder-slate-400 outline-none"
      type="text"
      placeholder="Search Drama..."
    />
  );
};

export default SearchBar;
