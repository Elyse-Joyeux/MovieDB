import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

// Returns a valid poster URL or a placeholder if the path is missing
const getPosterUrl = (posterPath) => {
  if (!posterPath || posterPath === "null") {
    return "https://placehold.co/500x750?text=No+Poster";
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

// Updates the search count for a movie, or creates a new entry if it doesn't exist
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const movieId = Number(movie.id);
    const posterUrl = getPosterUrl(movie.poster_path);

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", movieId),
      Query.limit(100),
    ]);

    if (result.documents.length > 0) {
      const [doc, ...duplicateDocs] = result.documents;
      const duplicateCount = duplicateDocs.reduce(
        (total, d) => total + (d.count || 0), 0
      );

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count || 0) + duplicateCount + 1,
        searchTerm,
        title: movie.title,
        poster_url: posterUrl,
      });

      await Promise.allSettled(
        duplicateDocs.map(d =>
          database.deleteDocument(DATABASE_ID, COLLECTION_ID, d.$id)
        )
      );
    } else {
      // Create a new document for this movie
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movieId,
        title: movie.title,
        poster_url: posterUrl,
      });
    }
    return true;
  } catch (err) {
    console.error("Error updating search count:", JSON.stringify(err));
    return false;
  }
};

// Fetches the top 5 trending movies ordered by search count
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100),
      Query.orderDesc("count"),
    ]);

    const uniqueMovies = result.documents.reduce((movies, movie) => {
      const movieId = movie.movie_id;
      if (!movieId) return movies;

      const existingMovie = movies.get(movieId);
      if (existingMovie) {
        movies.set(movieId, {
          ...existingMovie,
          count: existingMovie.count + movie.count,
        });
        return movies;
      }

      movies.set(movieId, movie);
      return movies;
    }, new Map());

    return Array.from(uniqueMovies.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  } catch (err) {
    console.error("Error fetching trending movies:", JSON.stringify(err));
    return [];
  }
};