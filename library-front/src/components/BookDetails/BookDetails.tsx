import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import bookCoverPlaceholder from '../../assets/book-cover-placeholder.png'
import { getBook, GetBookResponse } from '../../services/BookService'
import './BookDetails.css'

interface BookDetailsProps {}

const BookDetails: FC<BookDetailsProps> = () => {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<GetBookResponse | null>(null)

  useEffect(() => {
    if (!id) return
    getBook(parseInt(id)).then(({ data }) => {
      setBook(data)
    })
  }, [id])

  if (!book) return null

  return (
    <div className='book-details'>
      <div className='book-cover'>
        <img
          src={book?.Cover ? `data:image/png;base64,${book?.Cover}` : bookCoverPlaceholder}
          alt='Book cover'
        />
      </div>
      <div className='book-info'>
        <h1 className='book-title'>
          <i>{book?.Title}</i>
        </h1>
        <p className='book-description'>{book?.Description}</p>
        <div className='book-info-row'>
          <label>ISBN</label>
          <p>{book?.ISBN}</p>
        </div>
        <div className='book-info-row'>
          <label>Publish Date</label>
          <p>
            {book?.PublishDate
              ? new Intl.DateTimeFormat('en-US').format(new Date(book?.PublishDate))
              : ''}
          </p>
        </div>
        <div className='book-info-row'>
          <label>Authors</label>
          <p>
            {book?.Authors.reduce(
              (previous, current) => `${previous}, ${current.Firstname} ${current.Lastname}`,
              '',
            ).substring(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
