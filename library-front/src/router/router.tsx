import { createBrowserRouter } from 'react-router-dom'
import LoginForm from '../components/LoginForm/LoginForm'
import HomePage from '../components/pages/HomePage/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
])

export default router
