"use client";

import { useSetAtom } from "jotai";
import Link from "next/link";
import type { Video } from "@/typings/video";
import { historyList } from "../app/atom";

export default function Episode({ episode }: { episode: Video }) {
  const setDramas = useSetAtom(historyList);
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
