import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import bookCoverPlaceholder from '../../assets/book-cover-placeholder.png'
import { isAdmin, isLibrarian, isUser } from '../../services/AuthService'
import { deleteBook, getBook, GetBookAuthorsResponse } from '../../services/BookService'
import BookFormWrapper from '../BookFormWrapper/BookFormWrapper'
import { Book, BookPage } from '../BookList/BookList'
import Dialog from '../Dialog/Dialog'
import './BookDetails.css'

interface BookDetailsProps {}

const BookDetails: FC<BookDetailsProps> = () => {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dialog = useRef<HTMLDialogElement | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data } = useQuery(['books', id], async () => {
    if (!id) return null
    const { data } = await getBook(parseInt(id))
    return data
  })

  useEffect(() => {
    if (!data) return
    const book: Book = {
      ...data,
      Isbn: data.ISBN,
      Authors: data.Authors.map((author: GetBookAuthorsResponse) => {
        return {
          Id: author.Id,
          FirstName: author.Firstname,
          LastName: author.Lastname,
        }
      }),
    }
    setBook(book)
  }, [data])

  if (!book) return null

  const handleConfirmDelete = async () => {
    if (book.Quantity !== book.Available) {
      toast.warning("Book is currently being rented and can't be deleted")
      return
    }

    await deleteBook(book.Id).catch((err) => {
      toast.error("Couldn't delete book")
      throw new Error(err)
    })
    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) =>
        lastPage.books.some((deletedBook) => book.Id === deletedBook.Id),
    })
    toast.success('Book deleted successfully')
    navigate('/')
  }

  const openDeleteDialog = () => {
    dialog.current?.showModal()
  }

  return (
    <div className='book-details'>
      <BookFormWrapper
        closeModal={() => setIsModalVisible(false)}
        isOpen={isModalVisible}
        book={book}
      />
      <Dialog
        dialogRef={dialog}
        confirm={handleConfirmDelete}
        title='Delete book'
        description={`Are you sure you want to delete the book "${book?.Title}"?`}
        confirmText='Delete'
      />
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
          <p>{book?.Isbn}</p>
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
          <label>Quantity</label>
          <p>
            {book?.Quantity} {book?.Quantity === 1 ? 'copy' : 'copies'}
          </p>
        </div>
        <div className='book-info-row'>
          <label>Available</label>
          <p>
            {book?.Available} {book?.Available === 1 ? 'copy' : 'copies'}
          </p>
        </div>
        <div className='book-info-row'>
          <label>Authors</label>
          <p>
            {book?.Authors.reduce(
              (previous, current) => `${previous}, ${current.FirstName} ${current.LastName}`,
              '',
            ).substring(2)}
          </p>
        </div>
        <div className='book-info-column'>
          {(isAdmin() || isUser()) && (
            <button disabled={book.Available === 0} type='button'>
              Rent
            </button>
          )}
          {(isAdmin() || isLibrarian()) && (
            <>
              <button type='button' onClick={() => setIsModalVisible(true)}>
                Edit
              </button>
              <button type='button' onClick={openDeleteDialog} className='delete-book-btn'>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetails
