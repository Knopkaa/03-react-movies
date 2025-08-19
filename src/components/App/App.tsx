import styles from "./App.module.css";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSearch = async (query: string) => {
    setMovies([]);
    setError(false);
    setIsLoading(true);

    try {
      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast("No movies found for your request.");
        setMovies([]);
        return;
      }

      setMovies(results);
    } catch (err) {
      setError(true);
      toast.error("Something went wrong. Try again later.");
    } finally {
      await delay(1000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
  handleSearch("popular");
}, []);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}