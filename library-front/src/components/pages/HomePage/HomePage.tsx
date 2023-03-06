import { FC } from 'react'
import BookCard from '../../BookCard/BookCard'
import Footer from '../../Footer/Footer'
import Header from '../../Header/Header'
import Navbar from '../../Navbar/Navbar'
import './HomePage.css'

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => (
  <div className='home-page'>
    <Header />
    <Navbar />
    <div className='home-container'>
      <BookCard />
      <BookCard />
      <BookCard />
      <BookCard />
    </div>
    <Footer />
  </div>
)

export default HomePage
