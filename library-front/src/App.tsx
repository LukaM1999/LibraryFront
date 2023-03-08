import { Outlet } from 'react-router'
import axios from 'axios'
import { refreshToken } from './services/AuthService'
import { setJwt } from './helpers/jwt-helper'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import './App.css'

axios.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken')
    if (!token) return config
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (![401, 403].includes(error.response.status) || originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true
    const { data } = await refreshToken()
    setJwt(data.accessToken, data.refreshToken, data.expiration)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
    return axios(originalRequest)
  },
)

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <div className='app'>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default App
