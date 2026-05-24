import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { Card } from "../../components/Card/card";
import { CardContent } from "../../components/CardContent/cardcontent";
import { Button } from "../../components/Button/button";
import { ENDPOINTS, IMAGE_BASE_URL, BACKDROP_BASE_URL } from "../../components/api/tmdb";
import { useFetchTmdb } from "../../hooks/useFetchTmdb";

export default function HomePage() {
  const navigate = useNavigate();

  const { data: popularMoviesData, loading: loadingPopular } = useFetchTmdb(ENDPOINTS.popularMovies);
  const { data: topRatedMoviesData, loading: loadingTopRated } = useFetchTmdb(ENDPOINTS.topRatedMovies);
  const { data: popularTvData, loading: loadingTv } = useFetchTmdb(ENDPOINTS.popularTvShows);

  const loading = loadingPopular || loadingTopRated || loadingTv;

  const popularMovies = popularMoviesData?.results?.slice(0, 6) || [];
  const topRatedMovies = topRatedMoviesData?.results?.slice(0, 6) || [];
  const popularTvShows = popularTvData?.results?.slice(0, 6) || [];

  const featuredMovie = popularMoviesData?.results?.length
    ? popularMoviesData.results[Math.floor(Math.random() * popularMoviesData.results.length)]
    : null;

  return (
    <div className="w-screen flex flex-col bg-black text-white">

      {/* Hero Banner */}
      {featuredMovie && (
        <section
          className="w-full h-[100vh] relative bg-cover bg-center flex items-end p-8"
          style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${featuredMovie.backdrop_path})` }}
        >
          <div className="bg-black bg-opacity-60 p-6 rounded-xl max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold">{featuredMovie.title}</h1>
            <p className="mt-2 text-gray-300">{featuredMovie.overview}</p>
            <div className="flex items-center gap-2 mt-2">
              <AiFillStar className="text-yellow-400 text-xl" />
              <span>{featuredMovie.vote_average?.toFixed(1)}</span>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate(`/details/movie/${featuredMovie.id}`)}
              className="mt-4"
            >
              Vedi Dettagli
            </Button>
          </div>
        </section>
      )}

      {/* Film Popolari */}
      <section className="px-6 py-16 bg-gray-900">
        <h2 className="text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-lg">
          Film Popolari
        </h2>

        {loading ? <p>Caricamento...</p> : (
          <>
            <div className="flex flex-wrap gap-6 justify-center">
              {popularMovies.map(movie => (
                <Card
                  key={movie.id}
                  className="w-60 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
                  onClick={() => navigate(`/details/movie/${movie.id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-2 text-center">
                      <h3 className="font-bold">{movie.title}</h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <AiFillStar className="text-yellow-400" />
                        <span>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Button
                variant="contained"
                onClick={() => navigate("/movies")}
                className="px-6 py-3 text-lg"
              >
                Vedi tutti i film
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Serie TV Popolari */}
      <section className="px-6 py-16">
        <h2 className="text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-lg">
          Serie Tv Popolari
        </h2>

        {loading ? <p>Caricamento...</p> : (
          <>
            <div className="flex flex-wrap gap-6 justify-center">
              {popularTvShows.map(show => (
                <Card
                  key={show.id}
                  className="w-60 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
                  onClick={() => navigate(`/details/tv/${show.id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                      alt={show.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-2 text-center">
                      <h3 className="font-bold">{show.name}</h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <AiFillStar className="text-yellow-400" />
                        <span>{show.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Button
                variant="contained"
                onClick={() => navigate("/serie-tv")}
                className="px-6 py-3 text-lg"
              >
                Vedi tutte le serie
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Film Top Rated */}
      <section className="px-6 py-16 bg-gray-900">
        <h2 className="text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-lg">
          Film Top Rated
        </h2>

        {loading ? <p>Caricamento...</p> : (
          <>
            <div className="flex flex-wrap gap-6 justify-center">
              {topRatedMovies.map(movie => (
                <Card
                  key={movie.id}
                  className="w-60 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
                  onClick={() => navigate(`/details/movie/${movie.id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-2 text-center">
                      <h3 className="font-bold">{movie.title}</h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <AiFillStar className="text-yellow-400" />
                        <span>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Button
                variant="contained"
                onClick={() => navigate("/movies")}
                className="px-6 py-3 text-lg"
              >
                Vedi tutti i film
              </Button>
            </div>
          </>
        )}
      </section>

    </div>
  );
}
