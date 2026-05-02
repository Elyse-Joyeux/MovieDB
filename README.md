🎬 MovieDB
A React movie search app built with Vite. Search thousands of movies powered by TMDB, track trending searches via Appwrite, and explore detailed movie info — all in a sleek dark UI.

Features

🔍 Debounced search — searches as you type without hammering the API
🎥 Popular movies shown by default on load
📈 Trending movies — tracked in Appwrite based on what users search most
🃏 Movie detail modal — click any card to see ratings, genres, runtime, cast and more
📱 Fully responsive — works on mobile and desktop
⌨️ Keyboard accessible — press Escape to close the detail modal


Tech Stack
LayerTechnologyFrontendReact 19, ViteStylingCSS (custom), Tailwind CSSMovie dataTMDB APITrending/DBAppwriteUtilitiesreact-use (useDebounce)

Project Structure
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

Setup
1. Install dependencies
bashnpm install
2. Get your API keys
TMDB:

Create a free account at themoviedb.org
Go to Settings → API → copy your Bearer Token (API Read Access Token)

Appwrite:

Create a free project at appwrite.io
Create a database and a collection called metrics
Add the following attributes to the collection:

AttributeTypeRequiredsearchTermString (1000)✅countInteger✅poster_urlURL✅movie_idInteger✅titleString (500)✅
3. Create a .env.local file
envVITE_TMDB_API_KEY=your_tmdb_bearer_token
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
4. Run the app
bashnpm run dev

How Trending Works
Every time a user searches for a movie:

The top result's movie_id is looked up in Appwrite
If it exists, the count is incremented
If not, a new document is created with count: 1
The top 5 most-searched movies are displayed in the Trending section


Movies with no poster path are saved with a placeholder image URL to satisfy Appwrite's URL validation on the poster_url field.


Available Scripts
bashnpm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint

Author
Elyse Joyeux