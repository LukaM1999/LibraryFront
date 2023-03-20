import { useQueryClient } from '@tanstack/react-query'
import { FC, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getAllAuthors } from '../../services/AuthorService'
import { createBook, GetBookResponse, updateBook } from '../../services/BookService'
import BookForm from '../BookForm/BookForm'
import { Author, BookPage } from '../BookList/BookList'
import { Modal } from '../Modal/Modal'
import './BookFormWrapper.css'

interface BookFormWrapperProps {
  book?: GetBookResponse
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  closeModal: () => void
}

const BookFormWrapper: FC<BookFormWrapperProps> = ({ book, isOpen, setIsOpen }) => {
  const [bookFormData, setBookFormData] = useState<FormData | null>(new FormData())
  const [authors, setAuthors] = useState<Author[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    getAllAuthors()
      .then(({ data }) => setAuthors(data))
      .catch(() => {
        toast.error('Error getting authors')
      })
  }, [])

  useEffect(() => {
    if (!book) return
    const formData = new FormData()
    formData.append('Id', book.Id.toString())
    formData.append('Title', book.Title)
    formData.append('Description', book.Description)
    formData.append('ISBN', book.ISBN)
    formData.append('Quantity', book.Quantity.toString())
    formData.append('PublishDate', book.PublishDate?.toString() || '')
    book.Authors.forEach((author) => {
      formData.append('AuthorIds', author.Id.toString())
    })
    setBookFormData(formData)
  }, [book])

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (book) {
      updateSelectedBook()
      return
    }
    createNewBook()
  }

  const updateSelectedBook = async () => {
    if (!bookFormData) return
    await updateBook(bookFormData).catch((error) => {
      toast.error('Error updating book')
      throw new Error(error)
    })

    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) =>
        lastPage.books.some((oldBook) => oldBook.Id === book?.Id),
    })

    setIsOpen(false)
    toast.success('Book updated successfully!')
  }

  const createNewBook = async () => {
    if (!bookFormData) return
    await createBook(bookFormData).catch((error) => {
      toast.error('Error creating book')
      throw new Error(error)
    })

    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) => !lastPage.nextPage,
    })

    setIsOpen(false)
    toast.success('Book created successfully!')
  }

  return (
    <div className='book-form-wrapper'>
      <Modal
        closeModal={() => setIsOpen(false)}
        confirm={handleConfirm}
        isOpen={isOpen}
        title={book ? 'Edit book' : 'Create book'}
      >
        <BookForm book={book} allAuthors={authors} setBookFormData={setBookFormData} />
      </Modal>
    </div>
  )
}

export default BookFormWrapper
