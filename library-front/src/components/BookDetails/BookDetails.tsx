import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import bookCoverPlaceholder from '../../assets/book-cover-placeholder.png'
import { isAdmin, isLibrarian, isUser } from '../../services/AuthService'
import { deleteBook, getBook, GetBookAuthorsResponse } from '../../services/BookService'
import {
  getBookRentalHistory,
  RentalHistoryResponse,
  rentBook,
  returnBook,
} from '../../services/RentalService'
import BookFormWrapper from '../BookFormWrapper/BookFormWrapper'
import { Book, BookPage } from '../BookList/BookList'
import Dialog from '../Dialog/Dialog'
import './BookDetails.css'

interface BookDetailsProps {}

enum BookDetailsDialogType {
  Delete = 'delete',
  Rent = 'rent',
  Return = 'return',
}

const BookDetails: FC<BookDetailsProps> = () => {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dialog = useRef<HTMLDialogElement | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [activeDialog, setActiveDialog] = useState<BookDetailsDialogType>(
    BookDetailsDialogType.Delete,
  )
  const { data: bookData } = useQuery(['books', id], async () => {
    if (!id) return null
    const { data } = await getBook(parseInt(id))
    return data
  })
  const { data: rentHistoryData } = useQuery(['rentHistory', 'book', id], async () => {
    if (!id) return []
    const { data } = await getBookRentalHistory(parseInt(id))
    return data
  })
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null)

  useEffect(() => {
    if (!bookData) return
    const book: Book = {
      ...bookData,
      Isbn: bookData.ISBN,
      Authors: bookData.Authors.map((author: GetBookAuthorsResponse) => {
        return {
          Id: author.Id,
          FirstName: author.Firstname,
          LastName: author.Lastname,
        }
      }),
    }
    setBook(book)
  }, [bookData])

  if (!book) return null

  const handleDialogConfirm = () => {
    switch (activeDialog) {
      case 'delete':
        handleConfirmDeleteBook()
        break
      case 'rent':
        handleConfirmRentBook()
        break
      case 'return':
        handleConfirmReturnBook()
        break
    }
  }

  const handleConfirmDeleteBook = async () => {
    if (book.Quantity !== book.Available) {
      toast.warning("Book is currently being rented and can't be deleted")
      return
    }

    await deleteBook(book.Id).catch((err) => {
      toast.error("Couldn't delete book")
      throw new Error(err)
    })

    queryClient.invalidateQueries({
      predicate(query) {
        return query.queryKey[0] === 'books' && query.queryKey[1] !== id
      },
      refetchPage: (lastPage: BookPage) =>
        lastPage.books.some((deletedBook) => book.Id === deletedBook.Id),
    })

    toast.success('Book deleted successfully')
    navigate('/')
  }

  const openDialog = (dialogType: BookDetailsDialogType, rentalId?: number) => {
    if (rentalId) setSelectedRentalId(rentalId)
    setActiveDialog(dialogType)
    dialog.current?.showModal()
  }

  const getDialogTitle = (): string => {
    return `${activeDialog[0].toUpperCase()}${activeDialog.slice(1)} book`
  }

  const getDialogDescription = (): string => {
    return `Are you sure you want to ${activeDialog} the book "${book?.Title}"?`
  }

  const getDialogConfirmText = (): string => {
    return `${activeDialog[0].toUpperCase()}${activeDialog.slice(1)}`
  }

  const handleConfirmRentBook = async () => {
    await rentBook(book.Id).catch((err) => {
      toast.error("Couldn't rent book")
      throw new Error(err)
    })

    invalidateQueries()

    toast.success('Book rented successfully!')
  }

  const handleConfirmReturnBook = async () => {
    if (!selectedRentalId) throw new Error('No rental selected')

    await returnBook(selectedRentalId).catch((err) => {
      toast.error("Couldn't return book")
      throw new Error(err)
    })

    invalidateQueries()

    toast.success('Book returned successfully!')
  }

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ['books', id],
    })

    queryClient.invalidateQueries({
      predicate(query) {
        return query.queryKey[0] === 'books' && query.queryKey.length === 4
      },
      refetchPage(lastPage: BookPage) {
        return lastPage.books.some((pagedBook) => {
          return book.Id === pagedBook.Id
        })
      },
      refetchType: 'inactive',
    })

    queryClient.invalidateQueries({
      queryKey: ['rentHistory', 'book', id],
    })
  }

  return (
    <div>
      <div className='book-details'>
        <BookFormWrapper
          closeModal={() => setIsModalVisible(false)}
          isOpen={isModalVisible}
          book={book}
        />
        <Dialog
          dialogRef={dialog}
          confirm={handleDialogConfirm}
          title={getDialogTitle()}
          description={getDialogDescription()}
          confirmText={getDialogConfirmText()}
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
                ? new Intl.DateTimeFormat('sr-RS').format(new Date(book?.PublishDate))
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
              <button
                onClick={() => openDialog(BookDetailsDialogType.Rent)}
                disabled={book.Available === 0}
                type='button'
              >
                Rent
              </button>
            )}
            {(isAdmin() || isLibrarian()) && (
              <>
                <button type='button' onClick={() => setIsModalVisible(true)}>
                  Edit
                </button>
                <button
                  type='button'
                  onClick={() => openDialog(BookDetailsDialogType.Delete)}
                  className='delete-book-btn'
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {(isAdmin() || isLibrarian()) && (
        <div className='book-rent-history'>
          <h2>Rent history</h2>
          <table>
            <thead>
              <tr>
                <th scope='col'>Rent Date</th>
                <th scope='col'>Renter Email</th>
                <th scope='col'>Return</th>
              </tr>
            </thead>
            <tbody>
              {rentHistoryData?.map((rentHistory: RentalHistoryResponse) => (
                <tr key={rentHistory.Id}>
                  <td data-label='Rent Date' scope='row'>
                    {new Intl.DateTimeFormat('sr-RS').format(new Date(rentHistory.RentDate))}
                  </td>
                  <td data-label='Renter Email'>{rentHistory.User.Email}</td>
                  <td data-label='Return'>
                    {rentHistory.IsReturned
                      ? 'Returned'
                      : (isAdmin() || isLibrarian()) && (
                          <button
                            type='button'
                            onClick={() => openDialog(BookDetailsDialogType.Return, rentHistory.Id)}
                          >
                            Return
                          </button>
                        )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BookDetails
