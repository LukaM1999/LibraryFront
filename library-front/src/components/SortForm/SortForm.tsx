import React, { FC } from 'react'
import Select, { MultiValue } from 'react-select'
import './SortForm.css'

interface SortFormProps {
  bookSort: string[]
  setBookSort: React.Dispatch<React.SetStateAction<string[]>>
}

interface SortOption {
  label: string
  value: string
}

const sortOptions: MultiValue<SortOption> = [
  { label: 'Title Ascending', value: 'Title' },
  { label: 'Title Descending', value: 'Title DESC' },
  { label: 'Publish Date Ascending', value: 'PublishDate' },
  { label: 'Publish Date Descending', value: 'PublishDate DESC' },
  { label: 'ISBN Ascending', value: 'Isbn' },
  { label: 'ISBN Descending', value: 'Isbn DESC' },
]

const SortForm: FC<SortFormProps> = ({ bookSort, setBookSort }) => {
  const handleValueChange = (selectedOptions: MultiValue<SortOption>) => {
    setBookSort(selectedOptions.map((o) => o.value))
  }

  return (
    <div className='sort-form'>
      <label>Select sort options</label>
      <div className='select-container'>
        <Select
          className='select-sort'
          options={sortOptions}
          value={
            bookSort.map((s) => sortOptions.find((o) => o.value === s)) as MultiValue<SortOption>
          }
          onChange={handleValueChange}
          isSearchable={true}
          isMulti
          isClearable={false}
          placeholder='Select sort options...'
          styles={{
            menu: (baseStyles) => ({
              ...baseStyles,
              position: 'sticky',
            }),
          }}
        />
      </div>
    </div>
  )
}

export default SortForm
