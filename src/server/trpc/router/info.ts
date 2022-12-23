import { z } from "zod";
import { episode } from "../../../utils/episode";
import { episodes } from "../../../utils/episodes";
import { search } from "../../../utils/search";

import { router, publicProcedure } from "../trpc";

export const infoRouter = router({
  search: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await search(input.text),
      };
    }),
  episodes: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await episodes(input.path),
      };
    }),
  episode: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await episode(input.path),
      };
    }),
});
