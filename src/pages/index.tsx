import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";

import { trpc } from "../utils/trpc";
import { toast, Toaster } from "react-hot-toast";
import { useDebouncer } from "../utils/debouncerHook";
import Spinner from "../components/Spinner";
import Player from "../components/Player";
import DisplayShow from "../components/DisplayShow";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [text, setText] = useState("");
  const [shows, setShows] = useState<Show[]>([]);
  const [episodes, setEpisodes] = useState<Show[]>([]);
  const [hasWindow, setHasWindow] = useState(false);
  const [playerProp, setPlayerProp] = useState<PlayerProps>();

  // trpc queries
  const searchQuery = trpc.fetcher.search.useMutation({ retry: 5 });
  const episodesQuery = trpc.fetcher.getEpisodes.useMutation({ retry: 5 });
  const serversQuery = trpc.fetcher.getServers.useMutation({ retry: 5 });

  const debounceText = useDebouncer(text);

  const reset = () => {
    searchQuery.reset();
    episodesQuery.reset();
    serversQuery.reset();
    setEpisodes([]);
    setShows([]);
  };

  useEffect(() => {
    if (debounceText === "") return;
    reset();
    const fetchShows = async () => {
      try {
        const shows = await searchQuery.mutateAsync({
          text: debounceText,
        });
        setShows(shows.data);
      } catch {
        toast.error("Error");
      }
    };
    fetchShows();
  }, [debounceText]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasWindow(true);
  }, []);

  const handleSelectEpisode = async (e: ChangeEvent<HTMLSelectElement>) => {
    const episode = episodes[parseInt(e.target.value)];
    if (!episode) return;
    try {
      const servers = await serversQuery.mutateAsync({
        path: episode.path,
      });
      setPlayerProp({ title: episode.title, servers: servers.data! });
    } catch {
      toast.error("Error");
    }
  };

  const handleSelectShow = async (show: Show) => {
    try {
      const episodes = await episodesQuery.mutateAsync({
        path: show.path,
      });
      setEpisodes(episodes.data);
    } catch {
      toast.error("Error");
    }
  };
  return (
    <>
      <Toaster position="bottom-center" />
      <Head>
        <title>Alchemy</title>
        <meta name="description" content="Watch Korean Drama" />
        <link rel="icon" href="/alogo.svg" />
      </Head>
      <main className="mx-auto min-h-screen max-w-sm space-y-4 px-6 py-12 md:max-w-2xl lg:max-w-4xl">
        <p className="text-5xl font-bold">
          <span className="text-indigo-600">Al</span>chemy
        </p>

        {/* searchbar */}
        <SearchBar text={text} setText={setText} />

        {/* video player */}
        {serversQuery.isLoading && <Spinner />}
        {serversQuery.isError && <p>Error</p>}
        {hasWindow && playerProp && <Player {...playerProp} />}

        {/* episodes */}
        {episodesQuery.isLoading && <Spinner />}
        {episodesQuery.isError && <p>Error</p>}
        {episodesQuery.isSuccess && episodes.length === 0 && (
          <p>No episodes are available.</p>
        )}
        {episodes.length !== 0 && (
          <>
            <label>Select Episode:</label>
            <select
              className="mx-2 border-b-2 border-indigo-600 bg-transparent pr-2 outline-none"
              onChange={(e) => handleSelectEpisode(e)}
            >
              <option></option>
              {episodes.map((episode, i) => (
                <option key={i} value={i}>
                  {episode.title.split(" ").at(-1)}
                </option>
              ))}
            </select>
          </>
        )}

        {/* shows */}
        {searchQuery.isLoading && <Spinner />}
        {searchQuery.isError && <p>Error</p>}
        {searchQuery.isSuccess && shows.length === 0 && <p>No shows found.</p>}
        {shows.length !== 0 && (
          <DisplayShow shows={shows} handleSelectShow={handleSelectShow} />
        )}
      </main>
    </>
  );
};

export default Home;
