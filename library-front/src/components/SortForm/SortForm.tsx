import React, { FC, useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select'
import './SortForm.css'

interface SortFormProps {
  bookSort: string[]
  setBookSort: React.Dispatch<React.SetStateAction<string[]>>
  hideModal: () => void
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

const SortForm: FC<SortFormProps> = ({ bookSort, setBookSort, hideModal }) => {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<SortOption>>([])

  useEffect(() => {
    const options = bookSort.map((s) => sortOptions.find((o) => o.value === s))
    setSelectedOptions(options as MultiValue<SortOption>)
  }, [bookSort])

  const handleApplySort = () => {
    setBookSort(selectedOptions.map((o) => o.value))
    hideModal()
  }

  const handleValueChange = (selectedOptions: MultiValue<SortOption>) => {
    setSelectedOptions(selectedOptions)
  }

  return (
    <div className='sort-form'>
      <label>
        Select sort options
        <div className='select-container'>
          <Select
            className='select-sort'
            options={sortOptions}
            value={selectedOptions}
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
      </label>
      <div className='sort-form-footer'>
        <button
          type='button'
          className='apply-sort-btn'
          onClick={handleApplySort}
          title='Apply sort'
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default SortForm
