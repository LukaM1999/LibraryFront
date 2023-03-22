import { FC, FormEvent, ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  isLoading: boolean
  closeModal: () => void
  confirm: (event: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  title?: string
  cancelText?: string
  confirmText?: string
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  isLoading,
  closeModal,
  confirm,
  children,
  title,
  cancelText,
  confirmText,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    if (isOpen) {
      document.body.style.overflowY = 'hidden'
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflowY = 'visible'
    }
  }, [isOpen, closeModal])

  const modalRef = useRef<HTMLFormElement>(null)

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
      <form onSubmit={confirm} className='modal-content' ref={modalRef}>
        <div className='modal-header'>
          <h3>{title}</h3>
          <button type='button' className='close-button' onClick={closeModal}>
            X
          </button>
        </div>
        {children}
        <div className='modal-footer'>
          <button type='button' className='modal-cancel-btn' onClick={closeModal}>
            {cancelText ?? 'Cancel'}
          </button>
          <button type='submit' className='modal-confirm-btn'>
            {!isLoading ? confirmText ? confirmText : 'Confirm' : <LoadingSpinner />}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
