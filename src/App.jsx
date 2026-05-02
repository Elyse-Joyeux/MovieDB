import { useState, useEffect, useCallback } from "react";
import Search from "./components/Search.jsx";
import heroBackground from "./assets/hero-background.png";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";
import poster from "./assets/poster-not-found.png";
import star from "./assets/star.svg";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  //Debounce the search term to prevent making too many API requests
  //by waiting the user to stop typing for 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const loadTrendingMovies = useCallback(async () => {
    try {
      const movies = await getTrendingMovies();
      console.log("Setting trending movies:", movies);
      setTrendingMovies(movies);
    } catch (err) {
      console.error(`Error fetching trending movies: ${err}`);
    }
  }, []);

  const fetchMovies = useCallback(
    async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();

        setMovieList(data.results || []);
        if (query && data.results.length === 0) {
          setErrorMessage("No movies found for that search term.");
          setMovieList([]);
          return;
        }
        if (query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
          // Auto-update trending movies after search
          await new Promise(resolve => setTimeout(resolve, 500));
          await loadTrendingMovies();
        }
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setErrorMessage("Error fetching movies, Please try again later");
      } finally {
        setIsLoading(false);
      }
    },
    [loadTrendingMovies],
  );

  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie);
    setDetailsError("");
    setIsDetailsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movie.id}?append_to_response=credits`,
        API_OPTIONS,
      );

      if (!response.ok) throw new Error("Failed to fetch movie details");

      const movieDetails = await response.json();
      setSelectedMovie({ ...movie, ...movieDetails });
    } catch (error) {
      console.error(`Error fetching movie details: ${error}`);
      setDetailsError("Could not load more details for this movie.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeMovieDetails = () => {
    setSelectedMovie(null);
    setDetailsError("");
  };

  useEffect(() => {
    // Fetch movies whenever the debounced search value changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm, fetchMovies]);

  useEffect(() => {
    // Load persisted trending movies once when the app starts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTrendingMovies();
  }, [loadTrendingMovies]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") closeMovieDetails();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedMoviePoster = selectedMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`
    : poster;

  const selectedMovieYear = selectedMovie?.release_date
    ? selectedMovie.release_date.split("-")[0]
    : "N/A";

  const selectedMovieRating = selectedMovie?.vote_average
    ? selectedMovie.vote_average.toFixed(1)
    : "N/A";

  const selectedMovieGenres = selectedMovie?.genres?.length
    ? selectedMovie.genres.map((genre) => genre.name).join(", ")
    : "Not listed";

  const selectedMovieRuntime = selectedMovie?.runtime
    ? `${selectedMovie.runtime} min`
    : "Not listed";

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src={heroBackground} alt="Hero background" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="trending">
          <h2>Trending Movies</h2>
          {trendingMovies.length > 0 ? (
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img
                    src={movie.poster_url && !movie.poster_url.includes('null') ? movie.poster_url : poster}
                    alt={movie.title || movie.searchTerm}
                    onError={(e) => { e.target.src = poster; }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No trending movies yet. Search for some movies to see trending.</p>
          )}
        </section>
        <section className="all-movies">
          <h2>All movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList
                .filter(movie => !trendingMovies.some(trending => trending.movie_id === movie.id))
                .map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelectMovie={handleSelectMovie}
                />
              ))}
            </ul>
          )}
        </section>

        <footer className="site-footer">
          <p>Copyright © {new Date().getFullYear()} Author - Elyse Joyeux</p>
        </footer>
      </div>

      {selectedMovie && (
        <div
          className="movie-details-backdrop"
          role="presentation"
          onClick={closeMovieDetails}
        >
          <article
            className="movie-details-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="movie-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-details"
              type="button"
              onClick={closeMovieDetails}
              aria-label="Close movie details"
            >
              x
            </button>

            <img
              className="details-poster"
              src={selectedMoviePoster}
              alt={selectedMovie.title}
            />

            <div className="details-content">
              <p className="details-kicker">
                {selectedMovieYear} / {selectedMovie.original_language}
              </p>
              <h2 id="movie-details-title">{selectedMovie.title}</h2>

              {selectedMovie.tagline && (
                <p className="tagline">{selectedMovie.tagline}</p>
              )}

              <div className="details-meta">
                <span className="details-rating">
                  <img src={star} alt="" />
                  {selectedMovieRating}
                </span>
                <span>{selectedMovieRuntime}</span>
                <span>{selectedMovie.vote_count || 0} votes</span>
              </div>

              {isDetailsLoading && (
                <p className="details-note">Loading more details...</p>
              )}
              {detailsError && <p className="details-error">{detailsError}</p>}

              <p className="details-overview">
                {selectedMovie.overview ||
                  "No overview available for this movie."}
              </p>

              <div className="details-grid">
                <div>
                  <span>Genres</span>
                  <p>{selectedMovieGenres}</p>
                </div>
                <div>
                  <span>Release date</span>
                  <p>{selectedMovie.release_date || "Not listed"}</p>
                </div>
                <div>
                  <span>Popularity</span>
                  <p>{selectedMovie.popularity?.toFixed(1) || "N/A"}</p>
                </div>
                <div>
                  <span>Original title</span>
                  <p>{selectedMovie.original_title || selectedMovie.title}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default App;
