import { load } from "cheerio";
import { decryptData, encryptData } from "../cipher";

export const episode = async (path: string, type: string) => {
  if (type === "drama") {
    const key = process.env.NEXT_PUBLIC_DRAMA_SECRET_KEY;
    const iv = process.env.NEXT_PUBLIC_DRAMA_IV;
    let res = await fetch(process.env.NEXT_PUBLIC_DRAMA_BASE_URL + path);
    const html = await res.text();
    const $ = load(html);

    const embedded = $("iframe").attr("src") ?? "";
    const id = new URL("https:" + embedded).searchParams.get("id");

    if (!key || !iv) return "";
    const encId = encryptData(id!, key, iv);

    res = await fetch(process.env.NEXT_PUBLIC_DRAMA_AJAX_URL + "?id=" + encId, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const encSource: { data: string } = await res.json();
    const source = decryptData(encSource.data, key, iv);
    const pattern = /(https.+?m3u8)/g;
    const m3u8Links = source.match(pattern);
    const m3u8 = m3u8Links?.reduce((longest, current) => {
      return longest.length > current.length ? longest : current;
    });
    return m3u8;
  }
  let res = await fetch(process.env.NEXT_PUBLIC_ANIME_BASE_URL + path.trim());
  let html = await res.text();
  let $ = load(html);
  const embedded = $("iframe").attr("src") ?? "";

  res = await fetch("https:" + embedded);
  html = await res.text();
  $ = load(html);

  const data = $(`script[data-name="episode"]`).attr("data-value") ?? "";
  const id = $("input#id").attr("value") ?? "";
  const secretKey = $("body").attr("class")?.split("-")[1];
  const iv = $("div.wrapper").attr("class")?.split(" ")[1]?.split("-")[1];
  const secondKey = $("div.videocontent")
    .attr("class")
    ?.split(" ")[1]
    ?.split("-")[1];

  if (!secretKey || !iv || !secondKey) return "";
  const params = decryptData(data, secretKey, iv);
  const encId = encryptData(id, secretKey, iv);

  res = await fetch(
    process.env.NEXT_PUBLIC_ANIME_AJAX_URL +
      "?id=" +
      encId +
      "&alias=" +
      params,
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  );
  const encSource: { data: string } = await res.json();
  const source = decryptData(encSource.data, secondKey, iv);
  const pattern = /(https.+?m3u8)/g;
  const m3u8Links = source.match(pattern);
  // console.log(m3u8Links);
  let m3u8: string | undefined = "";
  m3u8Links?.forEach((link) => {
    if (link.includes("cache")) {
      m3u8 = link;
    }
  });
  if (m3u8 === "") {
    m3u8 = m3u8Links?.reduce((longest, current) => {
      return longest.length > current.length ? longest : current;
    });
  }
  // console.log(m3u8);
  return m3u8;
};
