import { load } from "cheerio";
import { Show } from "../../typings";

export const episodes = async (path: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_DRAMA_BASE_URL + path);
  const html = await res.text();
  const $ = load(html);
  const episodes: Show[] = [];
  $("ul.listing.items.lists li").each((i, el) => {
    const path = $(el).find("a").attr("href") ?? "";
    const img = $(el).find(".picture img").attr("src") ?? "";
    const name = $(el).find(".name").text().trim() ?? "";
    episodes.push({ name, path, img });
  });
  return episodes;
};
