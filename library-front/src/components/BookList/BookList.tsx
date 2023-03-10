import { FC, Fragment, useEffect, useState } from 'react'
import { getBooksPaged, WhereBookQuery } from '../../services/BookService'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import './BookList.css'
import BookCard from '../BookCard/BookCard'
import { useSearch } from '../../App'

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

export interface BookPage {
  books: Book[]
  prevPage?: number
  nextPage?: number
}

const searchByAllFields: WhereBookQuery[] = [
  {
    field: 'title',
    value: '',
    operation: 2,
  },
  {
    field: 'description',
    value: '',
    operation: 2,
  },
  {
    field: 'isbn',
    value: '',
    operation: 2,
  },
  {
    field: 'publishDate',
    value: '',
    operation: 2,
  },
]

const BookList: FC<BookListProps> = () => {
  const { ref, inView } = useInView({ rootMargin: '20%' })
  const { search } = useSearch()

  useEffect(() => {
    fetchNextPage({ pageParam: 1 })
  }, [search])

  const { data, fetchNextPage } = useInfiniteQuery(
    ['books'],
    async ({ pageParam = 1 }) => {
      if (search) {
        console.log(search)
        for (let whereQuery of searchByAllFields) {
          whereQuery.value = search
        }
      }
      const { data } = await getBooksPaged({
        page: pageParam,
        where: search ? searchByAllFields : undefined,
      })
      const bookPage: BookPage = {
        books: data,
        prevPage: pageParam === 1 ? 1 : pageParam - 1,
        nextPage: data?.length > 0 ? ++pageParam : undefined,
      }
      return bookPage
    },
    {
      getPreviousPageParam: (firstPage) => firstPage?.prevPage,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
    },
  )

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])
  return (
    <>
      <div className='book-list'>
        {data?.pages?.map((page) =>
          page?.books?.map((book) => <BookCard key={book.id} book={book} />),
        )}
      </div>
      <div ref={ref} />
    </>
  )
}

export default BookList
