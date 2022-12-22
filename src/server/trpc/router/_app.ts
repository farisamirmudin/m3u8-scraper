import { router } from "../trpc";
import { infoRouter } from "./info";

export const appRouter = router({
  info: infoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
