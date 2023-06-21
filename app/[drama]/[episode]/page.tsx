type Params = {
  params: {
    drama: string;
    episode: string;
  };
};
export default async function Page({ params: { drama, episode } }: Params) {
  const urlToFetch = new URL(
    "http://localhost:3333/api/dramas/episodes/servers"
  );
  urlToFetch.searchParams.set("selection", `${drama}-episode-${episode}`);
  const res = await fetch(urlToFetch);
  const links = (await res.json()) as string[];
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {(links ?? []).map((link) => (
          <p>{link}</p>
        ))}
      </div>
    </div>
  );
}
