import Image from "next/image";

import { FC } from "react";
import { video } from "../utils/fetcher";

interface DisplayShowProps {
  shows: video[];
  handleSelectShow: (show: video) => Promise<void>;
}

const DisplayShow: FC<DisplayShowProps> = ({ shows, handleSelectShow }) => {
  return (
    <section className="video-grid">
      {shows.map((show, i) => (
        <div
          key={i}
          className={`cursor-pointer space-y-2 transition-transform duration-200 ease-out hover:scale-105`}
          onClick={() => handleSelectShow(show)}
        >
          <Image
            className="h-36 w-full rounded-md object-cover"
            src={show.img!}
            width={400}
            height={800}
            alt="banner"
          />

          <p className={`text-center text-xs`}>{show.title}</p>
        </div>
      ))}
    </section>
  );
};

export default DisplayShow;
