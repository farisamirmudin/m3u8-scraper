import { Video } from "@/typings/video";
import { load } from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const drama = searchParams.get("drama");

  if (!drama) return NextResponse.json([]);
  const res = await fetch(`http://asianplay.net/videos/${drama}`);
  const html = await res.text();
  const $ = load(html);
  const episodes = [] as Video[];
  $("ul.listing.items.lists li").each((_, el) => {
    const path = $(el).find("a").attr("href")?.trim() ?? "";
    const img = $(el).find(".picture img").attr("src")?.trim() ?? "";
    const title = $(el).find(".name").text().trim() ?? "";
    episodes.push({ title, path, img });
  });

  return NextResponse.json(episodes);
}
