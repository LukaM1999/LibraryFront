import { FC, useState } from 'react'
import { setJwt } from '../../helpers/jwt-helper'
import { login, LoginRequest } from '../../services/AuthService'
import './LoginForm.css'

interface LoginProps {}

const LoginForm: FC<LoginProps> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loginRequest: LoginRequest = {
      email,
      password,
    }
    const { data } = await login(loginRequest)
    if (!data) return

    setJwt(data.accessToken, data.refreshToken, data.expiration)
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
      </footer>
    </form>
  )
}

export default LoginForm
