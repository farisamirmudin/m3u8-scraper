"use client";

import { type Video } from "@/typings/video";
import { useRouter } from "next/navigation";
import { episodePath } from "@/utils/helper";

export default function EpisodeSelection({
  episodes,
  selectedEpisode,
}: {
  episodes: Video[];
  selectedEpisode: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selectedEpisode}
      onChange={(e) => router.push(episodePath(e.currentTarget.value))}
    >
      {episodes.map((episode, index) => (
        <option key={index} value={episode.path}>
          {episode.path.split("-").at(-1) ?? 1}
        </option>
      ))}
    </select>
  );
}
