import { Video } from "@/typings/video";
import Link from "next/link";
import DisplayLink from "./DisplayLink";

type Params = {
  params: {
    drama: string;
    episode: string;
  };
};
const HOST = process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost:3000";
export default async function Page({ params: { drama, episode } }: Params) {
  const urlToFetch = new URL(`${HOST}/api/dramas/episodes/servers`);
  urlToFetch.searchParams.set("selection", `${drama}-episode-${episode}`);
  const links = await fetch(urlToFetch)
    .then((res) => res.json())
    .then((data) => data as string[]);
  return (
    <div className="">
      <p className="text-lg mb-8">Links</p>
      <div className="flex flex-col gap-2 break-all">
        {(links ?? []).map((link) => (
          <DisplayLink link={link} />
        ))}
      </div>
    </div>
  );
}
