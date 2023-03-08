export interface JwtRole {
  ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']: string
}

export const setJwt = (
  accessToken: string,
  refreshToken: string,
  expiration: Date,
  role: string,
) => {
  const jwt = {
    accessToken,
    refreshToken,
    expiration: expiration.toString(),
    role,
  }
  localStorage.setItem('jwt', JSON.stringify(jwt))
}

export const clearJwt = () => {
  localStorage.removeItem('jwt')
}
