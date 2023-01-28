import { load } from "cheerio";
import { decrypt, encrypt } from "./cipher";
import { z } from "zod";
import { videoSchema } from "./store";

export const getEpisodes = async (path: string) => {
  const res = await fetch(`http://asianplay.net${path}`);
  const html = await res.text();
  const $ = load(html);
  const episodes = [] as z.infer<typeof videoSchema>[];
  $("ul.listing.items.lists li").each((_, el) => {
    const path = $(el).find("a").attr("href")?.trim() ?? "";
    const img = $(el).find(".picture img").attr("src")?.trim() ?? "";
    const title = $(el).find(".name").text().trim() ?? "";
    episodes.push({ title, path, img });
  });
  return episodes;
};

export const getServers = async (path: string) => {
  const key = "93422192433952489752342908585752";
  const iv = "9262859232435825";
  let res = await fetch(`https://asianplay.net${path}`);
  const html = await res.text();
  const $ = load(html);

  const streaming = $("iframe").attr("src") ?? "";
  const id = new URL("https:" + streaming).searchParams.get("id") ?? "";
  const encId = encrypt(id, key, iv);
  res = await fetch(`https://asianplay.net/encrypt-ajax.php?id=${encId}`, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const enc = await res.json();
  const source = decrypt(enc.data, key, iv);
  const links = source.match(/(https.+?m3u8)/g);
  return links;
};

export const search = async (keyword: string) => {
  const res = await fetch(
    `http://asianplay.net/search.html?keyword=${keyword}`
  );
  const html = await res.text();
  const $ = load(html);
  const videos = [] as z.infer<typeof videoSchema>[];
  $("li.video-block").each((_, el) => {
    const title = $(el).find(".name").text().trim() || "";
    const img = $(el).find("img").attr("src") || "";
    const path = $(el).find("a").attr("href") || "";
    videos.push({ title, img, path });
  });
  return videos;
};
