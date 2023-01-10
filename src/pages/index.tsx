import Head from "next/head";
import { useEffect, useState } from "react";

import { trpc } from "../utils/trpc";
import { useDebouncer } from "../utils/debouncerHook";
import Spinner from "../components/Spinner";
import DisplayShow from "../components/DisplayShow";
import SearchBar from "../components/SearchBar";
import ErrorComp from "../components/ErrorComp";
import EpisodeSelection from "../components/EpisodeSelection";
import Hls from "hls.js";

const Home = () => {
  const [text, setText] = useState("");
  const [shows, setShows] = useState([] as IShow[]);
  const [episodes, setEpisodes] = useState([] as IShow[]);
  const [servers, setServers] = useState<IServerProp>();
  const [queryError, setQueryError] = useState(false);

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
    setQueryError(false);
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
        setQueryError(true);
      }
    };
    fetchShows();
  }, [debounceText]);

  useEffect(() => {
    if (!servers) return;
    const media = document.getElementById("video") as HTMLVideoElement;
    const url = servers.urls[0] || "";
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(media);
    }
  }, [servers]);

  const handleSelectEpisode = async (i: number) => {
    const episode = episodes[i];
    if (!episode) return;
    try {
      const servers = await serversQuery.mutateAsync({
        path: episode.path,
      });
      setServers({ title: episode.title, urls: servers.data || [] });
    } catch {
      setQueryError(true);
    }
  };

  const handleSelectShow = async (show: IShow) => {
    try {
      const episodes = await episodesQuery.mutateAsync({
        path: show.path,
      });
      setEpisodes(episodes.data);
    } catch {
      setQueryError(true);
    }
  };
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
          {/* searchbar */}
          <SearchBar text={text} setText={setText} />

          {/* episodes */}
          {episodesQuery.isSuccess && episodes.length === 0 && (
            <p>No episodes are available.</p>
          )}
          {episodes.length !== 0 && (
            <EpisodeSelection
              episodes={episodes}
              handleSelectEpisode={handleSelectEpisode}
            />
          )}
        </div>
        {/* handling error and loading */}
        {(searchQuery.isLoading ||
          serversQuery.isLoading ||
          episodesQuery.isLoading) && <Spinner />}
        {(serversQuery.isError ||
          episodesQuery.isError ||
          searchQuery.isError ||
          queryError) && <ErrorComp />}

        {/* video player */}
        {servers && (
          <div>
            <p className="text-lg">{servers.title}</p>
            <video
              id="video"
              controls
              playsInline
              autoPlay
              crossOrigin="anonymous"
              className="h-auto w-full rounded-md"
            ></video>
          </div>
        )}

        {/* shows */}
        {searchQuery.isSuccess && shows.length === 0 && <p>No shows found.</p>}
        {shows.length !== 0 && (
          <DisplayShow shows={shows} handleSelectShow={handleSelectShow} />
        )}
      </main>
    </>
  );
};

export default Home;
