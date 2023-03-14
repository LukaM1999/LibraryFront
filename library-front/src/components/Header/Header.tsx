import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearJwt, Jwt } from '../../helpers/jwt-helper'
import BookSearch from '../BookSearch/BookSearch'
import { TbFilter as FilterIcon } from 'react-icons/tb'
import { BiSort as SortIcon } from 'react-icons/bi'
import './Header.css'
import FilterForm, { BookFilter } from '../FilterForm/FilterForm'
import { Modal } from '../Modal/Modal'

interface HeaderProps {
  jwt: Jwt | null
  setJwt: (jwt: Jwt | null) => void
  setSearch: (search: string) => void
  filters: BookFilter[]
  setFilters: React.Dispatch<React.SetStateAction<BookFilter[]>>
}

const Header: FC<HeaderProps> = ({ jwt, setJwt, setSearch, filters, setFilters }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)

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

  const handleFilter = () => {
    setModalVisible(true)
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  return (
    <nav className={`header ${!isHeaderVisible ? 'hidden' : ''}`}>
      <Modal
        id={crypto.randomUUID()}
        closeModal={() => {
          setModalVisible(false)
        }}
        isOpen={modalVisible}
      >
        <FilterForm bookFilters={filters} setBookFilters={setFilters} hideModal={hideModal} />
      </Modal>
      <div className='header-left'></div>
      <div className='header-center'>
        {jwt?.accessToken ? (
          <>
            <BookSearch handleSearch={handleSearch} />
            <button title='Filter books' onClick={handleFilter} className='filter-button'>
              <FilterIcon size='100%' />
            </button>
            <button title='Sort books' className='sort-button'>
              <SortIcon size='100%' />
            </button>
          </>
        ) : null}
      </div>
      <div className='header-right'>
        {!jwt?.accessToken ? (
          <>
            <Link to='/login' className='header-button'>
              Login
            </Link>
            <Link to='/register' className='header-button register'>
              Register
            </Link>
          </>
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
