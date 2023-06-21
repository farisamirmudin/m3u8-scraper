"use client";
import toast, { Toaster } from "react-hot-toast";
export default function DisplayLink({ link }: { link: string }) {
  return (
    <>
      <Toaster position="top-center" />
      <p
        className="hover:bg-violet-600 cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(link);
          toast.success("Copied to clipboard");
        }}
      >
        {new URL(link).href}
      </p>
    </>
  );
}
