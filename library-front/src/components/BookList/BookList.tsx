import { FC, useEffect } from 'react'
import { getBooksPaged, WhereBookQuery } from '../../services/BookService'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import './BookList.css'
import BookCard from '../BookCard/BookCard'
import { useFilters, useJwt, useSearch, useSort } from '../../App'
import { BiBookAdd as AddIcon } from 'react-icons/bi'

interface BookListProps {}

export interface Book {
  Id: number
  Title: string
  Description: string
  Cover: string
  Isbn: string
  PublishDate: Date
  Authors: Author[]
}

export interface Author {
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

  const role = jwtToken?.role

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
  return (
    <>
      <div className='book-list'>
        {data?.pages?.map((page) =>
          page?.books?.map((book) => <BookCard key={book.Id} book={book} />),
        )}
      </div>
      {role && role !== 'User' && (
        <button title='New book' className='btn-add-book'>
          <AddIcon size='100%' />
        </button>
      )}
      <div ref={ref} />
    </>
  )
}

export default BookList
