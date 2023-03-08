import { FC } from 'react'
import NavButton from '../NavButton/NavButton'
import { AiFillHome } from 'react-icons/ai'
import { FaUserAlt } from 'react-icons/fa'
import './Navbar.css'

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => (
  <>
    <label className='hamburger-menu'>
      <input type='checkbox' />
    </label>
    <aside className='sidebar'>
      <nav>
        <NavButton to='/' icon={<AiFillHome />} text='Home' />
        <NavButton to='/profile' icon={<FaUserAlt />} text='Profile' />
      </nav>
    </aside>
  </>
)

export default Navbar
