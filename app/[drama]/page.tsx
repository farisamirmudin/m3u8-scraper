import { Video } from "@/typings/video";
import Link from "next/link";

type Params = {
  params: {
    drama: string;
  };
};
export default async function Page({ params: { drama } }: Params) {
  const urlToFetch = new URL("http://localhost:3000/api/dramas/episodes");
  urlToFetch.searchParams.set("drama", `${drama}-episode-1`);
  const res = await fetch(urlToFetch);
  const episodes = (await res.json()) as Video[];
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {episodes.map((episode) => (
          <div className="">
            <Link href={`${drama}/${episode.path.split("-").at(-1) ?? 1}`}>
              {episode.title}
            </Link>
            <p>{episode.path}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
