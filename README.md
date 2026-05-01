# Movie Database

A React movie search app built with Vite. It uses TMDB for movie data and Appwrite to track trending searches.

## Features

- Search movies with a debounced input
- View popular movies by default
- Open movie cards for detailed information
- See trending searches from Appwrite
- Responsive movie-database style UI

## Tech Stack

React, Vite, TMDB API, Appwrite, CSS

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

Run the app:

```bash
npm run dev
```

## Author

Author - Elyse Joyeux
