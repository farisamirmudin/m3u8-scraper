"use client";
import axios from "axios";
import { useSetAtom } from "jotai";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { foundList } from "./atom";

type Input = {
  dramaName: string;
};
export function Search() {
  const setDramaList = useSetAtom(foundList);

  const { register, handleSubmit } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = async ({ dramaName }) => {
    const res = await axios.get(`/api/dramas/search?keyword=${dramaName}`);
    setDramaList(res.data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-control">
      <div className="input-group">
        <input
          type="text"
          placeholder="Search…"
          className="input input-bordered w-full"
          {...register("dramaName")}
        />
        <button className="btn btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      </div>
    </form>
  );
}
