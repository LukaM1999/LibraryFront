import React, { FC } from 'react'
import { Book } from '../BookList/BookList'
import './BookCard.css'

interface BookCardProps {
  book: Book
}

const BookCard: FC<BookCardProps> = ({ book }) => (
  <div className='book-card'>
    <p>{book.title}</p>
  </div>
)

export default BookCard
