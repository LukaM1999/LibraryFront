import React, { FC } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { FaUserAlt } from 'react-icons/fa'
import NavButton from '../NavButton/NavButton'
import './Footer.css'

interface FooterProps {}

const Footer: FC<FooterProps> = () => (
  <footer className='footer'>
    <NavButton to='/' icon={<AiFillHome />} text='Home' />
    <NavButton to='/profile' icon={<FaUserAlt />} text='Profile' />
  </footer>
)

export default Footer
