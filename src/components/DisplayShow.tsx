import Image from "next/image";
import { useStore } from "../utils/store";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";

const DisplayShow = () => {
  const store = useStore();
  const episodesQuery = trpc.fetcher.getEpisodes.useMutation({ retry: 5 });
  return (
    <>
      <div className="video-grid">
        {store.shows.map((show, i) => (
          <div
            key={i}
            className={`cursor-pointer space-y-2 transition-transform duration-200 ease-out hover:scale-105`}
            onClick={async () => {
              const episodes = await episodesQuery.mutateAsync({
                path: show.path,
              });
              store.setEpisodes(episodes.data);
            }}
          >
            <Image
              className="h-36 w-full rounded-md object-cover"
              src={show.img}
              width={400}
              height={800}
              alt="banner"
            />
            <p className={`text-center text-xs`}>{show.title}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DisplayShow;
