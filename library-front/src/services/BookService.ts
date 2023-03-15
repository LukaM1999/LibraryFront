import axios, { AxiosResponse } from 'axios'
import { Book } from '../components/BookList/BookList'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Books`

export const getBooksPaged = async (
  booksPagedRequest: BooksPagedRequest,
): Promise<AxiosResponse<BooksPagedResponse>> => {
  const pageNumber = `pageNumber=${booksPagedRequest.page ?? 1}`
  const pageLenght = `&pageLength=${booksPagedRequest.pageLenght ?? 10}`
  const where =
    booksPagedRequest.where?.reduce((previous, current) => {
      return `${previous}&where=${JSON.stringify(current)}`
    }, '') ?? ''
  const order =
    booksPagedRequest.order?.reduce((previous, current) => `${previous}&order=${current}`, '') ?? ''
  return axios.get<BooksPagedResponse>(`${url}/paged?${pageNumber}${pageLenght}${where}${order}`)
}

export const getBook = (id: number): Promise<AxiosResponse<Book>> => {
  return axios.get<Book>(`${url}/${id}`)
}

export const createBook = (book: FormData): Promise<AxiosResponse<void>> => {
  return axios.post<void>(url, book)
}

export interface WhereBookQuery {
  Field: string
  Value: string
  Operation: number
}

export interface BooksPagedRequest {
  page?: number
  where?: WhereBookQuery[]
  order?: (string | undefined)[] | undefined
  pageLenght?: number
}

export interface BooksPagedResponse {
  Items: Book[]
  TotalCount: number
}
