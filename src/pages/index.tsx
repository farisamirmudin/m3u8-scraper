import Head from "next/head";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";
import { useDebouncer } from "../utils/debouncerHook";
import Spinner from "../components/Spinner";
import DisplayShow from "../components/DisplayShow";
import ErrorComp from "../components/ErrorComp";
import EpisodeSelection from "../components/EpisodeSelection";
import SearchBar from "../components/SearchBar";
import ReactPlayer from "react-player/lazy";
import { useStore } from "../utils/store";

const Home = () => {
  const store = useStore();
  const searchQuery = trpc.fetcher.search.useMutation({ retry: 5 });
  const debounceText = useDebouncer(store.text);

  useEffect(() => {
    if (debounceText === "") return;
    store.reset();
    const fetchShows = async () => {
      const shows = await searchQuery.mutateAsync({
        text: debounceText,
      });
      store.setShows(shows.data);
    };
    fetchShows();
  }, [debounceText]);

  return (
    <>
      <Head>
        <title>Alchemy Watch</title>
        <meta name="description" content="Watch Korean Drama" />
        <link rel="icon" href="/alogo.svg" />
      </Head>
      <main className="mx-auto min-h-screen max-w-sm space-y-4 px-6 py-12 md:max-w-2xl lg:max-w-4xl">
        <p className="text-4xl">
          <span className="text-indigo-500">Alchemy</span>Watch
        </p>

        <div className="flex items-center gap-4">
          <SearchBar />
          {searchQuery.isLoading && <Spinner />}
          {store.episodes.length !== 0 && <EpisodeSelection />}
        </div>

        {store.servers && (
          <div>
            <p className="text-lg">{store.servers.title}</p>
            <ReactPlayer
              url={store.servers.urls[0]}
              controls
              playing
              playsinline
              width="100%"
              height="auto"
            />
          </div>
        )}

        {/* shows */}
        {searchQuery.isSuccess && store.shows.length === 0 && (
          <p>No shows found.</p>
        )}
        {store.shows.length !== 0 && <DisplayShow />}
      </main>
    </>
  );
};

export default Home;
