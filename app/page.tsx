"use client";
import { Video } from "@/typings/video";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Input = {
  dramaName: string;
};

export default function Home() {
  const [dramaList, setDramaList] = useState<Video[]>();
  const { register, handleSubmit } = useForm<Input>();
  const regex = /videos\/(.*)-episode-\d+/;
  const onSubmit: SubmitHandler<Input> = (data) =>
    fetch(`/api/dramas/search?keyword=${data.dramaName}`)
      .then((res) => res.json())
      .then(setDramaList);
  return (
    <main className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          {...register("dramaName")}
          placeholder="Running man"
          className="text-black flex-1 px-4 py-2 rounded-lg outline-none shadow-2xl hover:shadow-violet-600/50"
        />
        <input
          type="submit"
          defaultValue="Search"
          className="cursor-pointer hover:bg-violet-600 px-4 rounded-lg"
        />
      </form>
      <div className="flex flex-col gap-2">
        {dramaList?.map((drama, i) => (
          <div className="" key={i}>
            <Link
              className="hover:bg-violet-600"
              href={{
                pathname: `/${(regex.exec(drama.path) ?? [])[1]}`,
                query: { episode: `${drama.path.split("-").at(-1) ?? 1}` },
              }}
            >
              {drama.title}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
