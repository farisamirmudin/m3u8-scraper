import { load } from "cheerio";
import { Video } from "./search";

export const episodes = async (path: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path);
  const html = await res.text();
  const $ = load(html);
  const episodes: Video[] = [];
  $("ul.listing.items.lists li").each((i, el) => {
    const path = $(el).find("a").attr("href") ?? "";
    const img = $(el).find(".picture img").attr("src") ?? "";
    const name = $(el).find(".name").text().trim() ?? "";
    episodes.push({ name, path, img });
  });
  return episodes;
};
