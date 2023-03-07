import axios, { AxiosResponse } from 'axios'

const url = `${import.meta.env.VITE_LIBRARY_API}/api/Auth/`

export const login = async (loginRequest: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
  return axios.post<LoginResponse>(`${url}/login`, loginRequest)
}

export const refreshToken = async (): Promise<AxiosResponse<RefreshTokenResponse>> => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  return axios.post<RefreshTokenResponse>(`${url}/refresh-token`, {
    accessToken,
    refreshToken,
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
