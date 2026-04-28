import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SearchBar = ({ searchOpen, setSearchOpen }) => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Sync input with URL param when component mounts
  React.useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchInput(query)
    }
  }, [searchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/collection?q=${encodeURIComponent(searchInput.trim())}`)
      console.log("sss")

      setSearchOpen(false)
      setSearchInput('')
    }
  }

  if (!searchOpen) return null

  return (
    <div className='w-full bg-white border-b border-gray-200 py-3'>
      <form onSubmit={handleSubmit} className='mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row px-4 sm:px-0'>
        <input
          type='text'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='Search products...'
          className='flex-1 w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/10'
        />
        <button
          type='submit'
          className='w-full sm:w-auto rounded bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800'
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
