"use client";
import Drama from "./Drama";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Params = {
  params: {
    drama: string;
    episode: string;
  };
};
const queryClient = new QueryClient();
export default function Screen({ params: { drama, episode } }: Params) {
  return (
    <QueryClientProvider client={queryClient}>
      <Drama drama={drama} episode={episode} />
    </QueryClientProvider>
  );
}
