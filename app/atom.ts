import { Video } from "@/typings/video";
import { atom } from "jotai";

export const historyList = atom<Video[]>([]);
export const foundList = atom<Video[]>([]);
