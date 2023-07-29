import { z } from "zod";

const videoSchema = z.object({
  title: z.string(),
  img: z.string(),
  path: z.string(),
});
export type Video = z.infer<typeof videoSchema>;
