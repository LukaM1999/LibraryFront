import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  PersistedClient,
  Persister,
  PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client'
import { del, get, set } from 'idb-keyval'
import { useEffect, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router'
import { ScrollRestoration } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import configureAxios from './axios/config'
import { BookFilter } from './components/FilterForm/FilterForm'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import { Jwt } from './helpers/jwt-helper'
import { getItem } from './services/StorageService'

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

const cacheTime = 1000 * 60 * 5

const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: cacheTime, staleTime: cacheTime } },
})

export const createIDBPersister = (idbValidKey: IDBValidKey = 'reactQuery'): Persister => {
  return {
    persistClient: async (client: PersistedClient) => {
      const queries = client.clientState.queries.map((query) => {
        return {
          ...query,
          state: {
            ...query.state,
            fetchMeta: null,
          },
        }
      })
      client.clientState.queries = queries
      set(idbValidKey, client)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey)
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  }
}

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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: createIDBPersister(), maxAge: cacheTime }}
    >
      <ScrollRestoration />
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
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
    </PersistQueryClientProvider>
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
