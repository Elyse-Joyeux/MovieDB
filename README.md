# 🎬 MovieDB

A React movie search app built with Vite. Search thousands of movies powered by TMDB, track trending searches via Appwrite, and explore detailed movie info — all in a sleek dark UI.

---

## Features

- 🔍 **Debounced search** — searches as you type without hammering the API
- 🎥 **Popular movies** shown by default on load
- 📈 **Trending movies** — tracked in Appwrite based on what users search most
- 🃏 **Movie detail modal** — click any card to see ratings, genres, runtime, cast and more
- 📱 **Fully responsive** — works on mobile and desktop
- ⌨️ **Keyboard accessible** — press `Escape` to close the detail modal

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Styling | CSS (custom), Tailwind CSS |
| Movie data | [TMDB API](https://www.themoviedb.org/documentation/api) |
| Trending/DB | [Appwrite](https://appwrite.io) |
| Utilities | react-use (useDebounce) |

---

## Project Structure

```
src/
├── assets/               # Images and icons
├── components/
│   ├── MovieCard.jsx     # Individual movie card button
│   ├── Search.jsx        # Search input component
│   └── Spinner.jsx       # Animated loading indicator
├── App.jsx               # Main app logic and layout
├── appwrite.js           # Appwrite DB read/write helpers
├── index.css             # Global styles and design tokens
└── main.jsx              # React entry point
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get your API keys

**TMDB:**
1. Create a free account at [themoviedb.org](https://www.themoviedb.org)
2. Go to Settings → API → copy your **Bearer Token** (API Read Access Token)

**Appwrite:**
1. Create a free project at [appwrite.io](https://appwrite.io)
2. Create a database and a collection called `metrics`
3. Add the following attributes to the collection:

| Attribute | Type | Required |
|---|---|---|
| `searchTerm` | String (1000) | ✅ |
| `count` | Integer | ✅ |
| `poster_url` | URL | ✅ |
| `movie_id` | Integer | ✅ |
| `title` | String (500) | ✅ |

### 3. Create a `.env.local` file

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

### 4. Run the app

```bash
npm run dev
```

---

## How Trending Works

Every time a user searches for a movie:

1. The top result's `movie_id` is looked up in Appwrite
2. If it exists, the `count` is incremented
3. If not, a new document is created with `count: 1`
4. The top 5 most-searched movies are displayed in the **Trending** section

> Movies with no poster path are saved with a placeholder image URL to satisfy Appwrite's URL validation on the `poster_url` field.

---

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Author

**Elyse Joyeux**
