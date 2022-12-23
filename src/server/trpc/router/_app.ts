import { router } from "../trpc";
import { fetcherRouter } from "./fetcher";

export const appRouter = router({
  fetcher: fetcherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
