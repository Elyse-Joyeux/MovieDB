import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

//this function will save poster cards, movies in their places in database
//such that it will be much more easier to track it other times
export const updateSearchCount = async (searchTerm, movie) => {
  //1. Use appwrite SDK to check if the movie already exists in database
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", movie.id.toString()),
      Query.limit(100),
    ]);

    //2. if it does, update the count
    if (result.documents.length > 0) {
      const [doc, ...duplicateDocs] = result.documents;
      const duplicateCount = duplicateDocs.reduce(
        (total, duplicateDoc) => total + duplicateDoc.count,
        0,
      );

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + duplicateCount + 1,
        searchTerm,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });

      await Promise.allSettled(
        duplicateDocs.map((duplicateDoc) =>
          database.deleteDocument(DATABASE_ID, COLLECTION_ID, duplicateDoc.$id),
        ),
      );

      return true;

      //3. if it doesn't, create a new document with the search term and count as 1
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id.toString(),
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100),
      Query.orderDesc("count"),
    ]);

    const uniqueMovies = result.documents.reduce((movies, movie) => {
      const movieId = movie.movie_id?.toString();
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
      .sort((firstMovie, secondMovie) => secondMovie.count - firstMovie.count)
      .slice(0, 5);
  } catch (err) {
    console.error(err);
    return [];
  }
};
