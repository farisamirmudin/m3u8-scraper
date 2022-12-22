import { z } from "zod";
import { getEpisode } from "../../../utils/getEpisode";
import { getVideo } from "../../../utils/getVideo";
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
  getVideo: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await getVideo(input.path),
      };
    }),
  getEpisode: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      return {
        data: await getEpisode(input.path),
      };
    }),
});
