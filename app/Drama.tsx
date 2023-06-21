"use client";
import { Video } from "@/typings/video";
import Link from "next/link";

export default function Drama({ dramas }: { dramas: Video[] }) {
  return (
    <div className="flex flex-col gap-2">
      {dramas.map((drama) => (
        <Link href="/">{drama.title}</Link>
      ))}
    </div>
  );
}
