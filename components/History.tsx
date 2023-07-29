"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { historyList } from "../app/atom";

export default function History() {
  const dramas = useAtomValue(historyList);
  const regex = /videos\/(.*)-episode-\d+/;

  if (dramas.length === 0) return null;
  return (
    <ul className="menu bg-base-200 rounded-box">
      <li>
        <h2 className="menu-title">History:</h2>
        <ul>
          {dramas?.map(({ title, path }, i) => (
            <li key={i}>
              <Link
                href={{
                  pathname: `/${(regex.exec(path) ?? [])[1]}`,
                  query: { episode: `${path.split("-").at(-1) ?? 1}` },
                }}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}
