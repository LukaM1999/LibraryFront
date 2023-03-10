import { Outlet, useOutletContext } from 'react-router'
import { Jwt } from './helpers/jwt-helper'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { ToastContainer } from 'react-toastify'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { getItem } from './services/StorageService'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import configureAxios from './axios/config'

configureAxios()

interface ContextJwt {
  jwtToken: Jwt
  setJwtToken: React.Dispatch<React.SetStateAction<Jwt | null>>
}

interface ContextSearch {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const queryClient = new QueryClient()

function App() {
  const [jwtToken, setJwtToken] = useState<Jwt | null>(null)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const jwt: Jwt = JSON.parse(getItem('jwt') || '{}')
    setJwtToken(jwt)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Header jwt={jwtToken} setJwt={setJwtToken} setSearch={setSearch} />
      <Navbar />
      <div className='app'>
        <Outlet context={{ jwtToken, setJwtToken, search, setSearch }} />
      </div>
      <Footer />
    </QueryClientProvider>
  )
}

export function useJwt() {
  return useOutletContext<ContextJwt>()
}

export function useSearch() {
  return useOutletContext<ContextSearch>()
}

export default App
