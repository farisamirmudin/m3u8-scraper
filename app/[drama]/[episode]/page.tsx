import { load } from "cheerio";
import DisplayLink from "./DisplayLink";
import { decrypt, encrypt } from "@/utils/cipher";

type Params = {
  params: {
    drama: string;
    episode: string;
  };
};

export default async function Page({ params: { drama, episode } }: Params) {
  // const urlToFetch = new URL(`${HOST}/api/dramas/episodes/servers`);
  // urlToFetch.searchParams.set("selection", `${drama}-episode-${episode}`);
  // const links = await fetch(urlToFetch)
  //   .then((res) => res.json())
  //   .then((data) => data as string[]);
  const key = "93422192433952489752342908585752";
  const iv = "9262859232435825";
  let res = await fetch(
    `https://asianplay.net/videos/${drama}-episode-${episode}`
  );
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
  const links = (source.match(/(https.+?m3u8)/g) ?? []) as string[];
  return (
    <div className="">
      <p className="text-lg">Links</p>
      <p className="mb-8 text-sm">
        Click on the link to copy to clipboard. You can then play it using vlc,
        mpv or iina.
      </p>
      <div className="flex gap-2">
        {links.map((link, i) => (
          <DisplayLink link={link} index={i} />
        ))}
      </div>
    </div>
  );
}
