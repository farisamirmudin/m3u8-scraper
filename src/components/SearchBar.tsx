import { Dispatch, SetStateAction } from "react";
import { FC } from "react";

interface SearchBarProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}
const SearchBar: FC<SearchBarProps> = ({ text, setText }) => {
  return (
    <div className="flex items-center justify-between gap-1 rounded-full bg-gray-400 px-2 text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-transparent placeholder-gray-600 outline-none"
        type="text"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
