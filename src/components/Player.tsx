import ReactPlayer from "react-player";
import { FC } from "react";

const Player: FC<PlayerProps> = ({ title, servers }) => {
  return (
    <section className="space-y-2">
      <p className="text-lg">{title}</p>
      <ReactPlayer
        width="100%"
        height="auto"
        controls
        playsinline
        url={servers[0]}
      />
    </section>
  );
};

export default Player;
