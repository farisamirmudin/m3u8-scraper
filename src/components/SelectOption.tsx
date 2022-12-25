import React, { Dispatch, SetStateAction } from "react";

const SelectOption = ({
  isDrama,
  setIsDrama,
}: {
  isDrama: boolean;
  setIsDrama: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex gap-8">
      <button
        onClick={() => setIsDrama(false)}
        className={`${
          !isDrama &&
          "underline decoration-indigo-600 decoration-2 underline-offset-4"
        }`}
      >
        Anime
      </button>
      <button
        onClick={() => setIsDrama(true)}
        className={`${
          isDrama &&
          "underline decoration-indigo-600 decoration-2 underline-offset-4"
        }`}
      >
        Korean Drama
      </button>
    </div>
  );
};

export default SelectOption;
