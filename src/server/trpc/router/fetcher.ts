import { z } from "zod";
import { episode } from "../../../utils/fetcher/episode";
import { episodes } from "../../../utils/fetcher/episodes";
import { search } from "../../../utils/fetcher/search";

import { router, publicProcedure } from "../trpc";

export const fetcherRouter = router({
  search: publicProcedure
    .input(z.object({ text: z.string(), type: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await search(input.text, input.type),
      };
    }),
  episodes: publicProcedure
    .input(z.object({ path: z.string(), type: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await episodes(input.path, input.type),
      };
    }),
  episode: publicProcedure
    .input(z.object({ path: z.string(), type: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await episode(input.path, input.type),
      };
    }),
});
