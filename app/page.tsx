"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { foundList } from "./atom";
import { Search } from "./Search";

export default function Home() {
  const [dramas] = useAtom(foundList);
  const regex = /videos\/(.*)-episode-\d+/;

  return (
    <main>
      <div className="flex-1">
        <Search />
      </div>
      {dramas.length > 0 && (
        <ul className="menu bg-base-200 rounded-box">
          <li>
            <h2 className="menu-title">Drama:</h2>
            <ul>
              {dramas?.map(({ title, path }) => (
                <li>
                  <Link
                    prefetch={false}
                    key={title}
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
      )}
    </main>
  );
}
