export const episodePath = (videoPath: string) => {
  const arr = /\/videos\/(.*)-episode-(\d+)/.exec(videoPath);
  if (!arr) return "#";

  const title = arr[1];
  const episode = arr[2];
  return `/${title}/${episode}`;
};
