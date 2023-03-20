import { ChangeEvent, FC, useState } from 'react'
import { MdDeleteForever as RemoveFilterIcon } from 'react-icons/md'
import { SiAddthis as AddFilterIcon } from 'react-icons/si'
import Select from 'react-select'
import { MultiValue, SingleValue } from 'react-select/dist/declarations/src'
import { WhereBookQuery } from '../../services/BookService'
import './FilterForm.css'

interface FilterFormProps {
  bookFilters: BookFilter[]
  setBookFilters: React.Dispatch<React.SetStateAction<BookFilter[]>>
}

export interface BookFilter extends WhereBookQuery {
  id: string
}

interface FilterField {
  label: string
  value: string
}

const fieldOptions: MultiValue<FilterField> = [
  { label: 'Author First Name', value: 'Authors.Firstname' },
  { label: 'Author Last Name', value: 'Authors.Lastname' },
]

const FilterForm: FC<FilterFormProps> = ({ bookFilters, setBookFilters }) => {
  const [value, setValue] = useState<FilterField | null>(fieldOptions[0])

  const handleAddFilter = () => {
    if (!value) return
    const newFilter: BookFilter = {
      id: crypto.randomUUID(),
      Field: value.value,
      Value: '',
      Operation: 2,
    }
    setBookFilters((filters) => [...filters, newFilter])
  }

  const handleFilterFieldChange = (newValue: SingleValue<FilterField>) => {
    setValue(newValue)
  }

  const handleFilterValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filter: BookFilter,
  ) => {
    filter.Value = event.target.value
    setBookFilters((filters) => [...filters.filter((f) => f.id !== filter.id), filter])
  }

  const handleRemoveFilter = (filter: BookFilter) => {
    setBookFilters((filters) => [...filters.filter((f) => f.id !== filter.id)])
  }

  const handleClearFilters = () => {
    setBookFilters([])
  }

  return (
    <div className='filter-form'>
      <label>
        Add filter
        <div className='select-container'>
          <Select
            className='select-filter'
            options={fieldOptions}
            onChange={handleFilterFieldChange}
            value={value}
            placeholder='Select fields to filter by...'
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
          {bookFilters.map((filter) => (
            <div key={filter.id} className='filter'>
              <label>{fieldOptions.find((opt) => opt.value === filter.Field)?.label}</label>
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
        <button
          type='button'
          onClick={handleClearFilters}
          className='clear-filters-btn'
          title='Clear filters'
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default FilterForm
