"use client";
import React from "react";
import style from "../css/about.module.css";

// Import the font function from next/font/google
import { Fjalla_One } from "next/font/google";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
// Initialize the font
const fjallaOne = Fjalla_One({
  weight: "400", // Fajalla One only has '400' weight
  subsets: ["latin"], // Specify subsets you need
  display: "swap", // Optional: font-display behavior
});

export default function Footer() {
  useGSAP(() => {
    
    gsap.from(".div",{
      y:50,
      opacity:0,
      duration:1,
      delay:1.8
    })
  });
  return (
    <div className={`${style.infoLinks} div`}>
      <div >
        <span className={`${fjallaOne.className} name2 inline-block`}>SOCIALS</span>
        <div className={`${style.links} ${fjallaOne.className}`}>
          <a
            className={`value2`}
            href="https://www.linkedin.com/feed/"
            target="_blank"
          >
            LINKEDIN
          </a>
          <a
            className={`value2`}
            href="https://www.instagram.com/krishnaagarwal016/?next=%2F"
            target="_blank"
          >
            INSTAGRAM
          </a>
          <a
            className={`value2`}
            href="https://github.com/krishna016agarwal"
            target="_blank"
          >
            GITHUB
          </a>
        </div>
      </div>
      {/* ... other sections, apply fjallaOne.className where needed ... */}
      <div>
        <span className={`${fjallaOne.className} name2 inline-block`}>WORK</span>
        <div className={`${style.links} ${fjallaOne.className}`}>
          <Link className={`value2`} href="/projects">
            ALL PROJECTS
          </Link>
        </div>
      </div>
      <div>
        <span className={`${fjallaOne.className} name2 inline-block`}>LET&apos;S TALK</span>
        <div className={`${style.links} ${fjallaOne.className}`}>
          <a className={`value2`} href="mailto:krishna016agrawal@gmail.com">
            EMAIL
          </a>
          <a className={`value2`} href="tel:+919897481144">
            PHONE
          </a>
        </div>
      </div>
      <div>
        <span className={`${fjallaOne.className} name2 inline-block`}>ABOUT</span>
        <div className={`${style.links} ${fjallaOne.className}`}>
          <Link className={`value2`} href="/about">
            ABOUT US
          </Link>
        </div>
      </div>
    </div>
  );
}
