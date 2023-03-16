import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { toast } from 'react-toastify'
import { deleteBook } from '../../services/BookService'
import { Book, BookPage } from '../BookList/BookList'
import './DeleteBookForm.css'

interface DeleteBookFormProps {
  hideModal: () => void
  book: Book
}

const DeleteBookForm: FC<DeleteBookFormProps> = ({ book, hideModal }) => {
  const queryClient = useQueryClient()

  const handleBookDelete = async () => {
    await deleteBook(book.Id).catch((err) => {
      toast.error("Couldn't delete book")
      throw new Error(err)
    })
    hideModal()
    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) =>
        lastPage.books.some((deletedBook) => book.Id === deletedBook.Id),
    })
    toast.success('Book deleted successfully')
  }

  return (
    <div className='delete-book-form'>
      <h3>Are you sure you want to delete the book '{book.Title}'?</h3>
      <div className='delete-book-form-actions'>
        <button className='delete-book-form-btn' onClick={hideModal}>
          Cancel
        </button>
        <button className='delete-book-form-btn delete' onClick={handleBookDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteBookForm
