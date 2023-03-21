import axios, { AxiosResponse } from 'axios'
import { getItem } from './StorageService'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Auth/`

export const login = async (loginRequest: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
  return axios.post<LoginResponse>(`${url}/login`, loginRequest)
}

export const refreshAccessToken = async (): Promise<AxiosResponse<RefreshTokenResponse>> => {
  const jwt = JSON.parse(getItem('jwt') || '{}')
  if (!jwt.accessToken || !jwt.refreshToken) return Promise.reject()
  return axios.post<RefreshTokenResponse>(`${url}/refresh-token`, {
    AccessToken: jwt.accessToken,
    RefreshToken: jwt.refreshToken,
  })
}

export const isUser = () => {
  const jwt = JSON.parse(getItem('jwt') || '{}')
  return jwt.role === 'User'
}

export const isAdmin = () => {
  const jwt = JSON.parse(getItem('jwt') || '{}')
  return jwt.role === 'Admin'
}

export const isLibrarian = () => {
  const jwt = JSON.parse(getItem('jwt') || '{}')
  return jwt.role === 'Librarian'
}

export interface LoginRequest {
  Email: string
  Password: string
}

export interface LoginResponse {
  AccessToken: string
  RefreshToken: string
  Expiration: Date
}

export interface RefreshTokenResponse {
  AccessToken: string
  RefreshToken: string
  Expiration: Date
}
