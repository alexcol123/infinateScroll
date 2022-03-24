import React, { useState, useEffect, useRef } from 'react'
import { FaSearch, FaPlus } from 'react-icons/fa'
import Photo from './Photo'
import axios from 'axios'

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(true)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const fetchImages = async () => {
    let url
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    } else {
      url = `${mainUrl}${clientID}${urlPage}`
    }

    try {
      const { data } = await axios.get(url)

      setPhotos((oldPhotos) => {
        if (query) return [...oldPhotos, ...data.results]
        else return [...oldPhotos, ...data]
      })

      setLoading(false)
      console.log('my loading', loading)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [page])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query) return

    setPhotos([])
    if (page === 1) {
      fetchImages()
    }

    setPage(1)
  }

  const event = (e) => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 10
    ) {
      console.log(loading)
      if (!loading) return
      setPage((oldPage) => oldPage + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', event)
    return () => window.removeEventListener('scroll', event)
  }, [])

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>

      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image) => (
            <Photo
              key={image.id + Math.floor(Math.random() * 9999)}
              {...image}
            />
          ))}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  )
}

export default App
