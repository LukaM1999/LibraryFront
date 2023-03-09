import { FC, useEffect, useState } from 'react'
import { getBooksPaged } from '../../services/BookService'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import './BookList.css'
import BookCard from '../BookCard/BookCard'

interface BookListProps {}

export interface Book {
  id: number
  title: string
  description: string
  isbn: string
  publishDate: Date
  authors: Author[]
}

export interface Author {
  firstName: string
  lastName: string
}

const BookList: FC<BookListProps> = () => {
  const { ref, inView } = useInView()
  const [page, setPage] = useState(1)

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['books'],
      async ({ pageParam = 1 }) => {
        const { data } = await getBooksPaged({ page: pageParam })
        setPage(pageParam)
        return data
      },
      {
        getPreviousPageParam: () => (page === 1 ? 1 : page - 1),
        getNextPageParam: () => page + 1,
      },
    )

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage()
    }
  }, [inView])
  return (
    <>
      <div className='book-list'>
        {data?.pages.map((page) => (
          <>
            {page.books.map((book) => (
              <BookCard book={book} />
            ))}
          </>
        ))}
      </div>
      <div ref={ref} />
    </>
  )
}

export default BookList
