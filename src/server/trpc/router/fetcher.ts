import { z } from "zod";
import { getServers, getEpisodes, search } from "../../../utils/fetcher";

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
