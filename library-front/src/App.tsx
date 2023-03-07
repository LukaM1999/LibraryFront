import { RouterProvider } from 'react-router'
import './App.css'
import router from './router/router'
import axios from 'axios'
import { refreshToken } from './services/AuthService'
import { setJwt } from './helpers/jwt-helper'

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
    if (
      (error.response.status === 403 || error.response.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      const { data } = await refreshToken()
      setJwt(data.accessToken, data.refreshToken, data.expiration)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
      return axios(originalRequest)
    }
    return Promise.reject(error)
  },
)

function App() {
  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
