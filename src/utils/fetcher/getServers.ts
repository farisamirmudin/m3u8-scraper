import { load } from "cheerio";
import { decrypt, encrypt } from "../cipher";

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
