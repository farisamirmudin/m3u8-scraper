"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { historyList } from "./atom";

export default function History() {
  const [dramas] = useAtom(historyList);
  const regex = /videos\/(.*)-episode-\d+/;

  return (
    <ul className="menu bg-base-200 rounded-box">
      <li>
        <h2 className="menu-title">History:</h2>
        <ul>
          {dramas?.map(({ title, path }, i) => (
            <li>
              <Link
                key={i}
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
