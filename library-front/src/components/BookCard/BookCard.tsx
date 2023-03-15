import { FC } from 'react'
import { AiOutlineEdit as EditIcon } from 'react-icons/ai'
import { FiDelete as DeleteIcon } from 'react-icons/fi'
import { useJwt } from '../../App'
import { Book } from '../BookList/BookList'
import './BookCard.css'

interface BookCardProps {
  book: Book
}

const BookCard: FC<BookCardProps> = ({ book }) => {
  const { jwtToken } = useJwt()

  const role = jwtToken?.role

  return (
    <div className='book-card'>
      {role && role !== 'User' && (
        <div className='book-card-actions'>
          <button title='Edit book' className='book-card-btn'>
            <EditIcon size='100%' />
          </button>
          <button title='Delete book' className='book-card-btn delete-book'>
            <DeleteIcon size='100%' />
          </button>
        </div>
      )}
      <div className='book-card-header'>
        <img
          title={book.Title}
          alt={book.Title}
          src={book.Cover ? `data:image/png;base64,${book.Cover}` : './book-cover-placeholder.png'}
        ></img>
      </div>
      <div className='book-card-body'>
        <div className='book-card-body-group'>
          <h2>
            <i>{book.Title}</i>
          </h2>
        </div>
        <div className='book-card-body-group'>
          <p>
            {book.Description?.length > 60
              ? `${book.Description.substring(0, 60)}...`
              : book.Description}
          </p>
        </div>
        <div className='book-card-body-group'>
          <h3>Isbn</h3>
          <p>{book.Isbn}</p>
        </div>
        <div className='book-card-body-group'>
          <h3>Publish date</h3>
          <p>{new Intl.DateTimeFormat('sr-RS').format(new Date(book.PublishDate))}</p>
        </div>
        <div className='book-card-body-group'>
          <h3>Author(s)</h3>
          <p>
            {book.Authors.reduce(
              (prev, curr, i) =>
                i >= 2 ? `${prev}, ...` : `${prev}, ${curr.FirstName} ${curr.LastName}`,
              '',
            ).substring(1)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookCard
