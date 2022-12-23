import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { trpc } from "../utils/trpc";
import ReactPlayer from "react-player";
import { toast, Toaster } from "react-hot-toast";
import { Video } from "../utils/search";

const Home = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [episodes, setEpisodes] = useState<Video[]>([]);
  const [hasWindow, setHasWindow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPageRef = useRef(100);

  const lastPostIndex = currentPage * postsPerPageRef.current;
  const firstPostIndex = lastPostIndex - postsPerPageRef.current;
  const [totalPage, setTotalPage] = useState(0);

  const searchQuery = trpc.info.search.useMutation();
  const videoQuery = trpc.info.episodes.useMutation();
  const episodeQuery = trpc.info.episode.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text === "") {
      return;
    }
    const notification = toast.loading("Searching Drama...");
    try {
      const videos = await searchQuery.mutateAsync({
        text,
      });
      setVideos(videos.data);
      setText("");
    } catch (error) {
      toast.error("Error encountered. Try again.");
    }
    toast.dismiss(notification);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <>
      <Toaster position="bottom-center" />
      <Head>
        <title>Watch KDrama</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto min-h-screen max-w-sm space-y-4 p-6 md:max-w-2xl lg:max-w-4xl">
        <p className="text-5xl font-bold">
          Watch <span className="text-indigo-600">Drama</span>
        </p>

        {/* searchbar */}
        <form className="flex gap-4" onSubmit={handleSubmit}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-md bg-slate-800 py-1 px-3 placeholder-slate-400 outline-none"
            type="text"
            placeholder="Search Drama"
          />
          <button className="border-b-2 border-indigo-600 transition-transform duration-200 ease-out hover:scale-110">
            Search
          </button>
        </form>

        {/* video player */}
        {hasWindow && url && (
          <section className="space-y-2">
            <p className="text-lg">{title}</p>
            <ReactPlayer
              width="100%"
              height="auto"
              playing
              controls
              onPlay={() =>
                toast.success("Enjoy!", {
                  duration: 5000,
                })
              }
              url={url}
            />
          </section>
        )}

        {/* episodes */}
        {episodes.length !== 0 && (
          <section className="episode-grid">
            {episodes.slice(firstPostIndex, lastPostIndex).map((episode, i) => (
              <button
                key={i}
                className="rounded-md bg-slate-800 p-2 text-xs transition-transform duration-200 ease-out hover:scale-110"
                onClick={async () => {
                  const notification = toast.loading("Playing...");
                  try {
                    const url = await episodeQuery.mutateAsync({
                      path: episode.path,
                    });
                    setUrl(url.data ?? "");
                    setTitle(episode.name);
                  } catch (error) {
                    toast.error("Error encountered. Try again.");
                  }
                  toast.dismiss(notification);
                }}
              >
                EP {episode.name.match(/Episode (.+)/)?.[1]}
              </button>
            ))}
          </section>
        )}

        {/* pagination */}
        {totalPage > 1 && (
          <section className="flex justify-center gap-2 py-8">
            {Array.from({ length: totalPage }).map((_, i) => (
              <button
                key={i}
                className="h-8 w-8 rounded-md bg-slate-800"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </section>
        )}

        {/* videos */}
        {videos.length !== 0 && (
          <section className="video-grid">
            {videos.map((video, i) => (
              <div
                key={i}
                className="cursor-pointer space-y-2"
                onClick={async () => {
                  const notification = toast.loading("Fetching Episodes...");
                  try {
                    const videos = await videoQuery.mutateAsync({
                      path: video.path,
                    });
                    setEpisodes(videos.data);
                    setTotalPage(
                      Math.ceil(videos.data.length / postsPerPageRef.current)
                    );
                  } catch (error) {
                    toast.error("Error encountered. Try again.");
                  }
                  toast.dismiss(notification);
                }}
              >
                <Image
                  className="h-[150px] w-full rounded-md object-cover"
                  src={video.img}
                  alt="banner"
                  width={100}
                  height={150}
                />
                <p className="text-xs">{video.name}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default Home;
