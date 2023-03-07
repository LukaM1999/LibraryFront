import { FC } from 'react'
import LoginForm from '../LoginForm/LoginForm'
import showModal from '../Modal/Modal'
import { removeModal } from '../Modal/ModalManager'
import './Header.css'

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const handleOpenModal = () => {
    const modalId = crypto.randomUUID()
    const modalContent = <LoginForm modalId={modalId} onClose={() => removeModal(modalId)} />

    showModal(modalId, modalContent)
  }

  return (
    <nav className='header'>
      <button onClick={handleOpenModal}>Open Modal</button>
    </nav>
  )
}

export default Header
