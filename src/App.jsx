import React from 'react'
import {useState, useEffect} from 'react'
import Search from './components/Search.jsx'
import heroBackground from './assets/hero-background.png'

const API_BASE_URL = "https://api.themoviedb.org/3" 
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept:'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {
const [searchTerm, setSearchTerm] =useState('')
const [errorMessage, setErrorMessage] = useState('')

const fetchMovies = async ()=> {
  try{
    const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
    const response = await fetch(endpoint, API_OPTIONS)
    throw new Error("Error fetching!")

  }catch(error){
    console.error(`Error fetching movies: ${error}`)
    setErrorMessage("Error fetching movies, Please try again later")
    
  }
}


useEffect(()=>{
  fetchMovies();

},[])

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src={heroBackground} alt="Hero background" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        <section className="all movies">
          <h2>All movies</h2>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
        
        <h1>{searchTerm}</h1>
      </div>
    </div>
  )
}

export default App