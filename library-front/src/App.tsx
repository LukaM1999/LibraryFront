import { Outlet, useOutletContext } from 'react-router'
import axios from 'axios'
import { refreshAccessToken } from './services/AuthService'
import { Jwt, JwtRole, roleKey, setJwt } from './helpers/jwt-helper'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { ToastContainer } from 'react-toastify'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { getItem } from './services/StorageService'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

axios.interceptors.request.use(
  async (config) => {
    let jwt = JSON.parse(getItem('jwt') || '{}')
    if (!jwt || !jwt?.accessToken) return config
    config.headers.Authorization = `Bearer ${jwt.accessToken}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (![401, 403].includes(error.response?.status) || originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true
    const { data } = await refreshAccessToken()
    const role: JwtRole = jwtDecode(data.accessToken)
    setJwt({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiration: data.expiration,
      role: role[roleKey],
    })
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
    return axios(originalRequest)
  },
)

interface ContextType {
  jwtToken: Jwt
  setJwtToken: React.Dispatch<React.SetStateAction<Jwt | null>>
}

const queryClient = new QueryClient()

function App() {
  const [jwtToken, setJwtToken] = useState<Jwt | null>(null)

  useEffect(() => {
    const jwt: Jwt = JSON.parse(getItem('jwt') || '{}')
    setJwtToken(jwt)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Header jwt={jwtToken} setJwt={setJwtToken} />
      <Navbar />
      <div className='app'>
        <Outlet context={{ jwtToken, setJwtToken }} />
      </div>
      <Footer />
    </QueryClientProvider>
  )
}

export function useJwt() {
  return useOutletContext<ContextType>()
}

export default App
