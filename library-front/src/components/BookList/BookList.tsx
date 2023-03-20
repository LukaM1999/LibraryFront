import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useRef, useState } from 'react'
import { BiBookAdd as AddIcon } from 'react-icons/bi'
import { useInView } from 'react-intersection-observer'
import { toast } from 'react-toastify'
import { useFilters, useJwt, useSearch, useSort } from '../../App'
import { deleteBook, getBooksPaged, WhereBookQuery } from '../../services/BookService'
import BookCard from '../BookCard/BookCard'
import BookFormWrapper from '../BookFormWrapper/BookFormWrapper'
import Dialog from '../Dialog/Dialog'
import './BookList.css'

interface BookListProps {}

export interface Book {
  Id: number
  Title: string
  Description: string
  Cover?: string
  Isbn: string
  PublishDate: Date
  Authors: Author[]
  Quantity: number
  Available: number
}

export interface Author {
  Id: number
  FirstName: string
  LastName: string
}

export interface BookPage {
  books: Book[]
  prevPage?: number
  nextPage?: number
}

const searchByTitle: WhereBookQuery[] = [
  {
    Field: 'Title',
    Value: '',
    Operation: 2,
  },
]

const BookList: FC<BookListProps> = () => {
  const { ref, inView } = useInView({ rootMargin: '60%' })
  const { search } = useSearch()
  const { filters } = useFilters()
  const { sort } = useSort()
  const { jwtToken } = useJwt()
  const [bookModalVisible, setBookModalVisible] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const queryClient = useQueryClient()

  const role = jwtToken?.role

  const showBookModal = () => {
    setBookModalVisible(true)
  }

  let { data, fetchNextPage } = useInfiniteQuery(
    ['books'],
    async ({ pageParam = 1 }) => {
      searchByTitle[0].Value = search
      const { data } = await getBooksPaged({
        page: pageParam,
        where: [...searchByTitle, ...filters],
        order: sort,
      })
      const bookPage: BookPage = {
        books: data.Items,
        prevPage: pageParam === 1 ? 1 : pageParam - 1,
        nextPage: data.TotalCount - pageParam * 10 > 0 ? ++pageParam : undefined,
      }
      return bookPage
    },
    {
      getPreviousPageParam: (firstPage) => firstPage?.prevPage,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
    },
  )

  useEffect(() => {
    if (!data) return
    data.pages = []
    fetchNextPage({ pageParam: 1 })
  }, [search, filters, sort])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  const handleCloseModal = () => {
    setSelectedBook(null)
    setBookModalVisible(false)
  }

  const handleDelete = (selectedBook: Book) => {
    setSelectedBook(selectedBook)
    dialog.current?.showModal()
  }

  const handleConfirmDelete = async () => {
    if (!selectedBook) return
    await deleteBook(selectedBook.Id).catch((err) => {
      toast.error("Couldn't delete book")
      throw new Error(err)
    })
    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) =>
        lastPage.books.some((deletedBook) => selectedBook.Id === deletedBook.Id),
    })
    toast.success('Book deleted successfully')
    setSelectedBook(null)
  }

  const handleEdit = (selectedBook: Book) => {
    setSelectedBook(selectedBook)
    setBookModalVisible(true)
  }

  return (
    <>
      <BookFormWrapper
        closeModal={handleCloseModal}
        isOpen={bookModalVisible}
        book={selectedBook}
      />
      <Dialog
        dialogRef={dialog}
        confirm={handleConfirmDelete}
        title={`Are you sure you want to delete the book "${selectedBook?.Title}?"`}
        confirmText='Delete'
      />

      <div className='book-list'>
        {data?.pages?.map((page) =>
          page?.books?.map((book) => (
            <BookCard
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              key={book.Id}
              book={book}
            />
          )),
        )}
      </div>
      {role && role !== 'User' && (
        <button title='New book' onClick={showBookModal} className='btn-add-book'>
          <AddIcon size='100%' />
        </button>
      )}
      <div ref={ref} />
    </>
  )
}

export default BookList
