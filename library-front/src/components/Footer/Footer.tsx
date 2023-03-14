import React, { FC } from 'react'
import { AiFillHome as HomeIcon } from 'react-icons/ai'
import { FaUserAlt as ProfileIcon } from 'react-icons/fa'
import NavButton from '../NavButton/NavButton'
import './Footer.css'

interface FooterProps {}

const Footer: FC<FooterProps> = () => (
  <footer className='footer'>
    <NavButton to='/' icon={<HomeIcon />} text='Home' />
    <NavButton to='/profile' icon={<ProfileIcon />} text='Profile' />
  </footer>
)

export default Footer
