import ReactPlayer from "react-player";
import { FC, useEffect, useState } from "react";

const Player: FC<PlayerProps> = ({ title, servers }) => {
  const [server, setServer] = useState<string>();

  useEffect(() => {
    setServer(servers[0]);
  }, [servers]);

  return (
    <section className="space-y-2">
      <p className="text-lg">{title}</p>
      <ReactPlayer
        width="100%"
        height="auto"
        controls
        playsinline
        playing
        url={server}
        onError={(error) => {
          if (error !== "hlsError") return;
          if (servers.length === 1) return;
          setServer(servers[1]);
        }}
      />
    </section>
  );
};

export default Player;
