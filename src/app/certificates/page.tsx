"use client"
import React from 'react'

import Certificate_card from '../components/certificate_card'
export default function page() {
  return (
      <>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap"
            rel="stylesheet"
          />
        </head>
        <div className='flex flex-col  '>
        <div className='mt-30! text-[11vw]! mx-auto!' style={{ fontFamily: 'Fjalla One', fontWeight: 'normal',color: '#d38f69' }}>
          CERTIFICATES
        </div>
        <div >
          <Certificate_card></Certificate_card>
        </div>
        </div>
      </>
    )
}
