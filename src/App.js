import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMoviesdHandler = useCallback(async function() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://react-movies-1e095-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      
      const data = await response.json();
      const item = []
      for (const key in data) {
        item.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }
      setFilms(item);
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, []);

  useEffect(() => {
    fetchMoviesdHandler();
  }, [fetchMoviesdHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-movies-1e095-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie)
      }
    );
    const data = await response.json();
  }

  let content = <p>Found no movies</p>

  if (!isLoading && films.length > 0) {
    content = <MoviesList movies={films} />;
  }

  if(!isLoading && films.length === 0 && !error) {
    content = <p>Found no movies</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if(error) {
    content = <p>{error}</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesdHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
