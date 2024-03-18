import Link from "next/link";

import { startCase } from "lodash";

import { getDrama } from "@/app/actions";
import EpisodeSelection from "@/components/episode-selection";
import Player from "@/components/player";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string[] };
}) {
  const [drama, episode] = slug;
  const { episodes, servers } = await getDrama({ drama, episode });

  return (
    <div className="">
      <p className="">
        Install{" "}
        <Link
          className=""
          href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"
        >
          Allow CORS: Access-Control-Allow-Origin extension
        </Link>{" "}
        if video is not playing.
      </p>
      <label>
        {startCase(drama.replace("-", ""))}:
        <EpisodeSelection episodes={episodes} selectedEpisode={episode} />
      </label>
      <Player servers={servers} />
    </div>
  );
}
