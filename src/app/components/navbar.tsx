"use client"
import { MdOutlineMenu } from "react-icons/md";
import style from "../css/navbar.module.css";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head"; // Still useful for other meta tags
// Import the font function from next/font/google
import { Fjalla_One } from "next/font/google";
// Initialize the font
const fjallaOne = Fjalla_One({
weight: "400", // Fajalla One only has '400' weight
subsets: ["latin"], // Specify subsets you need
display: "swap", // Optional: font-display behavior
});
import { gsap } from "gsap/gsap-core";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
export default function Navbar() {
const tl = useRef();
const menuLinks = [
{ path: "/", label: "Home" },
{ path: "/about", label: "About" },
{ path: "/projects", label: "Works" },
{ path: "/certificates", label: "Certificates" },
{ path: "/contact", label: "Contact" },
];
const container=useRef();
const [isMenuOpen, setIsMenuOpen] = useState(false);
const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
useGSAP(()=>{

gsap.set(".menulinkitemholder",{y:75});
tl.current=gsap.timeline({paused:true}).to(".menuoverlay",{
duration:1.25,
clipPath:"polygon(0% 0%, 100% 0%,100% 100%,0% 100%)",
ease:"power4.inOut",
}).to(".menulinkitemholder",{
y:0,
duration:1,
stagger:0.1,
ease:"power4.inOut",
delay:-0.75
})
},[])
useEffect(()=>{
  if (isMenuOpen) {
    tl.current.play()
  } else {
    tl.current.reverse()
  }
},[isMenuOpen])
return (
  <>
    <div ref={container}>
      <div
        className={`h-20 flex justify-between bg-black items-center ml-10 fixed top-0 left-0 w-full shadow-md z-50 ${style.div}`}
      >
        <div className="text-white text-2xl font-extrabold">
          <a href="/">
            Port<span className="text-gray-400">folio.</span>
          </a>
        </div>
        <div
          onClick={toggleMenu}
          className=" cursor-pointer w-14 h-14 rounded-full border! border-white! bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black duration-100 ease-in"
        >
          <MdOutlineMenu className="text-[1.5rem]" />
        </div>
      </div>

      {isMenuOpen && (
        <div className={style.menuoverlay}>
          <div className={style.menucopy}>
            <div className={style.menulinks}></div>
            {menuLinks.map((link) => (
              <div
                className={style.menulinkitem}
                key={link.path}
              
              >
                <div
                  onClick={toggleMenu}
                  className={`${fjallaOne.className} ${style.menulinkitemholder}`}
                >
                  <a href={link.path} className={style.menulink}>
                    {link.label}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
)}