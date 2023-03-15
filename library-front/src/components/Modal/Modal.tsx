import { FC, ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import './Modal.css'
import { addModal } from './ModalManager'

interface ModalProps {
  id: string
  isOpen: boolean
  closeModal: () => void
  children: ReactNode
}

export const Modal: FC<ModalProps> = ({ id, isOpen, closeModal, children }) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalContent = document.querySelector('.modal-content')

      if (modalContent && !modalContent.contains(event.target as Node)) {
        closeModal()
      }
    }

    if (isOpen) {
      addModal(id, closeModal)
      document.body.style.overflowY = 'hidden'
      document.addEventListener('keydown', handleEscapeKey)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflowY = 'visible'
    }
  }, [isOpen, closeModal])

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (modalRef.current) {
      if (isOpen) {
        modalRef.current.classList.remove('hide')
        modalRef.current.classList.add('show')
      } else {
        modalRef.current.classList.remove('show')
        modalRef.current.classList.add('hide')
      }
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return ReactDOM.createPortal(
    <div className={`modal ${isOpen ? 'show' : 'hide'}`}>
      <div className='modal-overlay' onClick={closeModal} />
      <div className='modal-content' ref={modalRef}>
        <div className='modal-header'>
          <button className='close-button' onClick={closeModal}>
            X
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

const showModal = (modalId: string, content: ReactNode) => {
  const handleClose = () => {
    modalRootNode.unmount()
    modalRoot.remove()
    document.body.style.overflow = 'auto'
  }

  const modal = (
    <Modal id={modalId} isOpen={true} closeModal={handleClose}>
      {content}
    </Modal>
  )

  const modalRoot = document.createElement('div')
  modalRoot.setAttribute('id', 'modal-root')
  document.body.appendChild(modalRoot)

  const modalRootNode = createRoot(modalRoot)
  modalRootNode.render(modal)

  document.body.style.overflow = 'hidden'

  const closeButton = document.querySelector('.close-button')
  if (closeButton) {
    closeButton.addEventListener('click', handleClose)
  }
}

export default showModal
