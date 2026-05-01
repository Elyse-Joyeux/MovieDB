import React from 'react'
import {useState, useEffect} from 'react'
import Search from './components/Search.jsx'
import heroBackground from './assets/hero-background.png'

const App = () => {
const [searchTerm, setSearchTerm] =useState('')

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src={heroBackground} alt="Hero background" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h1>{searchTerm}</h1>
      </div>
    </div>
  )
}

export default App