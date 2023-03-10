import axios, { AxiosResponse } from 'axios'
import { Book } from '../components/BookList/BookList'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Books`

export const getBooksPaged = async (
  booksPagedRequest: BooksPagedRequest,
): Promise<AxiosResponse<Book[]>> => {
  return axios.get<Book[]>(`${url}/paged`, {
    params: {
      PageNumber: booksPagedRequest.page || 1,
      Where: booksPagedRequest.where,
      Order: booksPagedRequest.order,
      PageLength: booksPagedRequest.pageLenght || 3,
    },
  })
}

export interface WhereBookQuery {
  field: string
  value: string
  operation: number
}

export interface BooksPagedRequest {
  page?: number
  where?: WhereBookQuery[]
  order?: string[]
  pageLenght?: number
}
