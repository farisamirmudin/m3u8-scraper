import { useStore } from "../utils/store";

const SearchBar = () => {
  const setText = useStore((state) => state.setText);
  return (
    <input
      onChange={(e) => {
        setText(e.target.value);
      }}
      className="min-w-[100px] flex-1 rounded-md bg-gray-100 px-3 py-1 placeholder-zinc-600 outline-none"
      type="text"
      placeholder="Search"
    />
  );
};

export default SearchBar;
