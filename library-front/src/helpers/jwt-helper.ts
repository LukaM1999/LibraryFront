export const setJwt = (accessToken: string, refreshToken: string, expiration: Date) => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('expiration', expiration.toString())
}

export const clearJwt = () => {
  localStorage.setItem('accessToken', '')
  localStorage.setItem('refreshToken', '')
  localStorage.setItem('expiration', '')
}
