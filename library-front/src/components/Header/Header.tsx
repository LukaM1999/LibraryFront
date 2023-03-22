import { FC, FormEvent, useEffect, useState } from 'react'
import { BiSort as SortIcon } from 'react-icons/bi'
import { TbFilter as FilterIcon } from 'react-icons/tb'
import { Link, useLocation } from 'react-router-dom'
import { clearJwt, Jwt } from '../../helpers/jwt-helper'
import BookSearch from '../BookSearch/BookSearch'
import FilterForm, { BookFilter } from '../FilterForm/FilterForm'
import { Modal } from '../Modal/Modal'
import SortForm from '../SortForm/SortForm'
import './Header.css'

interface HeaderProps {
  jwt: Jwt | null
  setJwt: (jwt: Jwt | null) => void
  setSearch: (search: string) => void
  filters: BookFilter[]
  setFilters: React.Dispatch<React.SetStateAction<BookFilter[]>>
  sort: string[]
  setSort: React.Dispatch<React.SetStateAction<string[]>>
}

const Header: FC<HeaderProps> = ({ jwt, setJwt, setSearch, setFilters, setSort }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeModal, setActiveModal] = useState<'filter' | 'sort'>('filter')
  const [bookFilters, setBookFilters] = useState<BookFilter[]>([])
  const [bookSort, setBookSort] = useState<string[]>([])
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset

      setIsHeaderVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  const handleLogout = () => {
    clearAndNullifyJwt()
  }

  function clearAndNullifyJwt() {
    clearJwt()
    setJwt(null)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const showFilterModal = () => {
    setActiveModal('filter')
    setIsModalVisible(true)
  }

  const showSortModal = () => {
    setActiveModal('sort')
    setIsModalVisible(true)
  }

  const handleFilterAndSort = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (activeModal === 'filter') {
      setFilters(bookFilters)
    } else {
      setSort(bookSort)
    }
    setIsModalVisible(false)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  return (
    <nav className={`header ${!isHeaderVisible ? 'hidden' : ''}`}>
      <Modal
        isLoading={false}
        closeModal={handleCloseModal}
        isOpen={isModalVisible}
        title={activeModal === 'filter' ? 'Filter books' : 'Sort books'}
        confirmText={activeModal === 'filter' ? 'Filter' : 'Sort'}
        confirm={handleFilterAndSort}
      >
        {activeModal === 'filter' && (
          <FilterForm bookFilters={bookFilters} setBookFilters={setBookFilters} />
        )}
        {activeModal === 'sort' && <SortForm bookSort={bookSort} setBookSort={setBookSort} />}
      </Modal>

      <div className='header-left'></div>
      <div className='header-center'>
        {jwt?.accessToken && location.pathname === '/' && (
          <>
            <BookSearch handleSearch={handleSearch} />
            <button title='Filter books' onClick={showFilterModal} className='filter-button'>
              <FilterIcon size='100%' />
            </button>
            <button title='Sort books' onClick={showSortModal} className='sort-button'>
              <SortIcon size='100%' />
            </button>
          </>
        )}
      </div>
      <div className='header-right'>
        {!jwt?.accessToken ? (
          <Link to='/login' className='header-button'>
            Login
          </Link>
        ) : (
          <Link to='/' onClick={handleLogout} className='header-button'>
            Logout
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Header
