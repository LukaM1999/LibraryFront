import { FC, RefObject, useEffect } from 'react'
import './Dialog.css'

interface DialogProps {
  dialogRef: RefObject<HTMLDialogElement>
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirm: () => void
}

const Dialog: FC<DialogProps> = ({
  dialogRef,
  title,
  description,
  confirmText,
  cancelText,
  confirm,
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modalContent = document.querySelector('.dialog-content')

      if (modalContent && !modalContent.contains(event.target as Node)) {
        dialogRef.current?.close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleConfirm = () => {
    confirm()
    dialogRef.current?.close()
  }

  return (
    <dialog ref={dialogRef} className='dialog'>
      <div className='dialog-container'>
        <div className='dialog-content'>
          <div className='dialog-header'>
            <button
              type='button'
              className='dialog-close-button'
              onClick={() => dialogRef.current?.close()}
            >
              X
            </button>
          </div>
          <div className='confirm-form'>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            <div className='confirm-form-actions'>
              <button
                className='confirm-form-cancel-btn'
                onClick={() => dialogRef.current?.close()}
              >
                {cancelText ?? 'Cancel'}
              </button>
              <button className='confirm-form-ok-btn' onClick={handleConfirm}>
                {confirmText ?? 'OK'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default Dialog
