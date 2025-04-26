import React from 'react'
import Card from '../components/card'

export default function page() {
  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <div className='flex flex-col'>
      <div className='mt-30! text-[11vw]! mx-auto! ' style={{ fontFamily: 'Fjalla One', fontWeight: 'normal',color: '#b6dd9d' }}>
        PROJECTS
      </div>
      <div className=''>
        <Card></Card>
      </div>
      </div>
    </>
  )
}
