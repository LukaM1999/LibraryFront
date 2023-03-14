import { FC, useEffect, useMemo } from 'react'
import './BookSearch.css'
import debounce from 'lodash.debounce'

interface BookSearchProps {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const BookSearch: FC<BookSearchProps> = ({ handleSearch }) => {
  const debouncedResults = useMemo(() => {
    return debounce(handleSearch, 300)
  }, [])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  return (
    <input
      type='search'
      className='book-search'
      placeholder='Search...'
      onChange={debouncedResults}
    ></input>
  )
}

export default BookSearch
