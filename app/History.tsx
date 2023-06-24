"use client";

import { Video } from "@/typings/video";
import { atom, useAtom } from "jotai";
import Link from "next/link";

export const historyList = atom<Video[]>([]);
export default function History() {
  const [dramas] = useAtom(historyList);
  const regex = /videos\/(.*)-episode-\d+/;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg">Watch History</p>
      {dramas.map((drama, i) => (
        <Link
          key={i}
          className="hover:bg-violet-600"
          href={{
            pathname: `/${(regex.exec(drama.path) ?? [])[1]}`,
            query: { episode: `${drama.path.split("-").at(-1) ?? 1}` },
          }}
        >
          {drama.title}
        </Link>
      ))}
    </div>
  );
}
