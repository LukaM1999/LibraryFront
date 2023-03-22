import jwtDecode from 'jwt-decode'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useJwt } from '../../App'
import { Jwt, JwtRole, roleKey, setJwt } from '../../helpers/jwt-helper'
import router from '../../router/router'
import { login, LoginRequest } from '../../services/AuthService'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import './LoginForm.css'

interface LoginProps {}

const LoginForm: FC<LoginProps> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setJwtToken } = useJwt()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loginRequest: LoginRequest = {
      Email: email,
      Password: password,
    }
    try {
      setIsLoading(true)
      const { data } = await login(loginRequest)
      if (!data) return
      const role: JwtRole = jwtDecode(data.AccessToken)
      const token: Jwt = {
        accessToken: data.AccessToken,
        refreshToken: data.RefreshToken,
        expiration: data.Expiration,
        role: role[roleKey],
      }
      updateJwt(token)
    } catch (error: any) {
      toast.error('Email or password incorrect')
      setIsLoading(false)
      throw new Error(error)
    }
    toast.success('Successfully logged in!')
    setIsLoading(false)
    router.navigate('/')
  }

  function updateJwt(token: Jwt) {
    setJwt(token)
    setJwtToken(token)
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
        disabled={isLoading}
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
        disabled={isLoading}
        onChange={(e) => setPassword(e.target.value)}
        required
        className='login-form-input'
        placeholder='Enter your password'
      />
      <br />
      <footer className='login-form-footer'>
        <button type='submit' className='login-form-submit-button'>
          {isLoading ? <LoadingSpinner /> : 'Login'}
        </button>
      </footer>
    </form>
  )
}

export default LoginForm
