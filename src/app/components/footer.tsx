"use client"
import React from 'react'
import style from "../css/about.module.css";
import Head from "next/head"; // Still useful for other meta tags
// Import the font function from next/font/google
import { Fjalla_One } from "next/font/google";
// Initialize the font
const fjallaOne = Fjalla_One({
  weight: "400", // Fajalla One only has '400' weight
  subsets: ["latin"], // Specify subsets you need
  display: "swap", // Optional: font-display behavior
});

export default function Footer() {
  return (
    
              <div className={`${style.infoLinks} `}>
                <div>
                  <span className={fjallaOne.className}>SOCIALS</span>
                  <div className={`${style.links} ${fjallaOne.className}`}>
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
                {/* ... other sections, apply fjallaOne.className where needed ... */}
                <div>
                  <span className={fjallaOne.className}>WORK</span>
                  <div className={`${style.links} ${fjallaOne.className}`}>
                    <a href="/projects">ALL PROJECTS</a>
                  </div>
                </div>
                <div>
                  <span className={fjallaOne.className}>LET'S TALK</span>
                  <div className={`${style.links} ${fjallaOne.className}`}>
                    <a href="mailto:krishna016agrawal@gmail.com">EMAIL</a>
                    <a href="tel:+919897481144">PHONE</a>
                  </div>
                </div>
                <div>
                  <span className={fjallaOne.className}>ABOUT</span>
                  <div className={`${style.links} ${fjallaOne.className}`}>
                    <a href="/about">ABOUT US</a>
                  </div>
                </div>
              </div>
  )
}
