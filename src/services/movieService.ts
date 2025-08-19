import axios from "axios";
import { type Movie } from "../types/movie";


const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await tmdbApi.get<FetchMoviesResponse>("search/movie", {
    params: { query },
  });

  return response.data.results;
};