import { load } from "cheerio";
import { Show } from "../../../typings";

export const search = async (keyword: string) => {
  const res = await fetch(
    `http://asianplay.net/search.html?keyword=${keyword}`
  );
  const html = await res.text();
  const $ = load(html);
  const video: Show[] = [];
  $("li.video-block").each((i, el) => {
    const name = $(el).find(".name").text().trim() ?? "";
    const img = $(el).find("img").attr("src") ?? "";
    const path = $(el).find("a").attr("href") ?? "";
    video.push({ name, img, path });
  });
  return video;
};
