import React from 'react'
import Card from '../components/card'
import style from "../css/about.module.css"
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
      <div className='mt-30! text-[11vw]! mx-auto!' style={{ fontFamily: 'Fjalla One', fontWeight: 'normal',color: '#b6dd9d' }}>
        PROJECTS
      </div>
      <div >
        <Card></Card>
      </div>
                <div className={`${style.infoLinks} mt-40! mb-2! `}>
            <div>
              <span>SOCIALS</span>
              <div className={style.links}>
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
            </div>
            <div>
              <span>WORK</span>
              <div className={style.links}>
                {" "}
                <a href="/projects">ALL PROJECTS</a>
              </div>
            </div>
            <div>
              <span>LET'S TALK</span>
              <div className={style.links}>
                <a href="krishna016agrawal@gmail.com">EMAIL</a>
                <a href="tel:+9897481144">PHONE</a>
              </div>
            </div>
            <div>
              <span>ABOUT</span>
              <div className={style.links}>
                <a href="/about">ABOUT US</a>
              </div>
            </div>
          </div>
      </div>
    </>
  )
}
