import { ChangeEvent, FC, MouseEventHandler, useState } from 'react'
import './FilterForm.css'
import Select from 'react-select'
import { SiAddthis as AddFilterIcon } from 'react-icons/si'
import { MdDeleteForever as RemoveFilterIcon } from 'react-icons/md'
import { WhereBookQuery } from '../../services/BookService'
import { SingleValue } from 'react-select/dist/declarations/src'
import { Form } from 'react-router-dom'

interface FilterFormProps {
  bookFilters: BookFilter[]
  setBookFilters: React.Dispatch<React.SetStateAction<BookFilter[]>>
  hideModal: () => void
}

export interface BookFilter extends WhereBookQuery {
  id: string
}

interface FilterField {
  label: string
  value: string
}

const fieldOptions: FilterField[] = [
  { label: 'Author First Name', value: 'Authors.Firstname' },
  { label: 'Author Last Name', value: 'Authors.Lastname' },
]

const FilterForm: FC<FilterFormProps> = ({ bookFilters, setBookFilters, hideModal }) => {
  const [value, setValue] = useState<FilterField | null>(fieldOptions[0])
  const [filters, setFilters] = useState<BookFilter[]>(bookFilters)

  const handleAddFilter = () => {
    if (!value) return
    const newFilter: BookFilter = {
      id: crypto.randomUUID(),
      Field: value.value,
      Value: '',
      Operation: 2,
    }
    setFilters((filters) => [...filters, newFilter])
  }

  const handleFilterFieldChange = (newValue: SingleValue<FilterField>) => {
    setValue(newValue)
  }

  const handleFilterValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filter: BookFilter,
  ) => {
    filter.Value = event.target.value
    setFilters((filters) => [...filters.filter((f) => f.id !== filter.id), filter])
  }

  const handleRemoveFilter = (filter: BookFilter) => {
    setFilters((filters) => [...filters.filter((f) => f.id !== filter.id)])
  }

  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBookFilters(filters)
    hideModal()
  }

  const handleClearFilters = () => {
    setFilters([])
  }

  return (
    <Form onSubmit={handleApplyFilters} className='filter-form'>
      <label>
        Add filter
        <div className='select-container'>
          <Select
            className='select-filter'
            options={fieldOptions}
            onChange={handleFilterFieldChange}
            value={value}
          />
          <button
            type='button'
            className='add-filter-btn'
            title='Add filter'
            onClick={handleAddFilter}
          >
            <AddFilterIcon size='100%' />
          </button>
        </div>
      </label>
      <label>
        Filters
        <div className='filters-container'>
          {filters.map((filter) => (
            <div key={filter.id} className='filter'>
              <label>{filter.Field}</label>
              <div className='filter-container'>
                <input
                  type='text'
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterValueChange(e, filter)
                  }
                  value={filter.Value}
                ></input>
                <button
                  type='button'
                  className='remove-filter-btn'
                  title='Remove filter'
                  onClick={() => handleRemoveFilter(filter)}
                >
                  <RemoveFilterIcon size='100%' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </label>
      <div className='filter-form-footer'>
        <button className='apply-filters-btn' title='Apply filters'>
          Apply
        </button>
        <button
          type='button'
          onClick={handleClearFilters}
          className='clear-filters-btn'
          title='Clear filters'
        >
          Clear
        </button>
      </div>
    </Form>
  )
}

export default FilterForm
