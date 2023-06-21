import { Video } from "@/typings/video";
import Link from "next/link";

type PageType = {
  params: {
    drama: string;
  };
  searchParams: {
    episode: string;
  };
};
export default async function Page({
  params: { drama },
  searchParams: { episode },
}: PageType) {
  const urlToFetch = new URL("http://localhost:3000/api/dramas/episodes");
  urlToFetch.searchParams.set("drama", `${drama}-episode-${episode}`);
  const episodes = await fetch(urlToFetch)
    .then((res) => res.json())
    .then((data) => data as Video[]);
  return (
    <div className="">
      <p className="text-lg mb-8">Episodes</p>

      <div className="episode-grid">
        {(episodes ?? []).map((ep) => {
          const regex = /videos\/(.*)-episode-\d+/;
          const dramaName = (regex.exec(ep.path) ?? [])[1];
          const selectedEpisode = ep.title.split(" ").at(-1) ?? "1";
          return (
            <Link
              href={`/${dramaName}/${selectedEpisode}`}
              className="text-center hover:bg-violet-600"
            >
              {selectedEpisode}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
