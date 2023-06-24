"use client";

import { useAtom } from "jotai";
import { historyList } from "../History";
import Link from "next/link";
import { Video } from "@/typings/video";

export default function DisplayShow({ ep }: { ep: Video }) {
  const [_, setDramas] = useAtom(historyList);
  const regex = /videos\/(.*)-episode-\d+/;
  const dramaName = (regex.exec(ep.path) ?? [])[1];
  const selectedEpisode = ep.title.split(" ").at(-1) ?? "1";
  return (
    <Link
      onClick={() => setDramas((prev) => [...prev, ep])}
      href={`/${dramaName}/${selectedEpisode}`}
      className="text-center hover:bg-violet-600"
    >
      {selectedEpisode}
    </Link>
  );
}
