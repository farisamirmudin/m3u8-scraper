"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { Video } from "@/typings/video";
import { historyList } from "../atom";

export default function DisplayShow({ episode }: { episode: Video }) {
  const [_, setDramas] = useAtom(historyList);
  const regex = /videos\/(.*)-episode-\d+/;
  const dramaName = (regex.exec(episode.path) ?? [])[1];
  const selectedEpisode = episode.title.split(" ").at(-1) ?? "1";
  return (
    <Link
      prefetch={false}
      onClick={() => setDramas((prev) => [...prev, episode])}
      href={`/${dramaName}/${selectedEpisode}`}
    >
      {selectedEpisode}
    </Link>
  );
}
