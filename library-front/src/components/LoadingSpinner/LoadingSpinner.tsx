import { FC } from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {}

const LoadingSpinner: FC<LoadingSpinnerProps> = () => (
  <div className='spinner-container'>
    <div className='loading-spinner'></div>
  </div>
)

export default LoadingSpinner
