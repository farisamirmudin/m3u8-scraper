"use server";

import { type Video } from "@/typings/video";
import { decrypt, encrypt } from "@/utils/cipher";
import { load } from "cheerio";

type FormState = {
  message: string;
  error: string;
  data: Video[];
};
const key = process.env.NEXT_PUBLIC_KEY ?? "";
const iv = process.env.NEXT_PUBLIC_IV ?? "";

export const getDrama = async ({
  drama,
  episode,
}: {
  drama: string;
  episode: string;
}) => {
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${drama}-episode-${episode}`
  );
  const $ = load((await res.text()) ?? "");
  const episodes = [] as Video[];
  $("ul.listing.items.lists li").each((_, el) => {
    const path = $(el).find("a").attr("href")?.trim() ?? "";
    const img = $(el).find(".picture img").attr("src")?.trim() ?? "";
    const title = $(el).find(".name").text().trim() ?? "";
    episodes.push({ title, path, img });
  });
  const streaming = $("iframe").attr("src") ?? "";
  const id = new URL("https:" + streaming).searchParams.get("id") ?? "";
  const encId = encrypt(id, key, iv);
  res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/encrypt-ajax.php?id=${encId}`,
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  );
  const enc = (await res.json()) as { data: string };
  const source = decrypt(enc.data, key, iv);
  const servers = (source.match(/(https.+?m3u8)/g) ?? []) as string[];

  return {
    episodes,
    servers,
  };
};

export const getDramas = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const keyword = formData.get("keyword") as string;
  if (!keyword)
    return {
      message: "success",
      error: "",
      data: [],
    };

  const searchUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/search.html`);
  searchUrl.searchParams.set("keyword", keyword);

  try {
    const res = await fetch(searchUrl);
    const $ = load((await res.text()) ?? "");
    const videos = [] as Video[];
    $("li.video-block").each((_, el) => {
      const title = $(el).find(".name").text().trim() || "";
      const img = $(el).find("img").attr("src") || "";
      const path = $(el).find("a").attr("href") || "";
      videos.push({ title, img, path });
    });

    return {
      message: "success",
      error: "",
      data: videos,
    };
  } catch (error) {
    return {
      message: "error",
      error: `Error while searching for keyword ${keyword}`,
      data: [],
    };
  }
};
