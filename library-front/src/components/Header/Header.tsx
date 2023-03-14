import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearJwt, Jwt } from '../../helpers/jwt-helper'
import BookSearch from '../BookSearch/BookSearch'
import { TbFilter as FilterIcon } from 'react-icons/tb'
import { BiSort as SortIcon } from 'react-icons/bi'
import './Header.css'
import FilterForm, { BookFilter } from '../FilterForm/FilterForm'
import { Modal } from '../Modal/Modal'
import SortForm from '../SortForm/SortForm'

interface HeaderProps {
  jwt: Jwt | null
  setJwt: (jwt: Jwt | null) => void
  setSearch: (search: string) => void
  filters: BookFilter[]
  setFilters: React.Dispatch<React.SetStateAction<BookFilter[]>>
  sort: (string | undefined)[] | undefined
  setSort: React.Dispatch<React.SetStateAction<(string | undefined)[] | undefined>>
}

const Header: FC<HeaderProps> = ({
  jwt,
  setJwt,
  setSearch,
  filters,
  setFilters,
  sort,
  setSort,
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [sortModalVisible, setSortModalVisible] = useState(false)

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
    setFilterModalVisible(true)
  }

  const hideFilterModal = () => {
    setFilterModalVisible(false)
  }

  const showSortModal = () => {
    setSortModalVisible(true)
  }

  const hideSortModal = () => {
    setSortModalVisible(false)
  }

  return (
    <nav className={`header ${!isHeaderVisible ? 'hidden' : ''}`}>
      <Modal
        id='filterModal'
        closeModal={() => {
          setFilterModalVisible(false)
        }}
        isOpen={filterModalVisible}
      >
        <FilterForm bookFilters={filters} setBookFilters={setFilters} hideModal={hideFilterModal} />
      </Modal>
      <Modal
        id='sortModal'
        closeModal={() => {
          setSortModalVisible(false)
        }}
        isOpen={sortModalVisible}
      >
        <SortForm bookSort={sort} setBookSort={setSort} hideModal={hideSortModal} />
      </Modal>
      <div className='header-left'></div>
      <div className='header-center'>
        {jwt?.accessToken ? (
          <>
            <BookSearch handleSearch={handleSearch} />
            <button title='Filter books' onClick={showFilterModal} className='filter-button'>
              <FilterIcon size='100%' />
            </button>
            <button title='Sort books' onClick={showSortModal} className='sort-button'>
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
