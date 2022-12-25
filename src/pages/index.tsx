import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import { trpc } from "../utils/trpc";
import { toast, Toaster } from "react-hot-toast";
import { useDebouncer } from "../utils/debouncerHook";
import { Show } from "../../typings";
import Spinner from "../components/Spinner";
import EpisodesGrid from "../components/EpisodesGrid";
import SelectOption from "../components/SelectOption";
import Player from "../components/Player";
import DisplayShow from "../components/DisplayShow";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [text, setText] = useState("");
  const [isDrama, setIsDrama] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [episodes, setEpisodes] = useState<Show[]>([]);
  const [hasWindow, setHasWindow] = useState(false);
  const [selectedPagination, setSelectedPagination] = useState(1);
  const [columns, setColumns] = useState(0);
  const selectedShow = useRef("");
  const selectedEpisode = useRef("");
  const title = useRef("");
  const selectedServerRef = useRef(0);
  const serversRef = useRef<string[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>();
  const [corsError, setCorsError] = useState(false);

  // trpc queries
  const searchQuery = trpc.fetcher.search.useMutation({ retry: 3 });
  const episodesQuery = trpc.fetcher.getEpisodes.useMutation({ retry: 3 });
  const serversQuery = trpc.fetcher.getServers.useMutation({ retry: 3 });

  const debounceText = useDebouncer(text);

  const reset = () => {
    searchQuery.reset();
    episodesQuery.reset();
    serversQuery.reset();
    selectedShow.current = "";
    selectedEpisode.current = "";
    setColumns(0);
    setSelectedPagination(1);
    setEpisodes([]);
    setShows([]);
  };

  useEffect(() => {
    if (debounceText === "") {
      return;
    }
    reset();
    const fetchShows = async () => {
      try {
        const shows = await searchQuery.mutateAsync({
          text: debounceText,
          drama: isDrama,
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

  const handleSelectEpisode = async (episode: Show) => {
    try {
      const servers = await serversQuery.mutateAsync({
        path: episode.path,
        drama: isDrama,
      });
      title.current = episode.name;
      selectedEpisode.current = episode.path;
      selectedServerRef.current = 0;
      serversRef.current = servers.data;
      setSelectedServer(serversRef.current[selectedServerRef.current]);
      setCorsError(false);
    } catch {
      toast.error("Error");
    }
  };

  const handleSelectShow = async (show: Show) => {
    try {
      const episodes = await episodesQuery.mutateAsync({
        path: show.path,
        drama: isDrama,
      });
      selectedShow.current = show.path;
      setSelectedPagination(1);
      setColumns(0);
      setEpisodes(episodes.data);
    } catch {
      toast.error("Error");
    }
  };

  const episodesGridProps = {
    episodes,
    handleSelectEpisode,
    selectedEpisode,
    selectedPagination,
    setSelectedPagination,
    columns,
    setColumns,
  };

  const playerError = (error: any) => {
    if (error !== "hlsError") return;
    if (selectedServerRef.current === serversRef.current.length - 1) {
      setCorsError(true);
      return;
    }
    selectedServerRef.current += 1;
    setSelectedServer(serversRef.current[selectedServerRef.current]);
  };

  const playerProps = {
    title,
    selectedServer,
    playerError,
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <Head>
        <title>T3 Watch</title>
        <meta name="description" content="Watch Anime or Korean Drama" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto min-h-screen max-w-sm space-y-4 p-6 md:max-w-2xl lg:max-w-4xl">
        <p className="text-5xl font-bold">
          <span className="text-indigo-600">T3</span> Watch
        </p>

        {/* searchbar */}
        <SearchBar text={text} setText={setText} />

        {/* options */}
        <SelectOption isDrama={isDrama} setIsDrama={setIsDrama} />

        {/* video player */}
        {serversQuery.isLoading && <Spinner />}
        {serversQuery.isError && <p>Error</p>}
        {hasWindow && !corsError && serversRef.current && (
          <Player {...playerProps} />
        )}

        {/* episodes */}
        {episodesQuery.isLoading && <Spinner />}
        {episodesQuery.isError && <p>Error</p>}
        {serversQuery.isSuccess && episodes.length === 0 && (
          <p>No episodes are out yet.</p>
        )}
        {episodes.length !== 0 && <EpisodesGrid {...episodesGridProps} />}

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
