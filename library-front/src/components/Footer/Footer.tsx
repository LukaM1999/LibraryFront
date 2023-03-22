import { FC } from 'react'
import { AiFillHome as HomeIcon } from 'react-icons/ai'
import NavButton from '../NavButton/NavButton'
import './Footer.css'

interface FooterProps {}

const Footer: FC<FooterProps> = () => (
  <footer className='footer'>
    <NavButton to='/' icon={<HomeIcon />} text='Home' />
  </footer>
)

export default Footer
