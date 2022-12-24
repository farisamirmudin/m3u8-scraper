import { load } from "cheerio";
import { decryptData, encryptData } from "./cipher";

export const episode = async (path: string) => {
  const key = process.env.NEXT_PUBLIC_DRAMA_SECRET_KEY
  const iv = process.env.NEXT_PUBLIC_DRAMA_IV
  let res = await fetch(process.env.NEXT_PUBLIC_DRAMA_BASE_URL + path);
  const html = await res.text();
  const $ = load(html);
  const embedded = $("iframe").attr("src") ?? "";
  const id = new URL("https:" + embedded).searchParams.get("id");
  const encId = encryptData(id!,key!, iv!);
  res = await fetch(process.env.NEXT_PUBLIC_DRAMA_AJAX_URL + "?id=" + encId, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const encSource: { data: string } = await res.json();
  const source = decryptData(encSource.data,key!, iv!);
  const re = /(https.+?.m3u8)/;
  const files = re.exec(source);
  const m3u8 = files?.reduce((longest, current) => {
    return longest.length > current.length ? longest : current;
  });
  return m3u8;
};
