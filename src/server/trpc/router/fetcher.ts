import { z } from "zod";
import { episode } from "../../../utils/fetcher/episode";
import { episodes } from "../../../utils/fetcher/episodes";
import { search } from "../../../utils/fetcher/search";

import { router, publicProcedure } from "../trpc";

export const fetcherRouter = router({
  search: publicProcedure
    .input(z.object({ text: z.string(), drama: z.boolean() }))
    .mutation(async ({ input }) => {
      return {
        data: await search(input.text, input.drama),
      };
    }),
  episodes: publicProcedure
    .input(z.object({ path: z.string(), drama: z.boolean() }))
    .mutation(async ({ input }) => {
      return {
        data: await episodes(input.path, input.drama),
      };
    }),
  episode: publicProcedure
    .input(z.object({ path: z.string(), drama: z.boolean() }))
    .mutation(async ({ input }) => {
      return {
        data: await episode(input.path, input.drama),
      };
    }),
});
