import { FC } from 'react'
import './ConfirmForm.css'

interface ConfirmFormProps {
  text: string
  confirmText?: string
  cancelText?: string
  decision: (isConfirmed: boolean) => void
}

const ConfirmForm: FC<ConfirmFormProps> = ({ text, confirmText, cancelText, decision }) => {
  return (
    <div className='confirm-form'>
      <h3>{text}</h3>
      <div className='confirm-form-actions'>
        <button className='confirm-form-ok-btn' onClick={() => decision(true)}>
          {confirmText ?? 'OK'}
        </button>
        <button className='confirm-form-cancel-btn' onClick={() => decision(false)}>
          {cancelText ?? 'Cancel'}
        </button>
      </div>
    </div>
  )
}

export default ConfirmForm
