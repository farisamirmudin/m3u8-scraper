import { load } from "cheerio";
import { decryptData, encryptData } from "./cipher";

export const getEpisode = async (path: string) => {
  let res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + path);
  let html = await res.text();
  let $ = load(html);
  let embedded = $("iframe").attr("src") ?? "";
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
  return files?.[0];
};
