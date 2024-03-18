"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { getDramas } from "./actions";
import { episodePath } from "@/utils/helper";

function Submit() {
  const { pending } = useFormStatus();
  if (pending) {
    return <div className="">Searching...</div>;
  }
  return (
    <button className="h-4 w-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className=""
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}

export default function Home() {
  const [state, action] = useFormState(getDramas, {
    message: "",
    error: "",
    data: [],
  });

  return (
    <main>
      <div className="">
        <form action={action} className="">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search…"
              className=""
              name="keyword"
            />
            <Submit />
          </div>
        </form>
      </div>
      <ul>
        {state.data.map(({ title, path }, index) => (
          <li key={index}>
            <Link
              prefetch={false}
              key={title}
              href={{
                pathname: episodePath(path),
              }}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
