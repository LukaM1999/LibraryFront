import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'
import './NavButton.css'

interface NavButtonProps {
  to: string
  icon: React.ReactNode
  text: string
}

const NavButton: FC<NavButtonProps> = ({ to, icon, text }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div className={isActive ? 'nav-button active' : 'nav-button'}>
          <div className='icon'>{icon}</div>
          <div className='text'>{text}</div>
        </div>
      )}
    </NavLink>
  )
}

export default NavButton
