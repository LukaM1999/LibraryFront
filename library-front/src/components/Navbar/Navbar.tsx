import { FC } from 'react'
import { AiFillHome as HomeIcon } from 'react-icons/ai'
import NavButton from '../NavButton/NavButton'
import './Navbar.css'

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => (
  <>
    <label className='hamburger-menu'>
      <input type='checkbox' />
    </label>
    <aside className='sidebar'>
      <nav>
        <NavButton to='/' icon={<HomeIcon />} text='Home' />
      </nav>
    </aside>
  </>
)

export default Navbar
