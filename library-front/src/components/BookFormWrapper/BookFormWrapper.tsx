import { useQueryClient } from '@tanstack/react-query'
import { FC, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import convertBase64ToBlob from '../../helpers/image-helper'
import { createAuthor, getAllAuthors } from '../../services/AuthorService'
import { isAdmin, isLibrarian } from '../../services/AuthService'
import { createBook, updateBook } from '../../services/BookService'
import BookForm from '../BookForm/BookForm'
import { Author, Book, BookPage } from '../BookList/BookList'
import { Modal } from '../Modal/Modal'

interface BookFormWrapperProps {
  book?: Book | null
  isOpen: boolean
  closeModal: () => void
}

const BookFormWrapper: FC<BookFormWrapperProps> = ({ book, isOpen, closeModal }) => {
  const [bookFormData, setBookFormData] = useState<FormData | null>(new FormData())
  const [authors, setAuthors] = useState<Author[]>([])
  const [authorFormData, setAuthorFormData] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAdmin() && !isLibrarian()) return
    getAllAuthors()
      .then(({ data }) => setAuthors(data))
      .catch((error) => {
        throw new Error(error)
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

    setIsLoading(true)
    await updateBook(bookFormData).catch((error) => {
      toast.error('Error updating book')
      setIsLoading(false)
      throw new Error(error)
    })

    queryClient.invalidateQueries({
      predicate(query) {
        return query.queryKey[0] === 'books' && query.queryKey.length === 4
      },
      refetchPage: (lastPage: BookPage) =>
        lastPage.books.some((oldBook) => oldBook.Id === book?.Id),
    })

    queryClient.invalidateQueries({
      queryKey: ['books', book?.Id.toString()],
    })

    setIsLoading(false)
    setBookFormData(null)
    closeModal()
    toast.success('Book updated successfully!')
  }

  const createNewBook = async () => {
    if (!bookFormData) return

    setIsLoading(true)
    await createBook(bookFormData).catch((error) => {
      toast.error('Error creating book')
      setIsLoading(false)
      throw new Error(error)
    })

    queryClient.invalidateQueries({
      predicate(query) {
        return query.queryKey[0] === 'books' && query.queryKey.length === 4
      },
      refetchPage: (lastPage: BookPage) => !lastPage.nextPage,
    })

    setIsLoading(false)
    setBookFormData(null)
    closeModal()
    toast.success('Book created successfully!')
  }

  const handleCreateNewAuthor = async () => {
    if (!authorFormData) return

    setIsLoading(true)
    await createAuthor(authorFormData).catch((error) => {
      toast.error('Error creating author')
      setIsLoading(false)
      throw new Error(error)
    })

    toast.success('Author created successfully!')
    setAuthorFormData(null)

    const { data } = await getAllAuthors().catch((error) => {
      toast.error('Error getting authors')
      setIsLoading(false)
      throw new Error(error)
    })

    setIsLoading(false)
    setAuthors(data)
  }

  return (
    <>
      <Modal
        closeModal={closeModal}
        isLoading={isLoading}
        confirm={handleConfirm}
        isOpen={isOpen}
        title={book ? 'Edit book' : 'Create book'}
      >
        <BookForm
          book={book}
          allAuthors={authors}
          setBookFormData={setBookFormData}
          authorData={authorFormData}
          setAuthorData={setAuthorFormData}
          createNewAuthor={handleCreateNewAuthor}
          isLoading={isLoading}
        />
      </Modal>
    </>
  )
}

export default BookFormWrapper
