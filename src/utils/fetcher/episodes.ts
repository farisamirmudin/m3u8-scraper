import { load } from "cheerio";
import { Show } from "../../../typings";

export const episodes = async (path: string, type: string) => {
  if (type === "drama") {
    const res = await fetch(process.env.NEXT_PUBLIC_DRAMA_BASE_URL + path);
    const html = await res.text();
    const $ = load(html);
    const episodes: Show[] = [];
    $("ul.listing.items.lists li").each((i, el) => {
      const path = $(el).find("a").attr("href") ?? "";
      const img = $(el).find(".picture img").attr("src") ?? "";
      const name =
        "EP " + $(el).find(".name").text().trim().split(" ").at(-1) ?? "";
      episodes.push({ name, path, img });
    });
    return episodes;
  }
  let res = await fetch(process.env.NEXT_PUBLIC_ANIME_BASE_URL + path);
  let html = await res.text();
  let $ = load(html);
  const id = $("input#movie_id").attr("value") ?? "";
  const alias = $("input#alias_anime").attr("value") ?? "";
  const default_ep = $("input#default_ep").attr("value") ?? "";
  const ep_start = $("a.active").attr("ep_start") ?? "";
  const ep_end = $("a.active").attr("ep_end") ?? "";

  const search_url = `https://ajax.gogo-load.com/ajax/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${id}&default_ep=${default_ep}&alias=${alias}`;
  res = await fetch(search_url);
  html = await res.text();
  $ = load(html);
  const episodes: Show[] = [];
  $("a").each((i, el) => {
    const name = $(el).find("div.name").text() ?? "";
    const path = $(el).attr("href") ?? "";
    episodes.push({
      name,
      path,
    });
  });
  return episodes;
};
