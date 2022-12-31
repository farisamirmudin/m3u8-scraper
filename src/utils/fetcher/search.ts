import { load } from "cheerio";
import { Show } from "../../../typings";

export const search = async (text: string, isDrama: boolean) => {
  if (isDrama) {
    const res = await fetch("http://asianplay.net/search.html?keyword=" + text);
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
  }
  const res = await fetch("https://gogoanime.tel/search.html?keyword=" + text);
  const html = await res.text();
  const $ = load(html);
  const video: Show[] = [];
  $("ul.items li").each((i, el) => {
    const name = $(el).find(".name").text().trim() ?? "";
    const img = $(el).find("img").attr("src") ?? "";
    const path = $(el).find(".name a").attr("href") ?? "";
    video.push({ name, img, path });
  });
  return video;
};
