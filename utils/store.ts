import { z } from "zod";
import { create } from "zustand";

const serverSchema = z.object({
  title: z.string(),
  urls: z.string().array(),
});
export const videoSchema = z.object({
  title: z.string(),
  img: z.string(),
  path: z.string(),
});
const storeSchema = z.object({
  text: z.string(),
  setText: z.function().args(z.string()),
  shows: z.array(videoSchema),
  setShows: z.function().args(z.array(videoSchema)),
  episodes: z.array(videoSchema),
  setEpisodes: z.function().args(z.array(videoSchema)),
  servers: z.union([serverSchema, z.undefined()]),
  setServers: z.function().args(serverSchema),
  queryError: z.boolean(),
  setQueryError: z.function().args(z.boolean()),
  reset: z.function(),
});

export const useStore = create<z.infer<typeof storeSchema>>((set) => ({
  text: "",
  setText: (text) => set((state) => ({ ...state, text })),
  shows: [],
  setShows: (shows) => set((state) => ({ ...state, shows })),
  episodes: [],
  setEpisodes: (episodes) => set((state) => ({ ...state, episodes })),
  servers: undefined,
  setServers: (servers) => set((state) => ({ ...state, servers })),
  queryError: false,
  setQueryError: (queryError) => set((state) => ({ ...state, queryError })),
  reset: () =>
    set((state) => ({
      ...state,
      text: "",
      shows: [],
      episodes: [],
      servers: undefined,
      queryError: false,
    })),
}));
