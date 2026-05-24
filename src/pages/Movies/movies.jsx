import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card/card";
import { CardContent } from "../../components/CardContent/cardcontent";
import { fetchFromTmdb } from "../../components/api/tmdb";
import { AiFillStar } from "react-icons/ai";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadMovies = async (retry = false, signal) => {
    setLoading(true);
    setError(null); // reset errore
    try {
      const data = await fetchFromTmdb("discover/movie", { page, signal });
      if (signal.aborted) return; // se fetch annullato, non aggiornare lo stato

      setMovies((prev) => [...prev, ...data.results]);
      if (data.page >= data.total_pages) {
        setHasMore(false);
      }
    } catch (err) {
      if (err.name === "AbortError") return; // fetch cancellato, non fare niente
      console.error("Errore nel caricamento dei film:", err);
      setError("Errore nel caricamento dei film. Riprova.");
      if (!retry) {
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadMovies(false, controller.signal);

    return () => {
      controller.abort(); // cleanup: annulla fetch se il componente si smonta
    };
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    const controller = new AbortController();
    loadMovies(true, controller.signal);
  };

  return (
    <section className="w-screen min-h-screen bg-gradient-to-b from-black to-gray-900 px-6 py-16 pt-24 text-center">
      <h2 className="text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-lg">
        Film
      </h2>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            className="rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl cursor-pointer duration-300 bg-gray-900"
            onClick={() => navigate(`/details/movie/${movie.id}`)}
          >
            <CardContent className="p-0">
              <img
                src={
                  movie.poster_path
                    ? `${IMAGE_BASE_URL}${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                <p className="text-sm text-gray-400">
                  {movie.release_date?.split("-")[0] || "N/A"}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <AiFillStar className="text-yellow-400 text-lg" />
                  <span className="text-sm text-gray-300">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

export default Movies;
