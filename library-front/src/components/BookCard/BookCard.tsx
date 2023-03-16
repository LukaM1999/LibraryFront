import { FC, useState } from 'react'
import { AiOutlineEdit as EditIcon } from 'react-icons/ai'
import { MdDeleteForever as DeleteIcon } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useJwt } from '../../App'
import { getBook } from '../../services/BookService'
import BookForm from '../BookForm/BookForm'
import { Book } from '../BookList/BookList'
import DeleteBookForm from '../DeleteBookForm/DeleteBookForm'
import { Modal } from '../Modal/Modal'
import './BookCard.css'

interface BookCardProps {
  book: Book
}

const BookCard: FC<BookCardProps> = ({ book }) => {
  const { jwtToken } = useJwt()
  const [bookModalVisible, setBookModalVisible] = useState(false)
  const [deleteBookModalVisible, setDeleteBookModalVisible] = useState(false)

  const role = jwtToken?.role

  const showBookModal = () => {
    setBookModalVisible(true)
  }

  const showDeleteBookModal = () => {
    setDeleteBookModalVisible(true)
  }

  const handleBookDelete = async () => {
    const { data } = await getBook(book.Id).catch((err) => {
      toast.error("Couldn't retrieve book")
      throw new Error(err)
    })
    if (!data) return
    if (data.Quantity !== data.Available) {
      toast.warning("Book is currently being rented and can't be deleted")
      return
    }
    showDeleteBookModal()
  }

  return (
    <div className='book-card'>
      <Modal
        id='bookModal'
        closeModal={() => {
          setBookModalVisible(false)
        }}
        isOpen={bookModalVisible}
      >
        <BookForm hideModal={() => setBookModalVisible(false)} bookId={book.Id} />
      </Modal>
      <Modal
        id='deleteBookModal'
        closeModal={() => {
          setDeleteBookModalVisible(false)
        }}
        isOpen={deleteBookModalVisible}
      >
        <DeleteBookForm hideModal={() => setDeleteBookModalVisible(false)} book={book} />
      </Modal>
      {role && role !== 'User' && (
        <div className='book-card-actions'>
          <button onClick={showBookModal} title='Edit book' className='book-card-btn'>
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
