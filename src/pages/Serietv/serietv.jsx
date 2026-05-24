import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card/card";
import { CardContent } from "../../components/CardContent/cardcontent";
import { fetchFromTmdb } from "../../components/api/tmdb";
import { AiFillStar } from "react-icons/ai";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Serietv = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadShows = async (retry = false, signal) => {
    if (!retry) setError(null); // reset errore solo se non è retry
    setLoading(true);
    try {
      const data = await fetchFromTmdb("discover/tv", { page, signal });
      if (signal.aborted) return; // se fetch annullato, non aggiornare lo stato

      setTvShows((prev) => [...prev, ...data.results]);
      if (data.page >= data.total_pages) setHasMore(false);
    } catch (err) {
      if (err.name === "AbortError") return; // fetch cancellato, non fare niente
      console.error("Errore nel caricamento serie TV:", err);
      setError("Errore nel caricamento delle serie TV. Riprova.");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadShows(false, controller.signal);

    return () => {
      controller.abort(); // cleanup: annulla fetch se il componente si smonta
    };
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  const handleRetry = () => {
    const controller = new AbortController();
    loadShows(true, controller.signal);
  };

  return (
    <section className="w-screen min-h-screen bg-gradient-to-b from-black to-gray-900 px-6 py-16 pt-24 text-center">
      <h2 className="text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-lg">
        Serie TV
      </h2>

      {/* Error message */}
      {error && (
        <div className="text-red-500 mb-6">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Riprova
          </button>
        </div>
      )}

      {/* Grid serie TV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {tvShows.map((show) => (
          <Card
            key={show.id}
            className="rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl cursor-pointer duration-300 bg-gray-900"
            onClick={() => navigate(`/details/tv/${show.id}`)}
          >
            <CardContent className="p-0">
              <img
                src={
                  show.poster_path
                    ? `${IMAGE_BASE_URL}${show.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={show.name}
                className="w-full h-96 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-white">{show.name}</h3>
                <p className="text-sm text-gray-400">
                  {show.first_air_date?.split("-")[0] || "N/A"}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <AiFillStar className="text-yellow-400 text-lg" />
                  <span className="text-sm text-gray-300">
                    {show.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottone Carica di più */}
      {hasMore && !error && (
        <button
          onClick={handleLoadMore}
          className="mt-12 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Caricamento..." : "Carica di più"}
        </button>
      )}
    </section>
  );
};

export default Serietv;
