# 🎬 CineBase - Your Movie Database

A full-stack movie discovery platform with AI-powered recommendations, built with React, Node.js, and vector search technology.

---

## ✨ Features

### 🎥 Movie Discovery
- **Browse Movies** - Explore popular and trending movies powered by TMDB API
- **Search** - Find movies by title with instant search results
- **Movie Details** - View comprehensive info including synopsis, cast, ratings, and trailers
- **Video Playback** - Watch movie trailers directly in the app

### 🤖 AI-Powered Recommendations
- **Vector Search** - Uses Pinecone for semantic movie similarity
- **Smart Suggestions** - Get personalized recommendations based on movie content and metadata
- **LangChain Integration** - Leverages Cohere embeddings for intelligent matching

### 📝 Watchlist Management
- **Save Movies** - Add movies to your personal watchlist
- **Track Progress** - Keep track of movies you want to watch
- **Easy Management** - Remove movies from watchlist with one click

### 🔐 Authentication
- **Email/Password** - Secure local authentication with JWT tokens
- **Google OAuth** - Quick sign-in with Google account
- **Protected Routes** - Secure access to personal features

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Theme** - Sleek dark mode interface with glassmorphism effects
- **Smooth Animations** - Polished micro-interactions and transitions
- **Toast Notifications** - Beautiful feedback for user actions

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** with Express 5
- **TypeScript** - Type-safe development
- **MongoDB** with Mongoose - Database
- **Passport.js** - Authentication (Local + Google OAuth)
- **JWT** - Token-based auth

### AI & Vector Search
- **Pinecone** - Managed vector database for embeddings
- **LangChain** - AI framework
- **Cohere** - Text embeddings

### External APIs
- **TMDB API** - Movie data and metadata

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Pinecone account with an index configured for Cohere embeddings
- TMDB API key
- Cohere API key
- Google OAuth credentials (optional)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yashthakur-01/CineBase.git
cd CineBase
```

### 2️⃣ Setup Server
```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 3️⃣ Setup Client
```bash
cd client
cp .env.example .env
# Edit .env if needed
npm install
npm run dev
```

### 4️⃣ Configure Pinecone
```bash
# Create a dense index with metric=cosine and dimension=1536
# Set PINECONE_API_KEY, PINECONE_INDEX_NAME, and optionally PINECONE_INDEX_HOST in server/.env
```

---

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth.tsx        # Login/Register
│   │   │   ├── Home.tsx        # Movie browsing
│   │   │   ├── MoviePage.tsx   # Movie details
│   │   │   └── WatchList.tsx   # User watchlist
│   │   ├── context/        # Auth context
│   │   └── App.tsx         # Main app component
│   └── ...
│
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   │   ├── auth/           # Authentication
│   │   ├── moviesPublicPage/  # Movie API
│   │   └── watchlist/      # Watchlist CRUD
│   ├── lib/                # Utilities
│   │   ├── vectorStore.ts  # Pinecone setup
│   │   └── dbConnect.ts    # MongoDB connection
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── app.ts              # Express app
│
└── chroma_db/              # Legacy local vector DB data, no longer used by the app
```

---

## 🔧 Environment Variables

See `.env.example` files in both `client/` and `server/` directories for required configuration.

---
