import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import BookList from '../components/BookList/BookList'
import LoginForm from '../components/LoginForm/LoginForm'
import HomePage from '../components/pages/HomePage/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginForm />,
      },
      {
        path: '/profile',
        element: <LoginForm />,
      },
    ],
  },
])

export default router
