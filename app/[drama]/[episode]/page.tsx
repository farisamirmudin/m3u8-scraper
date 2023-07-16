import { load } from "cheerio";
import { decrypt, encrypt } from "@/utils/cipher";
import Player from "./Player";
import Link from "next/link";
import axios from "axios";

type Params = {
  params: {
    drama: string;
    episode: string;
  };
};

export default async function Page({ params: { drama, episode } }: Params) {
  const key = process.env.NEXT_PUBLIC_KEY ?? "";
  const iv = process.env.NEXT_PUBLIC_IV ?? "";
  let res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${drama}-episode-${episode}`
  );
  const $ = load(res.data ?? "");

  const streaming = $("iframe").attr("src") ?? "";
  const id = new URL("https:" + streaming).searchParams.get("id") ?? "";
  const encId = encrypt(id, key, iv);
  res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/encrypt-ajax.php?id=${encId}`,
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  );
  const enc = res.data as { data: string };
  const source = decrypt(enc.data, key, iv);
  const links = (source.match(/(https.+?m3u8)/g) ?? []) as string[];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-center">
        Install{" "}
        <Link
          className="underline"
          href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"
        >
          Allow CORS: Access-Control-Allow-Origin extension
        </Link>{" "}
        if video is not playing.
      </p>
      <Player links={links} />
    </div>
  );
}
