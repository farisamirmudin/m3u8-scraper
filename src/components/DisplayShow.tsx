import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Show } from "../../typings";

const DisplayShow = ({
  shows,
  handleSelectShow,
}: {
  shows: Show[];
  handleSelectShow: (show: Show) => Promise<void>;
}) => {
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

          <p className={`text-center text-xs`}>{show.name}</p>
        </div>
      ))}
    </section>
  );
};

export default DisplayShow;
