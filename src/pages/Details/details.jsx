import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useFavorites } from "../../context/FavoriteContext";
import { useFetchTmdb } from "../../hooks/useFetchTmdb";
import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from "../../components/api/tmdb";
import { useState, useEffect } from "react";

const Details = () => {
  const { type, id } = useParams();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [retryKey, setRetryKey] = useState(0);
  const [mounted, setMounted] = useState(true);

  const { data, loading, error } = useFetchTmdb(type && id ? `${type}/${id}` : null, retryKey);
  const { data: creditsData, error: creditsError } = useFetchTmdb(type && id ? `${type}/${id}/credits` : null, retryKey);

  // Mostra solo i primi 5 attori
  const cast = creditsData?.cast?.slice(0, 5) || [];
  const isFavorite = data && favorites.some(f => f.id === data.id && f.type === type);

  const handleFavoriteClick = () => {
    if (!data) return;
    isFavorite
      ? removeFavorite(data.id, type)
      : addFavorite({
          id: data.id,
          type,
          title: data.title,
          name: data.name,
          poster_path: data.poster_path,
          vote_average: data.vote_average,
          release_date: data.release_date,
          first_air_date: data.first_air_date,
        });
  };

  const handleRetry = () => setRetryKey(prev => prev + 1);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (loading)
    return <p className="text-white text-center mt-24 text-xl">Caricamento...</p>;

  if ((error || creditsError) && mounted) {
    return (
      <div className="pt-32 text-center text-red-500 px-6">
        <p className="text-lg">Si è verificato un errore durante il caricamento.</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (!data)
    return <p className="text-white text-center mt-24 text-xl">Dettagli non disponibili</p>;

  return (
    <div
      className="w-full min-h-screen text-white px-6 sm:px-8 lg:px-12 pt-28 pb-16 relative overflow-x-hidden"
      style={{
        backgroundImage: data.backdrop_path
          ? `url(${BACKDROP_BASE_URL}${data.backdrop_path})`
          : "linear-gradient(to right, #000000, #1a1a1a)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative flex flex-col md:flex-row items-start max-w-6xl mx-auto gap-10">

        {/* Poster */}
        <img
          src={
            data.poster_path
              ? `${IMAGE_BASE_URL}${data.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={data.title || data.name}
          className="mt-6 md:mt-0 w-52 sm:w-64 md:w-72 lg:w-80 rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0"
        />

        {/* Info */}
        <div className="flex-1 text-left w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {data.title || data.name}
          </h1>

          <p className="text-gray-300 mb-4 text-lg flex items-center gap-3 flex-wrap">
            {data.release_date?.split("-")[0] ||
              data.first_air_date?.split("-")[0] ||
              "N/A"}
            <span className="flex items-center gap-1 text-xl">
              <AiFillStar className="text-yellow-400" />
              {data.vote_average?.toFixed(1)}
            </span>
          </p>

          {/* Descrizione */}
          <p className="mb-6 text-gray-200 leading-relaxed text-base sm:text-lg whitespace-normal break-words">
            {data.overview || "Nessuna descrizione disponibile."}
          </p>

          <button
            onClick={handleFavoriteClick}
            className={`px-6 py-3 rounded-lg font-semibold text-base sm:text-lg transition ${
              isFavorite
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isFavorite ? "Rimuovi dai Preferiti" : "Aggiungi ai Preferiti"}
          </button>

          {/* Generi & Durata */}
          <div className="flex flex-wrap gap-3 mt-6">
            {data.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-red-600 px-3 py-1 rounded-full text-sm sm:text-base"
              >
                {genre.name}
              </span>
            ))}

            {data.runtime && (
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm sm:text-base">
                {data.runtime} min
              </span>
            )}
          </div>

          {/* Cast principale */}
          {cast.length > 0 && (
            <div className="mt-12"> {/* più margine top */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Cast principale
              </h2>

              <div className="flex overflow-x-auto gap-4 py-3 px-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex-shrink-0 w-24 sm:w-28 bg-gray-900 rounded-lg shadow-lg p-2 hover:scale-105 transition"
                  >
                    <img
                      src={
                        actor.profile_path
                          ? `${IMAGE_BASE_URL}${actor.profile_path}`
                          : "https://via.placeholder.com/100x150?text=No+Image"
                      }
                      alt={actor.name}
                      className="w-full h-32 sm:h-36 object-cover rounded-lg mb-2"
                    />
                    <span className="text-sm sm:text-base text-gray-200 block text-center">
                      {actor.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Details;
