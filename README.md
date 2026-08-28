# 🎬 CineVault

> A modern movie discovery application built with React, JavaScript, Tailwind CSS, Vite, and the OMDb API.

CineVault is a responsive single-page movie discovery application designed to provide a smooth and interactive way to explore movies, search for titles, view movie details, manage a personal watchlist, and compare movies with a rule-based recommendation system.

---

## ✨ Features

* 🔍 **Movie Search** — Search for movies using the OMDb API.
* 🎬 **Movie Details** — View detailed information about selected movies.
* ❤️ **Watchlist** — Add and remove movies from your personal watchlist.
* ⚖️ **Movie Comparison** — Select movies and compare their details.
* 🤖 **Smart Recommendation** — Rule-based recommendation system that evaluates selected movies and suggests one based on available movie attributes.
* 🎞️ **Genre Browsing** — Explore movies through genre-based categories.
* 🌙 **Dark / Light Mode** — Switch between dark and light themes.
* ⚡ **API Caching** — Cache movie detail responses to reduce unnecessary API requests.
* ⌨️ **Debounced Search** — Reduce unnecessary API calls while typing search queries.
* ⏳ **Loading States** — Skeleton loading UI while data is being fetched.
* ❌ **Error Handling** — User-friendly error states when requests fail.
* 📭 **Empty States** — Clear feedback when no results are available.
* ✨ **Interactive Animations** — Smooth transitions and UI interactions.
* 📱 **Responsive UI** — Designed to work across different screen sizes.

---

## 🛠️ Tech Stack

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| **React**        | Component-based user interface |
| **JavaScript**   | Application logic              |
| **Vite**         | Development and build tooling  |
| **Tailwind CSS** | Styling and responsive design  |
| **OMDb API**     | Movie data and information     |

---

## 🧠 Key Technical Concepts

### Component-Based Architecture

CineVault is divided into reusable React components to keep the application modular and maintainable.

Examples include:

* `Navbar`
* `Hero`
* `MovieCard`
* `MovieSection`
* `SearchBar`
* `MovieModal`
* `CompareModal`
* `GenreChips`
* `Loading`
* `ErrorMessage`
* `EmptyState`
* `Footer`

### React State Management

React state is used to manage application data and UI interactions such as:

* Search queries
* Search results
* Selected movies
* Watchlist
* Comparison list
* Theme
* Loading state
* Error state
* Modal visibility

### API Integration

Movie information is retrieved dynamically from the OMDb API instead of relying only on static movie data.

### Asynchronous JavaScript

The application handles asynchronous API operations using concepts such as:

* `async / await`
* Promises
* `Promise.all()`
* Error handling

### Debouncing

Search input is debounced so that API requests are not sent for every keystroke.

This reduces unnecessary network requests and improves the search experience.

### API Response Caching

Movie detail responses are cached using an in-memory JavaScript `Map`.

When cached information is available, the application can reuse it instead of requesting the same movie data again.

### Conditional Rendering

The interface responds to different application states:

```text
User Action
     ↓
Loading
     ↓
 ┌───┴────┐
 ↓        ↓
Success  Error
 ↓
Display Data
     ↓
If no results
     ↓
Empty State
```

### Responsive Design

Tailwind CSS utility classes are used to create a responsive interface that adapts to different screen sizes.

---

## 📂 Project Structure

```text
CineVault/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── MovieCard/
│   │   ├── MovieSection/
│   │   ├── ComingSoonCard/
│   │   ├── GenreChips/
│   │   ├── SearchBar/
│   │   ├── MovieModal/
│   │   ├── CompareModal/
│   │   ├── Loading/
│   │   ├── ErrorMessage/
│   │   ├── EmptyState/
│   │   └── Footer/
│   │
│   ├── services/
│   │   └── omdbApi.js
│   │
│   ├── data/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔄 Application Flow

```text
                    ┌───────────────┐
                    │     User      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   React UI    │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Search        Watchlist       Compare
             │
             ▼
       ┌─────────────┐
       │   OMDb API  │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │    Cache    │
       └─────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### 1. Clone the repository

```bash
git clone https://github.com/Priya76843/Cinevault.git
```

### 2. Navigate to the project

```bash
cd Cinevault
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the OMDb API

Create a `.env` file in the project root:

```env
VITE_OMDB_API_KEY=your_omdb_api_key
```

### 5. Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

---

## 🔐 Environment Variables

CineVault uses an environment variable for the OMDb API key.

```env
VITE_OMDB_API_KEY=your_omdb_api_key
```

The actual `.env` file should not be committed to GitHub.

A `.env.example` file can be used to show the required environment variable without exposing the actual API key.

---

## 📈 Performance Considerations

CineVault uses several techniques to reduce unnecessary work and improve the user experience:

* **Debounced search** to limit unnecessary API requests.
* **In-memory caching** to reuse previously fetched movie details.
* **Reusable components** to keep UI logic modular.
* **Conditional rendering** to display only the appropriate application state.
* **Loading and error handling** to provide clear feedback during asynchronous operations.

---

## 🎯 Project Goals

The project was developed to demonstrate practical frontend development concepts including:

* React component architecture
* API integration
* State management
* Asynchronous JavaScript
* Search optimization
* Client-side caching
* Responsive UI development
* Error and loading state management
* Interactive UI design

---

## 🔮 Future Improvements

Possible future enhancements include:

* Personalized recommendation models
* User authentication
* Cloud-synchronized watchlists
* Advanced filtering and sorting
* Pagination or infinite scrolling
* Movie ratings and reviews
* More advanced recommendation algorithms
* Progressive Web App support

---

## 👩‍💻 Author

**Priya Hegde**

M.Tech Computer Science & Engineering

GitHub: [@Priya76843](https://github.com/Priya76843)

---

## 📄 License

This project was developed for educational and portfolio purposes.
