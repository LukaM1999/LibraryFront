import { FC } from 'react'
import { AiOutlineEdit as EditIcon } from 'react-icons/ai'
import { MdDeleteForever as DeleteIcon } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import bookCoverPlaceholder from '../../assets/book-cover-placeholder.png'
import { isAdmin, isLibrarian } from '../../services/AuthService'
import { Book } from '../BookList/BookList'
import './BookCard.css'

interface BookCardProps {
  book: Book
  handleDelete: (book: Book) => void
  handleEdit: (book: Book) => void
}

const BookCard: FC<BookCardProps> = ({ book, handleDelete, handleEdit }) => {
  const navigate = useNavigate()

  const handleBookDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (book.Available < book.Quantity) {
      toast.warning("Book is currently being rented and can't be deleted")
      return
    }
    handleDelete(book)
  }

  const handleBookEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, book: Book) => {
    e.stopPropagation()
    handleEdit(book)
  }

  return (
    <div onClick={() => navigate(`/book-details/${book.Id}`)} className='book-card'>
      {(isAdmin() || isLibrarian()) && (
        <div className='book-card-actions'>
          <button
            onClick={(e) => handleBookEdit(e, book)}
            title='Edit book'
            className='book-card-btn'
          >
            <EditIcon size='100%' />
          </button>
          <button
            title='Delete book'
            className='book-card-btn delete-book'
            onClick={handleBookDelete}
          >
            <DeleteIcon size='100%' />
          </button>
        </div>
      )}
      <div className='book-card-header'>
        <img
          title={book.Title}
          alt={book.Title}
          src={book.Cover ? `data:image/png;base64,${book.Cover}` : bookCoverPlaceholder}
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
          <h3>ISBN</h3>
          <p>{book.Isbn}</p>
        </div>
        <div className='book-card-body-group'>
          <h3>Publish date</h3>
          <p>
            {book.PublishDate
              ? new Intl.DateTimeFormat('sr-RS').format(new Date(book.PublishDate))
              : 'Unknown'}
          </p>
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
