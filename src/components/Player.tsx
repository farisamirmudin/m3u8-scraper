import React, { MutableRefObject } from "react";
import ReactPlayer from "react-player";

const Player = ({
  title,
  selectedServer,
  playerError,
}: {
  title: MutableRefObject<string>;
  selectedServer: string | undefined;
  playerError: (error: any) => void;
}) => {
  return (
    <section className="space-y-2">
      <p className="text-lg">{title.current}</p>
      <ReactPlayer
        width="100%"
        height="auto"
        controls
        playing
        url={selectedServer}
        onError={(error) => playerError(error)}
      />
    </section>
  );
};

export default Player;
