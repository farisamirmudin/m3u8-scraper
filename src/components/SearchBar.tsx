import { Dispatch, SetStateAction } from "react";
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
      className="min-w-[100px] flex-1 rounded-md px-3 py-1 outline-none"
      type="text"
      placeholder="Search"
    />
  );
};

export default SearchBar;
