import {
  useEffect,
  useRef,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from "react";
import { Show } from "../../typings";

interface Props {
  episodes: Show[];
  handleSelectEpisode: (episode: Show) => Promise<void>;
  selectedEpisode: MutableRefObject<string>;
  selectedPagination: number;
  setSelectedPagination: Dispatch<SetStateAction<number>>;
  columns: number;
  setColumns: Dispatch<SetStateAction<number>>;
}

const EpisodesGrid = ({
  episodes,
  handleSelectEpisode,
  selectedEpisode,
  selectedPagination,
  setSelectedPagination,
  columns,
  setColumns,
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const buttonWidth = 60;
  const gap = 24;
  const rows = useRef(10);
  const totalPagination = useRef(0);
  const buttonsPerPagination = useRef(0);
  const startIndex = useRef(0);
  const lastIndex = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const divWidth = gridRef.current?.offsetWidth ?? 360;
      const columns = Math.floor(divWidth / (buttonWidth + gap));
      buttonsPerPagination.current = columns * rows.current;
      totalPagination.current = Math.ceil(
        episodes.length / buttonsPerPagination.current
      );
      lastIndex.current = buttonsPerPagination.current * selectedPagination;
      startIndex.current = lastIndex.current - buttonsPerPagination.current;

      setColumns(columns);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [episodes]);

  const handleChangePagination = (symbol: string) => {
    if (selectedPagination === (symbol === "<" ? 1 : totalPagination.current))
      return;
    lastIndex.current =
      buttonsPerPagination.current *
      (symbol === "<" ? selectedPagination - 1 : selectedPagination + 1);
    startIndex.current = lastIndex.current - buttonsPerPagination.current;
    setSelectedPagination((prev) => (symbol === "<" ? prev - 1 : prev + 1));
  };

  return (
    <section>
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(${buttonWidth}px, 1fr))`,
          gap: `${gap}px`,
          paddingTop: "16px",
        }}
      >
        {episodes
          .slice(startIndex.current, lastIndex.current)
          .map((episode, i) => (
            <button
              onClick={() => handleSelectEpisode(episode)}
              className={`${
                selectedEpisode.current === episode.path &&
                "border-[2px] border-indigo-600"
              } rounded-md bg-slate-800 py-2 text-xs transition-transform duration-200 ease-out hover:scale-105`}
              key={i}
            >{`EP ${episode.name.split(" ").at(-1)}`}</button>
          ))}
      </div>

      {/* pagination */}
      {totalPagination.current > 1 && (
        <section className="flex justify-center gap-8 py-4">
          <button
            disabled={selectedPagination === 1}
            className="text-2xl enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleChangePagination("<")}
          >
            {"<"}
          </button>
          <button
            disabled={selectedPagination === totalPagination.current}
            className="text-2xl enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleChangePagination(">")}
          >
            {">"}
          </button>
        </section>
      )}
    </section>
  );
};
export default EpisodesGrid;
