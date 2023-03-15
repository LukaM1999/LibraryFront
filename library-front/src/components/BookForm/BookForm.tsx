import { FC, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { getAllAuthors, createAuthor } from '../../services/AuthorService'
import { createBook, getBook } from '../../services/BookService'
import { Author } from '../BookList/BookList'
import './BookForm.css'
import { HiUserAdd as AddAuthorIcon } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

interface BookFormProps {
  bookId?: number
  hideModal: () => void
}

interface AuthorOption {
  label: string
  value: Author
}

const BookForm: FC<BookFormProps> = ({ bookId, hideModal }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [authors, setAuthors] = useState<AuthorOption[]>([])
  const [authorOptions, setAuthorOptions] = useState<AuthorOption[]>([])
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState<number | undefined>(1)
  const [cover, setCover] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<string | undefined>()
  const [publishDate, setPublishDate] = useState<Date>(new Date())
  const [authorFormVisible, setAuthorFormVisible] = useState(false)
  const [authorFirstName, setAuthorFirstName] = useState('')
  const [authorLastName, setAuthorLastName] = useState('')
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const { invalidateQueries } = useQueryClient()

  useEffect(() => {
    if (bookId) {
      getBook(bookId).then(({ data }) => {
        setTitle(data.Title)
        setDescription(data.Description)
        console.log(data)
        setAuthors(
          data.Authors.map((author) => ({
            label: `${author.FirstName} ${author.LastName}`,
            value: author,
          })),
        )
        setIsbn(data.Isbn)
        setQuantity(data.Quantity)
        setPublishDate(data.PublishDate)
        setCoverImage(`data:image/png;base64,${data.Cover}`)
      })
    }

    getAllAuthors().then(({ data }) => {
      setAuthorOptions(
        data.map((author) => ({
          label: `${author.FirstName} ${author.LastName}`,
          value: author,
        })),
      )
    })
  }, [])

  const createNewAuthor = async () => {
    const author: Author = {
      Id: 0,
      FirstName: authorFirstName,
      LastName: authorLastName,
    }

    await createAuthor(author)

    toast.success('Author created successfully!')

    const { data } = await getAllAuthors()

    setAuthorOptions(
      data.map((author) => ({
        label: `${author.FirstName} ${author.LastName}`,
        value: author,
      })),
    )

    setAuthorFormVisible(false)
    setAuthorFirstName('')
    setAuthorLastName('')
  }

  const createNewBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('Title', title)
    formData.append('Description', description)
    formData.append('Isbn', isbn)
    formData.append('PublishDate', publishDate.toISOString())
    formData.append('Quantity', quantity?.toString() || '1')
    authors.forEach((author) => formData.append('AuthorIds', author.value.Id.toString()))
    if (cover) {
      formData.append('Cover', cover)
    }

    await createBook(formData)

    invalidateQueries({ queryKey: ['books'] })

    hideModal()
    toast.success('Book created successfully!')
  }

  const showAuthorForm = () => {
    setAuthorFormVisible(true)
  }

  const handleCoverClick = () => {
    if (!hiddenFileInput.current) return
    hiddenFileInput.current.click()
  }
  const handleFileChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    if (!currentTarget.files) return
    const files = currentTarget.files
    const reader = new FileReader()
    if (!files) return
    reader.readAsDataURL(files[0])
    setCover(files[0])
    reader.onloadend = function () {
      const base64data = reader.result
      if (!base64data) return
      setCoverImage(base64data.toString())
    }
  }

  return (
    <form className='book-form' onSubmit={createNewBook}>
      <div className='book-form-row'>
        <label>Cover</label>
        <img
          onClick={handleCoverClick}
          className='book-cover'
          src={coverImage ?? './book-cover-placeholder.png'}
          alt='Book Cover'
          title='Click to change cover'
        />
        <input
          type='file'
          id='file'
          name='file'
          ref={hiddenFileInput}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className='book-form-row'>
        <label>Title</label>
        <input type='text' required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className='book-form-row'>
        <label>Description</label>
        <textarea value={description} required onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='book-form-row'>
        <label>ISBN</label>
        <input type='text' value={isbn} required onChange={(e) => setIsbn(e.target.value)} />
      </div>
      <div className='book-form-row'>
        <label>Publish Date</label>
        <input
          type='date'
          value={publishDate?.toString()}
          required
          onChange={(e) => setPublishDate(new Date(e.target.value))}
        />
      </div>
      <div className='book-form-row'>
        <label>Quantity</label>
        <input
          type='number'
          min='1'
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
        />
      </div>
      <div className='book-form-row'>
        <label>Authors</label>
        <div className='book-form-column'>
          <Select
            options={authorOptions}
            isMulti
            isSearchable
            value={authors}
            isClearable={false}
            placeholder='Select authors...'
            onChange={(selectedOptions) => {
              setAuthors([...selectedOptions])
            }}
          />
          <button
            type='button'
            className='add-author-btn'
            title='Add new author'
            onClick={showAuthorForm}
          >
            <AddAuthorIcon size='100%' />
          </button>
        </div>
      </div>
      {authorFormVisible && (
        <div className='book-form-row'>
          <label>New Author</label>
          <div className='book-form-row'>
            <label>Author First Name</label>
            <input
              type='text'
              value={authorFirstName}
              onChange={(e) => setAuthorFirstName(e.target.value)}
            />
          </div>
          <div className='book-form-row'>
            <label>Author Last Name</label>
            <input
              type='text'
              value={authorLastName}
              onChange={(e) => setAuthorLastName(e.target.value)}
            />
          </div>
          <div className='book-form-row'>
            <button
              type='button'
              className='create-author-btn'
              title='Create new author'
              onClick={createNewAuthor}
            >
              Create author
            </button>
          </div>
        </div>
      )}
      {!bookId && (
        <div className='book-form-row'>
          <button type='submit' className='create-book-btn' title='Create new book'>
            Create book
          </button>
        </div>
      )}
      {bookId && (
        <div className='book-form-row'>
          <button type='submit' className='create-book-btn' title='Update book'>
            Update book
          </button>
        </div>
      )}
    </form>
  )
}

export default BookForm
