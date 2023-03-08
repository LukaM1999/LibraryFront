import { FC } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <nav className='header'>
      <div className='header-center'></div>
      <div className='header-right'>
        <Link to='/login' className='header-button'>
          Login
        </Link>
        <Link to='/register' className='header-button register'>
          Register
        </Link>
      </div>
    </nav>
  )
}

export default Header
