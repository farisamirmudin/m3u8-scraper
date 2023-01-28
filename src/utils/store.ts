import { z } from "zod";
import { create } from "zustand";

const serverScheme = z.object({
  title: z.string(),
  urls: z.string().array(),
});
export const videoScheme = z.object({
  title: z.string(),
  img: z.string(),
  path: z.string(),
});
const storeScheme = z.object({
  // queryLoading: z.boolean(),
  // setqueryLoading: z.function().args(z.boolean()),
  text: z.string(),
  setText: z.function().args(z.string()),
  shows: z.array(videoScheme),
  setShows: z.function().args(z.array(videoScheme)),
  episodes: z.array(videoScheme),
  setEpisodes: z.function().args(z.array(videoScheme)),
  servers: z.union([serverScheme, z.undefined()]),
  setServers: z.function().args(serverScheme),
  queryError: z.boolean(),
  setQueryError: z.function().args(z.boolean()),
  reset: z.function(),
});

export const useStore = create<z.infer<typeof storeScheme>>((set) => ({
  // queryLoading: false,
  // setqueryLoading: (queryLoading) =>
  //   set((state) => ({ ...state, queryLoading })),
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
      queryLoading: false,
    })),
}));
