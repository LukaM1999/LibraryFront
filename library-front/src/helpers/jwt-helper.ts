export const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

export interface JwtRole {
  [roleKey]: string
}

export interface Jwt {
  accessToken: string
  refreshToken: string
  expiration: Date
  role: string
}

export const setJwt = (jwt: Jwt) => {
  localStorage.setItem('jwt', JSON.stringify(jwt))
}

export const clearJwt = () => {
  localStorage.removeItem('jwt')
}
