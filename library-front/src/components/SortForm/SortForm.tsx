import React, { FC, useState } from 'react'
import './SortForm.css'
import Select, { MultiValue } from 'react-select'

interface SortFormProps {
  bookSort: (string | undefined)[] | undefined
  setBookSort: React.Dispatch<React.SetStateAction<(string | undefined)[] | undefined>>
  hideModal: () => void
}

interface SortOption {
  label: string
  value: string
}

const sortOptions: SortOption[] = [
  { label: 'Title Ascending', value: 'Title' },
  { label: 'Title Descending', value: 'Title DESC' },
  { label: 'Publish Date Ascending', value: 'PublishDate' },
  { label: 'Publish Date Descending', value: 'PublishDate DESC' },
  { label: 'ISBN Ascending', value: 'Isbn' },
  { label: 'ISBN Descending', value: 'Isbn DESC' },
]

const SortForm: FC<SortFormProps> = ({ bookSort, setBookSort, hideModal }) => {
  let selectedOptions = bookSort?.map((s) => {
    const option = sortOptions.find((o) => o.value === s)
    return option
  })

  const [value, setValue] = useState<(string | undefined)[] | undefined>()

  const handleApplySort = () => {
    setBookSort(value)
    hideModal()
  }

  const handleValueChange = (selectedOptions: MultiValue<SortOption | undefined>) => {
    const values = selectedOptions?.map((o) => o?.value)
    setValue(values)
  }

  return (
    <div className='sort-form'>
      <label>
        Select sort options
        <div className='select-container'>
          <Select
            className='select-sort'
            options={sortOptions}
            defaultValue={selectedOptions}
            onChange={handleValueChange}
            isSearchable={true}
            isMulti
            isClearable={true}
            placeholder='Select sort options...'
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
