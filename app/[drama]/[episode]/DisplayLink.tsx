"use client";
import toast, { Toaster } from "react-hot-toast";
export default function DisplayLink({ link }: { link: string }) {
  const parsedLink = new URL(link).href;
  return (
    <>
      <Toaster position="top-center" />
      <p
        className="hover:bg-violet-600 cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(parsedLink);
          toast.success("Copied to clipboard");
        }}
      >
        {parsedLink}
      </p>
    </>
  );
}
