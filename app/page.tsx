import { Video } from "@/typings/video";
import Link from "next/link";

export default async function Home() {
  const urlToFetch = new URL("http://localhost:3333/api/dramas/search");
  urlToFetch.searchParams.set("keyword", "silence");
  const res = await fetch(urlToFetch);
  const dramas = (await res.json()) as Video[];
  const regex = /videos\/(.*)-episode-\d+/;
  return (
    <main className="">
      <p>Search</p>
      <div className="flex flex-col gap-2">
        {dramas.map((drama) => (
          <div className="">
            <Link
              href={`/${(regex.exec(drama.path) ?? [])[1]}/${
                drama.path.split("-").at(-1) ?? 1
              }`}
            >
              {drama.title}
            </Link>
            <p>{drama.path}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
