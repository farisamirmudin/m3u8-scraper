"use client";
import toast, { Toaster } from "react-hot-toast";
import Hls from "hls.js";
import { RefObject } from "react";

type DisplayLinkProps = {
  link: string;
  index: number;
  hls: Hls;
  videoRef: RefObject<HTMLVideoElement>;
};

export default function DisplayLink({
  link,
  index,
  hls,
  videoRef,
}: DisplayLinkProps) {
  const parsedLink = new URL(link).href;
  return (
    <>
      <Toaster position="top-center" />
      <button
        className="hover:bg-violet-600 px-4 py-2 rounded-lg"
        onClick={() => {
          navigator.clipboard.writeText(parsedLink);
          toast.success("Playing...");
          hls.loadSource(parsedLink);
          if (!videoRef.current) return;
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            videoRef.current?.play();
          });
        }}
      >
        Link {index + 1}
      </button>
    </>
  );
}
