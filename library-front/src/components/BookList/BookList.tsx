import { FC } from 'react'
import BookCard from '../BookCard/BookCard'
import './BookList.css'

interface BookListProps {}

const BookList: FC<BookListProps> = () => (
  <div className='book-list'>
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
  </div>
)

export default BookList
