import poster from "../assets/poster-not-found.png";
import star from "../assets/star.svg";

const MovieCard = ({
  movie,
  onSelectMovie,
}) => {
  const { title, vote_average, poster_path, original_language, release_date } =
    movie;

  return (
    <button
      className="movie-card"
      type="button"
      onClick={() => onSelectMovie(movie)}
      aria-label={`View details for ${title}`}
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : `${poster}`
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src={star} alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default MovieCard;
