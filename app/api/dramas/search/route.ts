import type { Video } from "@/typings/video";
import { load } from "cheerio";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) return NextResponse.json([]);
  const search_url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/search.html`);
  search_url.searchParams.set("keyword", keyword);
  const res = await fetch(search_url);
  const html = await res.text();
  const $ = load(html);
  const videos = [] as Video[];
  $("li.video-block").each((_, el) => {
    const title = $(el).find(".name").text().trim() || "";
    const img = $(el).find("img").attr("src") || "";
    const path = $(el).find("a").attr("href") || "";
    videos.push({ title, img, path });
  });

  return NextResponse.json(videos);
}
