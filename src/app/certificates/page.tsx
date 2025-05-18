"use client"
import React from 'react'
import style from "../css/about.module.css"
import Certificate_card from '../components/certificate_card'
import Footer from '../components/footer'
export default function page() {
  return (
      <>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap"
            rel="stylesheet"
          />
        </head>
        <div className='flex flex-col items-center '>
        <div className='mt-30! text-[11vw]! mx-auto! mb-10!' style={{ fontFamily: 'Fjalla One', fontWeight: 'normal',color: '#d38f69' }}>
          CERTIFICATES
        </div>
        
          <Certificate_card></Certificate_card>
       
                 <Footer></Footer>
        </div>
      </>
    )
}
