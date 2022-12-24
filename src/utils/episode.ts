import { load } from "cheerio";
import { decryptData, encryptData } from "./cipher";

export const episode = async (path: string) => {
  let res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path);
  const html = await res.text();
  const $ = load(html);
  const embedded = $("iframe").attr("src") ?? "";
  const id = new URL("https:" + embedded).searchParams.get("id");
  const encryptedId = encryptData(id!);
  res = await fetch(process.env.NEXT_PUBLIC_AJAX_URL + "?id=" + encryptedId, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data: { data: string } = await res.json();
  const decryptedData = decryptData(data.data);
  const re = /(https.+?.m3u8)/;
  const files = re.exec(decryptedData);
  const m3u8 = files?.reduce((longest, current) => {
    return longest.length > current.length ? longest : current;
  });
  return m3u8;
};
