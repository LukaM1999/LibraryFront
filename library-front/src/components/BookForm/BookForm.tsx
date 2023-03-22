import { FC, useEffect, useRef, useState } from 'react'
import { HiUserAdd as AddAuthorIcon } from 'react-icons/hi'
import { MdHideImage as RemoveImageIcon } from 'react-icons/md'
import Select from 'react-select'
import { toast } from 'react-toastify'
import bookCoverPlaceholder from '../../assets/book-cover-placeholder.png'
import { Author, Book } from '../BookList/BookList'
import './BookForm.css'

interface BookFormProps {
  book?: Book | null
  allAuthors: Author[]
  setBookFormData: React.Dispatch<React.SetStateAction<FormData | null>>
  authorData: Author | null
  setAuthorData: React.Dispatch<React.SetStateAction<Author | null>>
  createNewAuthor: () => void
}

interface AuthorOption {
  label: string
  value: number
}

const maxImageSize = 5 * 1024 * 1024

const BookForm: FC<BookFormProps> = ({
  book = null,
  allAuthors,
  setBookFormData,
  authorData,
  setAuthorData,
  createNewAuthor,
}) => {
  const [authors, setAuthors] = useState<AuthorOption[]>([])
  const [authorOptions, setAuthorOptions] = useState<AuthorOption[]>([])
  const [coverImage, setCoverImage] = useState<string | undefined>('')
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAuthorOptions(
      allAuthors?.map((author) => ({
        label: `${author.FirstName} ${author.LastName}`,
        value: author.Id,
      })),
    )
  }, [allAuthors])

  useEffect(() => {
    if (!book) return

    if (book.Cover) {
      setCoverImage(`data:image/png;base64,${book.Cover}`)
    }

    const selectedAuthors = book.Authors.map((author) => ({
      label: `${author.FirstName} ${author.LastName}`,
      value: author.Id,
    }))

    setAuthors(selectedAuthors)
  }, [book])

  const handleInputChange = (field: string, value: string) => {
    setBookFormData((prev) => {
      if (!prev) return null
      prev.set(field, value)
      return prev
    })
  }

  const handleAuthorsChange = (selectedAuthors: AuthorOption[]) => {
    setAuthors(selectedAuthors)
    setBookFormData((prev) => {
      if (!prev) return null
      prev.delete('AuthorIds')
      selectedAuthors.forEach((author) => prev.append('AuthorIds', author.value.toString()))
      return prev
    })
  }

  const showAuthorForm = () => {
    setAuthorData({
      Id: 0,
      FirstName: '',
      LastName: '',
    })
  }

  const handleCoverClick = () => {
    if (!hiddenFileInput.current) return
    hiddenFileInput.current.click()
  }

  const handleFileChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    if (!currentTarget.files) return
    const files = currentTarget.files
    const reader = new FileReader()
    if (!files || files.length === 0) return

    if (!files[0]?.type.match(/^image\//)) {
      toast.warn('Please select an image file')
      return
    }

    if (files[0]?.size > maxImageSize) {
      toast.warn('Selected image must be less than 5MB in size')
      return
    }

    reader.readAsDataURL(files[0])
    setBookFormData((prev) => {
      if (!prev) return null
      prev.set('Cover', files[0])
      return prev
    })
    reader.onloadend = function () {
      const base64data = reader.result
      if (!base64data) return
      setCoverImage(base64data.toString())
    }
  }

  const removeImage = () => {
    setCoverImage('')
    setBookFormData((prev) => {
      if (!prev) return null
      prev.delete('Cover')
      return prev
    })
  }

  return (
    <div className='book-form'>
      <div className='book-form-row'>
        <label>Cover</label>
        <div className='book-cover-container'>
          <img
            onClick={handleCoverClick}
            className='book-cover'
            src={coverImage ? coverImage : bookCoverPlaceholder}
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
          accept='image/png, image/jpeg, image/jpg, image/gif, image/bmp'
          ref={hiddenFileInput}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className='book-form-row'>
        <label>Title</label>
        <input
          type='text'
          required
          defaultValue={book?.Title}
          onChange={(e) => handleInputChange('Title', e.target.value)}
        />
      </div>
      <div className='book-form-row'>
        <label>Description</label>
        <textarea
          defaultValue={book?.Description}
          required
          onChange={(e) => handleInputChange('Description', e.target.value)}
        />
      </div>
      <div className='book-form-row'>
        <label>ISBN</label>
        <input
          type='text'
          defaultValue={book?.Isbn}
          required
          onChange={(e) => handleInputChange('ISBN', e.target.value)}
        />
      </div>
      <div className='book-form-row'>
        <label>Publish Date</label>
        <input
          type='date'
          defaultValue={
            book?.PublishDate
              ? new Intl.DateTimeFormat('en-CA').format(new Date(book.PublishDate))
              : ''
          }
          onChange={(e) => handleInputChange('PublishDate', e.target.value)}
        />
      </div>
      <div className='book-form-row'>
        <label>Quantity</label>
        <input
          type='number'
          min='1'
          defaultValue={book?.Quantity}
          onChange={(e) => handleInputChange('Quantity', e.target.value)}
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
            styles={{
              menu: (baseStyles) => ({
                ...baseStyles,
                position: 'sticky',
              }),
            }}
            menuPlacement='auto'
            onChange={(selectedOptions) => handleAuthorsChange([...selectedOptions])}
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
      {authorData && (
        <div className='book-form-row author-form'>
          <label>New Author</label>
          <div className='book-form-row'>
            <label>Author First Name</label>
            <input
              type='text'
              value={authorData?.FirstName}
              onChange={(e) =>
                setAuthorData((prev) => {
                  if (!prev) return null
                  return { ...prev, FirstName: e.target.value }
                })
              }
            />
          </div>
          <div className='book-form-row'>
            <label>Author Last Name</label>
            <input
              type='text'
              value={authorData?.LastName}
              onChange={(e) =>
                setAuthorData((prev) => {
                  if (!prev) return null
                  return { ...prev, LastName: e.target.value }
                })
              }
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
    </div>
  )
}

export default BookForm
