"use client";
import toast, { Toaster } from "react-hot-toast";
export default function DisplayLink({
  link,
  index,
}: {
  link: string;
  index: number;
}) {
  const parsedLink = new URL(link).href;
  return (
    <>
      <Toaster position="top-center" />
      <button
        className="hover:bg-violet-600 px-4 py-2 rounded-lg"
        onClick={() => {
          navigator.clipboard.writeText(parsedLink);
          toast.success("Copied to clipboard");
        }}
      >
        Link {index + 1}
      </button>
    </>
  );
}
