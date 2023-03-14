import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearJwt, Jwt } from '../../helpers/jwt-helper'
import BookSearch from '../BookSearch/BookSearch'
import './Header.css'

interface HeaderProps {
  jwt: Jwt | null
  setJwt: (jwt: Jwt | null) => void
  setSearch: (search: string) => void
}

const Header: FC<HeaderProps> = ({ jwt, setJwt, setSearch }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)

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

  return (
    <nav className={`header ${!isHeaderVisible ? 'hidden' : ''}`}>
      <div className='header-center'>
        {jwt?.accessToken ? <BookSearch handleSearch={handleSearch} /> : null}
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
