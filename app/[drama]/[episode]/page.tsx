import { Video } from "@/typings/video";
import Link from "next/link";

type Params = {
  params: {
    drama: string;
    episode: string;
  };
};
const HOST = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";
export default async function Page({ params: { drama, episode } }: Params) {
  const dramaToFetch = `${drama}-episode-${episode}`;
  const serversToFetch = new URL(`${HOST}/api/dramas/episodes/servers`);
  serversToFetch.searchParams.set("selection", dramaToFetch);
  const episodesToFetch = new URL(`${HOST}/api/dramas/episodes`);
  episodesToFetch.searchParams.set("drama", dramaToFetch);
  const [links, episodes] = await Promise.all([
    fetch(serversToFetch)
      .then((res) => res.json())
      .then((data) => data as string[]),
    fetch(episodesToFetch)
      .then((res) => res.json())
      .then((data) => data as Video[]),
  ]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 break-all">
        {(links ?? []).map((link) => (
          <p className="hover:bg-violet-600">{new URL(link).href}</p>
        ))}
      </div>
      <div className="episode-grid">
        {(episodes ?? []).map((ep) => {
          const regex = /videos\/(.*)-episode-\d+/;
          const dramaName = (regex.exec(ep.path) ?? [])[1];
          const selectedEpisode = ep.title.split(" ").at(-1) ?? "1";
          return (
            <Link
              href={`/${dramaName}/${selectedEpisode}`}
              className={`text-center hover:bg-violet-600 ${
                selectedEpisode === episode && "bg-violet-500"
              }`}
            >
              {selectedEpisode}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
