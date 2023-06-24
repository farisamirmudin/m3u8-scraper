"use client";
import Hls from "hls.js";
import { useRef } from "react";
import DisplayLink from "./DisplayLink";

export default function Player({ links }: { links: string[] }) {
  const hls = new Hls();
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div className="flex flex-col gap-2">
      <video ref={videoRef} autoPlay controls></video>
      <div className="flex gap-2">
        {links?.map((link, i) => (
          <DisplayLink {...{ link, index: i, hls, videoRef }} />
        ))}
      </div>
    </div>
  );
}
