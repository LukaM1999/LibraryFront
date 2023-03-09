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
    accessToken: jwt.accessToken,
    refreshToken: jwt.refreshToken,
  })
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiration: Date
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiration: Date
}
