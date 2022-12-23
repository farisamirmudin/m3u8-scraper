import { load } from "cheerio";
export interface Show {
  name: string;
  img: string;
  path: string;
}
export const search = async (text: string) => {
  if (!text) return [];
  const res = await fetch(process.env.NEXT_PUBLIC_SEARCH_URL + text);
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
