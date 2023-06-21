"use client";
import { Video } from "@/typings/video";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type DramaType = {
  drama: string;
  episode: string;
};
const HOST = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";
export default function Drama({ drama, episode }: DramaType) {
  const dramaToFetch = `${drama}-episode-${episode}`;
  const linksToFetch = new URL(`${HOST}/api/dramas/episodes/servers`);
  linksToFetch.searchParams.set("selection", dramaToFetch);
  const { data: links } = useQuery(["drama", drama, episode], () =>
    fetch(linksToFetch)
      .then((res) => res.json())
      .then((data) => data as string[])
  );
  const episodesToFetch = new URL(`${HOST}/api/dramas/episodes`);
  episodesToFetch.searchParams.set("drama", dramaToFetch);
  const { data: episodes } = useQuery(["episode", drama, episode], () =>
    fetch(episodesToFetch)
      .then((res) => res.json())
      .then((data) => data as Video[])
  );
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {links?.map((link, i) => (
          <p key={i}>{link}</p>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {episodes?.map((ep, i) => {
          const regex = /videos\/(.*)-episode-\d+/;
          const dramaName = (regex.exec(ep.path) ?? [])[1];
          const selectedEpisode = ep.title.split(" ").at(-1) ?? "1";
          return (
            <div
              className={`px-1 ${
                selectedEpisode === episode &&
                "bg-white rounded-full text-black"
              }`}
            >
              <Link
                key={i}
                prefetch={false}
                href={`/${dramaName}/${selectedEpisode}`}
              >
                {selectedEpisode}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
