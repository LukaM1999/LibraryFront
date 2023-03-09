import { FC, useState } from 'react'
import './RegisterForm.css'

interface RegisterProps {
  onRegister: (email: string, password: string) => void
}

const Register: FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    onRegister(email, password)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className='register-form'>
      <h2 className='register-form-title'>Register</h2>
      <label htmlFor='email'>Email</label>
      <input
        type='email'
        id='email'
        value={email}
        onChange={handleEmailChange}
        required
        placeholder='Enter a valid email address'
      />
      <br />
      <label htmlFor='password'>Password</label>
      <input
        type='password'
        id='password'
        value={password}
        onChange={handlePasswordChange}
        required
        placeholder='Enter a password'
      />
      <br />
      <label htmlFor='confirmPassword'>Confirm Password</label>
      <input
        type='password'
        id='confirmPassword'
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        required
        placeholder='Enter the password again'
      />
      <br />
      <button type='submit' className='register-button'>
        Register
      </button>
    </form>
  )
}

export default Register
