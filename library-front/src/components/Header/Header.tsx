import { FC } from 'react'
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
    <nav className='header'>
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
