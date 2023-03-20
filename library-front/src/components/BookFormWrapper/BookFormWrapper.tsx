import { useQueryClient } from '@tanstack/react-query'
import { FC, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import convertBase64ToBlob from '../../helpers/image-helper'
import { createAuthor, getAllAuthors } from '../../services/AuthorService'
import { createBook, updateBook } from '../../services/BookService'
import BookForm from '../BookForm/BookForm'
import { Author, Book, BookPage } from '../BookList/BookList'
import { Modal } from '../Modal/Modal'
import './BookFormWrapper.css'

interface BookFormWrapperProps {
  book?: Book | null
  isOpen: boolean
  closeModal: () => void
}

const BookFormWrapper: FC<BookFormWrapperProps> = ({ book, isOpen, closeModal }) => {
  const [bookFormData, setBookFormData] = useState<FormData | null>(new FormData())
  const [authors, setAuthors] = useState<Author[]>([])
  const [authorData, setAuthorData] = useState<Author | null>(null)
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
    formData.append('ISBN', book.Isbn)
    formData.append('Quantity', book.Quantity.toString())
    formData.append('PublishDate', book.PublishDate?.toString() || '')
    if (book.Cover) {
      convertBase64ToBlob(book.Cover).then((blob) => {
        formData.append('Cover', blob)
      })
    }
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

    closeModal()
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

    closeModal()
    toast.success('Book created successfully!')
  }

  const handleCreateNewAuthor = async () => {
    if (!authorData) return
    await createAuthor(authorData).catch((error) => {
      toast.error('Error creating author')
      throw new Error(error)
    })
    toast.success('Author created successfully!')
    setAuthorData(null)

    const { data } = await getAllAuthors().catch((error) => {
      toast.error('Error getting authors')
      throw new Error(error)
    })
    setAuthors(data)
  }

  return (
    <div className='book-form-wrapper'>
      <Modal
        closeModal={closeModal}
        confirm={handleConfirm}
        isOpen={isOpen}
        title={book ? 'Edit book' : 'Create book'}
      >
        <BookForm
          book={book}
          allAuthors={authors}
          setBookFormData={setBookFormData}
          authorData={authorData}
          setAuthorData={setAuthorData}
          createNewAuthor={handleCreateNewAuthor}
        />
      </Modal>
    </div>
  )
}

export default BookFormWrapper
