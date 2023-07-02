import { Video } from "@/typings/video";
import { load } from "cheerio";
import DisplayShow from "./DisplayShow";
import axios from "axios";

interface PageProps {
  params: {
    drama: string;
  };
  searchParams: {
    episode: string;
  };
}
export default async function Page({
  params: { drama },
  searchParams: { episode },
}: PageProps) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${drama}-episode-${episode}`
  );

  const $ = load(res.data ?? "");
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
        {episodes.map((ep) => (
          <DisplayShow ep={ep} />
        ))}
      </div>
    </div>
  );
}
