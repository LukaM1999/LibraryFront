import { FC } from 'react'
import BookList from '../../BookList/BookList'
import './HomePage.css'

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => (
  <div className='home-container'>
    <BookList />
  </div>
)

export default HomePage
