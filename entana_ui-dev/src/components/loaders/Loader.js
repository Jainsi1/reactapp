import React from 'react'
import Spinner from './Spinner'

import './loader.css'

export default function Loader() {
  return <div className='loader-wrapper'>
    <Spinner />
  </div>
}
