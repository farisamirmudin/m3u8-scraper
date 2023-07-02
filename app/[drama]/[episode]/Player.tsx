"use client";
import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";
import Hls from "hls.js";
import Plyr from "plyr";

interface PlayerProps {
  links: string[];
}

export default function Player({ links }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hls = new Hls();

  useEffect(() => {
    if (!videoRef.current) return;
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const qualities = hls.levels.map((level) => level.height);
      new Plyr(videoRef.current as HTMLVideoElement, {
        controls: [
          "play-large",
          "restart",
          "rewind",
          "play",
          "fast-forward",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
        quality: {
          default: Math.max(...qualities) ?? qualities[0],
          options: qualities,
          forced: true,
          onChange: (quality) => {
            hls.levels.forEach((level, index) => {
              if (level.height === quality) {
                hls.currentLevel = index;
              }
            });
          },
        },
      });
    });
    const parsedLink = new URL(links[0]).href;
    if (Hls.isSupported()) {
      hls.loadSource(parsedLink);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = parsedLink;
    }
  }, [videoRef, links]);

  return (
    <div className="w-[1080px] h-[720px]">
      <video ref={videoRef} controls autoPlay />
    </div>
  );
}
