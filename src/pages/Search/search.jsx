import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFromTmdb } from "../../components/api/tmdb";
import { AiFillStar } from "react-icons/ai";

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0); // trigger per retry

  useEffect(() => {
    if (!query) return;

    let isMounted = true; // flag per cleanup

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dataMovies, dataTv] = await Promise.all([
          fetchFromTmdb(`search/movie`, { query }),
          fetchFromTmdb(`search/tv`, { query }),
        ]);

        if (!isMounted) return;

        const moviesWithType = dataMovies.results.map(item => ({ ...item, type: "movie" }));
        const tvWithType = dataTv.results.map(item => ({ ...item, type: "tv" }));
        const combined = [...moviesWithType, ...tvWithType];

        // Filtra risultati senza immagini
        const filtered = combined.filter(item => item.poster_path || item.backdrop_path);

        setResults(filtered);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setError("Si è verificato un errore durante la ricerca.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      // cleanup per evitare setState su componente smontato
      isMounted = false;
    };
  }, [query, retryKey]);

  if (!query) {
    return (
      <div className="pt-32 text-center text-white">
        <p>Inserisci qualcosa nella ricerca...</p>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-28 min-h-screen bg-black text-white text-center">
      <h2 className="text-3xl mb-6">
        Risultati per "<span className="text-red-600">{query}</span>"
      </h2>

      {loading && <p className="text-lg mt-5">Caricamento...</p>}

      {error && (
        <div className="text-red-500 mt-4">
          <p>{error}</p>
          <button
            onClick={() => setRetryKey(prev => prev + 1)}
            className="ml-2 px-4 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            Riprova
          </button>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-lg mt-5">Nessun risultato trovato.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {results.map((item) => {
            const image = item.poster_path
              ? `${IMAGE_BASE_URL}${item.poster_path}`
              : item.backdrop_path
              ? `${IMAGE_BASE_URL}${item.backdrop_path}`
              : "https://via.placeholder.com/500x750?text=Nessuna+Immagine";

            const title = item.title || item.name || "Titolo non disponibile";

            return (
              <div
                key={item.id + "-" + item.type}
                onClick={() => navigate(`/details/${item.type}/${item.id}`)}
                className="cursor-pointer w-44 transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-2 text-gray-300 text-sm font-semibold">{title}</div>

                <div className="flex items-center justify-center gap-1 mt-1 text-yellow-400 text-sm">
                  <AiFillStar />
                  <span>{item.vote_average?.toFixed(1) || "N/A"}</span>
                </div>

                <div className="text-gray-500 text-xs mt-1">
                  {(item.type === "movie"
                    ? item.release_date?.split("-")[0]
                    : item.first_air_date?.split("-")[0]) || "N/A"}{" "}
                  • {item.type === "movie" ? "Film" : "Serie TV"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
