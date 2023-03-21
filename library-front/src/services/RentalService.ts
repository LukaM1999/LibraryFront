import axios, { AxiosResponse } from 'axios'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Rental`

export const rentBook = async (bookId: number): Promise<AxiosResponse<void>> => {
  return axios.post<void>(`${url}/rent/${bookId}`)
}

export const returnBook = async (rentId: number): Promise<AxiosResponse<void>> => {
  return axios.post<void>(`${url}/return/${rentId}`)
}

export const getBookRentalHistory = async (
  bookId: number,
): Promise<AxiosResponse<RentalHistoryResponse[]>> => {
  return axios.get<RentalHistoryResponse[]>(`${url}/book-history/${bookId}`)
}

export interface RentalHistoryResponse {
  Id: number
  User: RentalHistoryUserResponse
  RentDate: Date
  IsReturned: boolean
}

export interface RentalHistoryUserResponse {
  Id: number
  Email: string
  FirstName: string
  LastName: string
}
