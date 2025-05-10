"use client"
import React from 'react'
import style from "../css/about.module.css"
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
                    <div className={style.infoLinks}>
              <div>
                <span>SOCIALS</span>
                <a href="https://www.linkedin.com/feed/" target="_blank">
                  LINKEDIN
                </a>
                <a
                  href="https://www.instagram.com/krishnaagarwal016/?next=%2F"
                  target="_blank"
                >
                  INSTAGRAM
                </a>
                <a href="https://github.com/krishna016agarwal" target="_blank">
                  GITHUB
                </a>
              </div>
              <div>
                <span>WORK</span>
                <a href="/projects">ALL PROJECTS</a>
              </div>
              <div>
                <span>LET'S TALK</span>
                <a href="krishna016agrawal@gmail.com">EMAIL</a>
                <a href="tel:+9897481144">PHONE</a>
              </div>
              <div>
                <span>ABOUT</span>
                <a href="/about">ABOUT US</a>
              </div>
            </div>
        </div>
      </>
    )
}
