import { FC, useState } from 'react'
import showModal from '../Modal/Modal'
import { removeModal } from '../Modal/ModalManager'
import RegisterForm from '../RegisterForm/RegisterForm'
import './LoginForm.css'

interface LoginProps {
  modalId: string
  onClose: () => void
}

const LoginForm: FC<LoginProps> = ({ modalId, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Submitting login form')
    onClose()
  }

  const handleRegister = () => {
    console.log('Registering')
    onClose()
    showModal(modalId, <RegisterForm onRegister={() => {}} />)
  }

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <h2 className='login-form-title'>Login</h2>
      <label htmlFor='email' className='login-form-label'>
        Email
      </label>
      <input
        type='email'
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className='login-form-input'
        placeholder='Enter a valid email address'
      />
      <br />
      <label htmlFor='password' className='login-form-label'>
        Password
      </label>
      <input
        type='password'
        id='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className='login-form-input'
        placeholder='Enter your password'
      />
      <br />
      <footer className='login-form-footer'>
        <button type='submit' className='login-form-login-button'>
          Login
        </button>
        <button className='login-form-register-button' type='button' onClick={handleRegister}>
          Register
        </button>
      </footer>
    </form>
  )
}

export default LoginForm
