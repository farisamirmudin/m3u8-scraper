import { load } from "cheerio";
import { decrypt, encrypt } from "../cipher";

export const episode = async (path: string, type: string) => {
  if (type === "drama") {
    const key = process.env.NEXT_PUBLIC_DRAMA_SECRET_KEY;
    const iv = process.env.NEXT_PUBLIC_DRAMA_IV;
    let res = await fetch(process.env.NEXT_PUBLIC_DRAMA_BASE_URL + path);
    const html = await res.text();
    const $ = load(html);

    const streaming = $("iframe").attr("src") ?? "";
    const id = new URL("https:" + streaming).searchParams.get("id");

    if (!key || !iv) return [];
    const encId = encrypt(id!, key, iv);

    res = await fetch(process.env.NEXT_PUBLIC_DRAMA_AJAX_URL + "?id=" + encId, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const encSource: { data: string } = await res.json();
    const source = decrypt(encSource.data, key, iv);
    const pattern = /(https.+?m3u8)/g;
    const links = source.match(pattern)?.toString();
    const linksSet = new Set(links?.split(","));
    return [...linksSet];
  }
  let res = await fetch(process.env.NEXT_PUBLIC_ANIME_BASE_URL + path.trim());
  let html = await res.text();
  let $ = load(html);
  const streaming = $("iframe").attr("src") ?? "";
  res = await fetch("https:" + streaming);
  html = await res.text();
  $ = load(html);
  // const serverwithtoken = $(`li[data-provider="serverwithtoken"]`).attr(
  //   "data-video"
  // );
  // res = await fetch(serverwithtoken!);
  // html = await res.text();
  // $ = load(html);
  const data = $(`script[data-name="episode"]`).attr("data-value") ?? "";
  const id = $("input#id").attr("value") ?? "";
  const secretKey = $("body").attr("class")?.split("-")[1];
  const iv = $("div.wrapper").attr("class")?.split(" ")[1]?.split("-")[1];
  const secondKey = $("div.videocontent")
    .attr("class")
    ?.split(" ")[1]
    ?.split("-")[1];

  if (!secretKey || !iv || !secondKey) return [];
  const params = decrypt(data, secretKey, iv);
  const encId = encrypt(id, secretKey, iv);

  res = await fetch(
    process.env.NEXT_PUBLIC_ANIME_AJAX_URL +
      "?id=" +
      encId +
      "&alias=" +
      params,
    {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  );
  const encSource: { data: string } = await res.json();
  const source = decrypt(encSource.data, secondKey, iv);
  const pattern = /(https.+?m3u8)/g;
  const links = source.match(pattern)?.toString();
  // console.log(source);
  const linksSet = new Set(links?.split(","));
  return [...linksSet];
};
