import axios, { AxiosResponse } from 'axios'
import { Book } from '../components/BookList/BookList'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Books`

export const getBooksPaged = async (
  booksPagedRequest: BooksPagedRequest,
): Promise<AxiosResponse<Book[]>> => {
  const pageNumber = `pageNumber=${booksPagedRequest.page ?? 1}`
  const pageLenght = `&pageLength=${booksPagedRequest.pageLenght ?? 10}`
  const where =
    booksPagedRequest.where?.reduce((previous, current) => {
      return `${previous}&where=${JSON.stringify(current)}`
    }, '') ?? ''
  const order =
    booksPagedRequest.order?.reduce((previous, current) => `${previous}&order=${current}`, '') ?? ''
  return axios.get<Book[]>(`${url}/paged?${pageNumber}${pageLenght}${where}${order}`)
}

export interface WhereBookQuery {
  Field: string
  Value: string
  Operation: number
}

export interface BooksPagedRequest {
  page?: number
  where?: WhereBookQuery[]
  order?: string[]
  pageLenght?: number
}
