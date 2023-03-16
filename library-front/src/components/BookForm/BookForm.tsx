import { FC, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { getAllAuthors, createAuthor } from '../../services/AuthorService'
import { createBook, getBook, updateBook } from '../../services/BookService'
import { Author, BookPage } from '../BookList/BookList'
import './BookForm.css'
import { HiUserAdd as AddAuthorIcon } from 'react-icons/hi'
import { MdHideImage as RemoveImageIcon } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import convertBase64ToBlob from '../../helpers/image-helper'

interface BookFormProps {
  bookId?: number
  hideModal: () => void
}

interface AuthorOption {
  label: string
  value: number
}

const BookForm: FC<BookFormProps> = ({ bookId, hideModal }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [authors, setAuthors] = useState<AuthorOption[]>([])
  const [authorOptions, setAuthorOptions] = useState<AuthorOption[]>([])
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState<number | undefined>(1)
  const [cover, setCover] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<string | undefined>('')
  const [publishDate, setPublishDate] = useState<Date | null>(null)
  const [authorFormVisible, setAuthorFormVisible] = useState(false)
  const [authorFirstName, setAuthorFirstName] = useState('')
  const [authorLastName, setAuthorLastName] = useState('')
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (bookId) {
      getBook(bookId).then(({ data }) => {
        setTitle(data.Title)
        setDescription(data.Description)
        setAuthors(
          data.Authors.map((author) => ({
            label: `${author.Firstname} ${author.Lastname}`,
            value: author.Id,
          })),
        )
        setIsbn(data.ISBN)
        setQuantity(data.Quantity)
        setPublishDate(data.PublishDate)
        if (data.Cover) {
          setCoverImage(`data:image/png;base64,${data.Cover}`)
        }
      })
    }

    getAllAuthors().then(({ data }) => {
      setAuthorOptions(
        data.map((author) => ({
          label: `${author.FirstName} ${author.LastName}`,
          value: author.Id,
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

    await createAuthor(author).catch((error) => {
      toast.error('Error creating author')
      throw new Error(error)
    })

    toast.success('Author created successfully!')

    const { data } = await getAllAuthors().catch((error) => {
      toast.error('Error retrieving authors')
      throw new Error(error)
    })

    setAuthorOptions(
      data.map((author) => ({
        label: `${author.FirstName} ${author.LastName}`,
        value: author.Id,
      })),
    )

    setAuthorFormVisible(false)
    setAuthorFirstName('')
    setAuthorLastName('')
  }

  const handleBookFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (bookId) {
      await updateSelectedBook()
      return
    }
    await createNewBook()
  }

  const updateSelectedBook = async () => {
    const formData = new FormData()
    formData.append('Id', bookId?.toString() || '')
    formData.append('Title', title)
    formData.append('Description', description)
    formData.append('Isbn', isbn)
    formData.append('PublishDate', publishDate ? new Date(publishDate).toUTCString() : '')
    formData.append('Quantity', quantity?.toString() || '1')
    authors.forEach((author) => formData.append('AuthorIds', author.value.toString()))
    formData.append('Cover', coverImage ? convertBase64ToBlob(coverImage) : '')

    await updateBook(formData).catch((error) => {
      toast.error('Error updating book')
      throw new Error(error)
    })

    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) => lastPage.books.some((book) => book.Id === bookId),
    })

    hideModal()
    toast.success('Book updated successfully!')
  }

  const createNewBook = async () => {
    const formData = new FormData()
    formData.append('Title', title)
    formData.append('Description', description)
    formData.append('Isbn', isbn)
    if (publishDate) {
      formData.append('PublishDate', publishDate.toISOString())
    }
    formData.append('Quantity', quantity?.toString() || '1')
    authors.forEach((author) => formData.append('AuthorIds', author.value.toString()))
    if (cover) {
      formData.append('Cover', cover)
    }

    await createBook(formData).catch((error) => {
      toast.error('Error creating book')
      throw new Error(error)
    })

    queryClient.invalidateQueries({
      queryKey: ['books'],
      refetchPage: (lastPage: BookPage) => !!!lastPage.nextPage,
    })

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

  const removeImage = () => {
    setCoverImage('')
    setCover(null)
  }

  return (
    <form className='book-form' onSubmit={handleBookFormSubmit}>
      <div className='book-form-row'>
        <label>Cover</label>
        <div className='book-cover-container'>
          <img
            onClick={handleCoverClick}
            className='book-cover'
            src={coverImage ? coverImage : './book-cover-placeholder.png'}
            alt='Book Cover'
            title='Click to change cover'
          />
          {coverImage && (
            <button
              type='button'
              className='remove-image-btn'
              title='Remove image'
              onClick={removeImage}
            >
              <RemoveImageIcon size='100%' />
            </button>
          )}
        </div>
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
          value={publishDate ? new Intl.DateTimeFormat('en-CA').format(new Date(publishDate)) : ''}
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

      <div className='book-form-row'>
        <button type='submit' className='create-book-btn' title='Create new book'>
          {bookId ? 'Update Book' : 'Create book'}
        </button>
      </div>
    </form>
  )
}

export default BookForm
