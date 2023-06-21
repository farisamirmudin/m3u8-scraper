import { Video } from "@/typings/video";
import { load } from "cheerio";
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
  // reason why this is commented out: https://github.com/vercel/next.js/issues/44463
  // const urlToFetch = new URL("http://localhost:3000/api/dramas/episodes");
  // urlToFetch.searchParams.set("drama", `${drama}-episode-${episode}`);
  // const episodes = await fetch(urlToFetch)
  //   .then((res) => res.json())
  //   .then((data) => data as Video[]);
  const res = await fetch(
    `http://asianplay.net/videos/${drama}-episode-${episode}`
  );
  const html = await res.text();
  const $ = load(html);
  const episodes = [] as Video[];
  $("ul.listing.items.lists li").each((_, el) => {
    const path = $(el).find("a").attr("href")?.trim() ?? "";
    const img = $(el).find(".picture img").attr("src")?.trim() ?? "";
    const title = $(el).find(".name").text().trim() ?? "";
    episodes.push({ title, path, img });
  });
  return (
    <div className="">
      <p className="text-lg mb-8">Episodes</p>

      <div className="episode-grid">
        {episodes.map((ep) => {
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
