import axios, { AxiosResponse } from 'axios'
import { Author } from '../components/BookList/BookList'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Authors`

export const getAllAuthors = (): Promise<AxiosResponse<Author[]>> => {
  return axios.get<Author[]>(url)
}

export const createAuthor = (author: Author): Promise<AxiosResponse<void>> => {
  return axios.post<void>(url, author)
}
