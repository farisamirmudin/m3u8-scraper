import { load } from "cheerio";
import { decrypt, encrypt } from "../cipher";

export const getServers = async (path: string, isDrama: boolean) => {
  if (isDrama) {
    const key = "93422192433952489752342908585752";
    const iv = "9262859232435825";
    let res = await fetch("http://asianplay.net" + path);
    const html = await res.text();
    const $ = load(html);

    const streaming = $("iframe").attr("src") ?? "";
    const id = new URL("https:" + streaming).searchParams.get("id");
    const encId = encrypt(id!, key, iv);

    res = await fetch(
      "https://asianplay.net/encrypt-ajax.php" + "?id=" + encId,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const encSource: { data: string } = await res.json();
    const source = decrypt(encSource.data, key, iv);
    const pattern = /(https.+?m3u8)/g;
    const links = source.match(pattern)?.toString();
    const linksSet = new Set(links?.split(","));
    return [...linksSet];
  }
  let res = await fetch("https://gogoanime.tel" + path.trim());
  let html = await res.text();
  let $ = load(html);
  const streaming = $("iframe").attr("src") ?? "";
  res = await fetch("https:" + streaming);
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

  if (!secretKey || !iv || !secondKey) return [];
  const params = decrypt(data, secretKey, iv);
  const encId = encrypt(id, secretKey, iv);

  res = await fetch(
    "https://gogohd.pro/encrypt-ajax.php?id=" + encId + "&alias=" + params,
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
  const linksSet = new Set(links?.split(","));
  return [...linksSet];
};
