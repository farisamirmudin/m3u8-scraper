import { z } from "zod";
import { getServers } from "../../../utils/fetcher/getServers";
import { getEpisodes } from "../../../utils/fetcher/getEpisodes";
import { search } from "../../../utils/fetcher/search";

import { router, publicProcedure } from "../trpc";

export const fetcherRouter = router({
  search: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await search(input.text),
      };
    }),
  getEpisodes: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await getEpisodes(input.path),
      };
    }),
  getServers: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await getServers(input.path),
      };
    }),
});
