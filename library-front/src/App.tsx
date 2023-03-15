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
import { BookFilter } from './components/FilterForm/FilterForm'

configureAxios()

interface ContextJwt {
  jwtToken: Jwt
  setJwtToken: React.Dispatch<React.SetStateAction<Jwt | null>>
}

interface ContextSearch {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

interface ContextFilters {
  filters: BookFilter[]
  setFilters: React.Dispatch<React.SetStateAction<BookFilter[]>>
}

interface ContextSort {
  sort: string[]
  setSort: React.Dispatch<React.SetStateAction<string[]>>
}

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } } })

function App() {
  const [jwtToken, setJwtToken] = useState<Jwt | null>(null)
  const [search, setSearch] = useState<string>('')
  const [filters, setFilters] = useState<BookFilter[]>([])
  const [sort, setSort] = useState<string[]>([])

  useEffect(() => {
    const jwt: Jwt = JSON.parse(getItem('jwt') || '{}')
    setJwtToken(jwt)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Header
        jwt={jwtToken}
        setJwt={setJwtToken}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
      />
      <Navbar />
      <div className='app'>
        <Outlet
          context={{ jwtToken, setJwtToken, search, setSearch, filters, setFilters, sort, setSort }}
        />
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

export function useFilters() {
  return useOutletContext<ContextFilters>()
}

export function useSort() {
  return useOutletContext<ContextSort>()
}

export default App
