import { Video } from "@/typings/video";
import Link from "next/link";

type Params = {
  params: {
    drama: string;
    episode: string;
  };
};
const HOST = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3333";
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
    <div className="">
      <div className="flex flex-col gap-2">
        {(links ?? []).map((link) => (
          <p>{link}</p>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {(episodes ?? []).reverse().map((ep) => {
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
              <Link href={`/${dramaName}/${selectedEpisode}`}>
                {selectedEpisode}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
