// src/components/api/tmdb.js

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = '97bb4df7c0f0311371e40b55e3816b42';

// Base URL per immagini
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Funzione riutilizzabile per fetch da TMDB
export const fetchFromTmdb = async (endpoint, params = {}) => {
  const defaultParams = {
    api_key: TMDB_API_KEY,
    language: 'it-IT',
    ...params,
  };

  const queryString = new URLSearchParams(defaultParams).toString();
  const url = `${TMDB_BASE_URL}/${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ERRORE TMDB (Verifica la chiave API!):", errorData);
      throw new Error(`Errore HTTP ${response.status}: ${errorData.status_message}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore generico durante il fetch:", error);
    return { results: [] };
  }
};

// Endpoint disponibili
export const ENDPOINTS = {
  popularMovies: 'movie/popular',
  topRatedMovies: 'movie/top_rated',
  popularTvShows: 'tv/popular',
  topRatedTvShows: 'tv/top_rated',
  trendingAll: 'trending/all/week',
  searchMulti: 'search/multi', // ricerca universale
};
