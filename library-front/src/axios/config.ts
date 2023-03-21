import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { JwtRole, roleKey, setJwt } from '../helpers/jwt-helper'
import { refreshAccessToken } from '../services/AuthService'
import { getItem } from '../services/StorageService'

const configureAxios = () => {
  axios.interceptors.request.use(
    async (config) => {
      let jwt = JSON.parse(getItem('jwt') || '{}')
      if (!jwt || !jwt?.accessToken) return config
      config.headers.Authorization = `Bearer ${jwt.accessToken}`
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
      if (![401, 403].includes(error.response?.status) || originalRequest._retry) {
        return Promise.reject(error)
      }
      originalRequest._retry = true
      const { data } = await refreshAccessToken()
      const role: JwtRole = jwtDecode(data.AccessToken)
      setJwt({
        accessToken: data.AccessToken,
        refreshToken: data.RefreshToken,
        expiration: data.Expiration,
        role: role[roleKey],
      })
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.AccessToken}`
      return axios(originalRequest)
    },
  )
}

export default configureAxios
