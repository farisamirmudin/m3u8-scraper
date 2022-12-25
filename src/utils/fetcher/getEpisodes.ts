import { load } from "cheerio";
import { Show } from "../../../typings";

export const getEpisodes = async (path: string, drama: boolean) => {
  if (drama) {
    const res = await fetch(process.env.NEXT_PUBLIC_DRAMA_BASE_URL + path);
    const html = await res.text();
    const $ = load(html);
    const episodes: Show[] = [];
    $("ul.listing.items.lists li").each((_, el) => {
      const path = $(el).find("a").attr("href")?.trim() ?? "";
      const img = $(el).find(".picture img").attr("src")?.trim() ?? "";
      const name = $(el).find(".name").text().trim() ?? "";
      episodes.push({ name, path, img });
    });
    return episodes;
  }
  let res = await fetch(process.env.NEXT_PUBLIC_ANIME_BASE_URL + path);
  let html = await res.text();
  let $ = load(html);
  const title = $("div.anime_info_body_bg h1").text().trim();
  const id = $("input#movie_id").attr("value") ?? "";
  const alias = $("input#alias_anime").attr("value") ?? "";
  const end = $("ul#episode_page li a").last().attr("ep_end") ?? "";
  const searchUrl = `https://ajax.gogo-load.com/ajax/load-list-episode?ep_start=0&ep_end=${end}&id=${id}&default_ep=0&alias=${alias}`;
  const episodes: Show[] = [];
  res = await fetch(searchUrl);
  html = await res.text();
  $ = load(html);
  $("a").each((_, el) => {
    const name = $(el).find("div.name").text() ?? "";
    const path = $(el).attr("href") ?? "";
    episodes.push({
      name: title + " Episode " + name.split(" ").at(-1),
      path,
    });
  });
  return episodes;
};
