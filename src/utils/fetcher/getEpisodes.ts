import { load } from "cheerio";
import { Show } from "../../../typings";

export const getEpisodes = async (path: string) => {
  const res = await fetch(`http://asianplay.net${path}`);
  const html = await res.text();
  const $ = load(html);
  const episodes: Show[] = [];
  $("ul.listing.items.lists li").each((_, el) => {
    const path = $(el).find("a").attr("href")?.trim() ?? "";
    const img = $(el).find(".picture img").attr("src")?.trim() ?? "";
    const title = $(el).find(".name").text().trim() ?? "";
    episodes.push({ title, path, img });
  });
  return episodes;
};
