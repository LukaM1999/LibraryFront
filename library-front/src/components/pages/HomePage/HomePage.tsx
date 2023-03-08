import { FC } from 'react'
import BookList from '../../BookList/BookList'
import './HomePage.css'

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => (
  <div className='home-page'>
    <BookList />
  </div>
)

export default HomePage
