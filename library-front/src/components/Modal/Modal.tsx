import { FC, ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import './Modal.css'
import { addModal } from './ModalManager'

interface ModalProps {
  id: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal: FC<ModalProps> = ({ id, isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalContent = document.querySelector('.modal-content')

      if (modalContent && !modalContent.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      addModal(id, onClose)
      document.addEventListener('keydown', handleEscapeKey)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

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
      <div className='modal-overlay' onClick={onClose} />
      <div className='modal-content' ref={modalRef}>
        <button className='close-button' onClick={onClose}>
          X
        </button>
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
    <Modal id={modalId} isOpen={true} onClose={handleClose}>
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
