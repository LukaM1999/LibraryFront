import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import BookDetails from '../components/BookDetails/BookDetails'
import LoginForm from '../components/LoginForm/LoginForm'
import HomePage from '../components/pages/HomePage/HomePage'
import { isLoggedIn } from '../services/AuthService'

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
        path: '/book-details/:id',
        element: isLoggedIn() ? <BookDetails /> : <LoginForm />,
      },
    ],
  },
])

export default router
