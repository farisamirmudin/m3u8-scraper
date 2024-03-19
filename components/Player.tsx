"use client";
import { type ElementRef, useRef, useEffect, useState } from "react";
import "plyr/dist/plyr.css";
import Hls from "hls.js";
import Plyr from "plyr";

type PlayerProps = {
  servers: string[];
};

export default function Player({ servers }: PlayerProps) {
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const videoRef = useRef<ElementRef<"video">>(null);

  useEffect(() => {
    const hls = new Hls();
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const qualities = hls.levels.map((level) => level.height);
      new Plyr(videoRef.current!, {
        keyboard: {
          focused: true,
          global: true,
        },
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
          default: Math.max(...qualities),
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
    const parsedLink = new URL(selectedServer).href;
    if (Hls.isSupported()) {
      hls.loadSource(parsedLink);
      hls.attachMedia(videoRef.current!);
    } else if (videoRef.current!.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current!.src = parsedLink;
    }
  }, [selectedServer]);

  return (
    <div>
      <label>
        Pick server:
        <select
          value={selectedServer}
          onChange={(e) => setSelectedServer(e.currentTarget.value)}
        >
          {servers.map((server, index) => (
            <option key={index} value={server}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>
      <video ref={videoRef} controls autoPlay />
    </div>
  );
}
