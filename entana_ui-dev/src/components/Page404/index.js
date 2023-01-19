import React from 'react'
import './page404.css'

export default function Page404({ error = {}, isShow = true }) {

  if (isShow) {
    return (
      <div className='wrapper-404'>
        <div className='title-404'>404</div>
        <div className='subtitle-404'>PAGE NOT FOUND</div>
        <div className='description-404'>
          The page you are looking for was moved, removed, renamed or might never existed.
        </div>
        <div className='description-404'>
          {JSON.stringify(error)}
        </div>
      </div>
    )
  }

  return (
    <div className='wrapper-404'>
      <div className='description-404'>
        {JSON.stringify(error)}
      </div>
    </div>
  )
}
