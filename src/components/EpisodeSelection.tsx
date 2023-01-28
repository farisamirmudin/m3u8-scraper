import { useState } from "react";
import { useStore } from "../utils/store";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";

const EpisodeSelection = () => {
  const store = useStore();
  const serversQuery = trpc.fetcher.getServers.useMutation({ retry: 5 });
  const [toggle, setToggle] = useState(false);
  const [selected, setSelected] = useState<string>();
  return (
    <>
      <div
        className="relative cursor-pointer rounded-md bg-gray-100 px-3 py-1 text-center"
        onClick={() => setToggle((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <p>Episode {selected} </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        <div
          className={`${
            toggle ? "absolute" : "hidden"
          } top-10 right-0 z-10 max-h-80 w-20 overflow-auto rounded-md bg-gray-100`}
        >
          {store.episodes.map((episode, i) => (
            <div
              className="py-1 hover:bg-gray-200"
              key={i}
              onClick={async () => {
                setSelected(episode.title.split(" ").at(-1));
                const servers = await serversQuery.mutateAsync({
                  path: episode.path,
                });
                store.setServers({ title: episode.title, urls: servers.data! });
              }}
            >
              {episode.title.split(" ").at(-1)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EpisodeSelection;
