import { FC, Fragment, useEffect, useState } from 'react'
import { getBooksPaged, WhereBookQuery } from '../../services/BookService'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import './BookList.css'
import BookCard from '../BookCard/BookCard'
import { useSearch } from '../../App'
import { Jwt, JwtRole, roleKey } from '../../helpers/jwt-helper'
import { getItem } from '../../services/StorageService'
import { BiBookAdd } from 'react-icons/bi'

interface BookListProps {
  jwt: Jwt | null
}

export interface Book {
  Id: number
  Title: string
  Description: string
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

const BookList: FC<BookListProps> = ({ jwt }) => {
  const { ref, inView } = useInView({ rootMargin: '20%' })
  const { search } = useSearch()

  const role = JSON.parse(getItem('jwt') || '{}').role

  let { data, fetchNextPage } = useInfiniteQuery(
    ['books'],
    async ({ pageParam = 1 }) => {
      if (search) {
        searchByTitle[0].Value = search
      }
      const { data } = await getBooksPaged({
        page: pageParam,
        where: search ? searchByTitle : undefined,
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
    if (!data) return
    data.pages = []
    fetchNextPage({ pageParam: 1 })
  }, [search])

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
        <button className='btn-add-book'>
          <BiBookAdd size='100%' />
        </button>
      )}
      <div ref={ref} />
    </>
  )
}

export default BookList
