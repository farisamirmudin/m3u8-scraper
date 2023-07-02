import { decrypt, encrypt } from "@/utils/cipher";
import { load } from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const selection = searchParams.get("selection");

  if (!selection) return NextResponse.json([]);
  const key = process.env.NEXT_PUBLIC_KEY ?? "";
  const iv = process.env.NEXT_PUBLIC_IV ?? "";
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${selection}`
  );
  const html = await res.text();
  const $ = load(html);

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

  const enc = await res.json();
  const source = decrypt(enc.data, key, iv);
  const links = source.match(/(https.+?m3u8)/g);
  return NextResponse.json(links);
}
