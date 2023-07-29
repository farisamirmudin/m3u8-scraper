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

  useEffect(() => {
    if (!videoRef.current) return;
    const hls = new Hls();
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const qualities = hls.levels.map((level) => level.height);
      if (!videoRef.current) return;
      new Plyr(videoRef.current, {
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
    <div>
      <video ref={videoRef} controls autoPlay />
    </div>
  );
}
