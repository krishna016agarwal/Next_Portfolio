"use client";
import { MdOutlineMenu } from "react-icons/md";
import style from "../css/navbar.module.css";
import React, { useState } from "react";
import Head from "next/head"; // Still useful for other meta tags
// Import the font function from next/font/google
import { Fjalla_One } from "next/font/google";
// Initialize the font
const fjallaOne = Fjalla_One({
  weight: "400", // Fajalla One only has '400' weight
  subsets: ["latin"], // Specify subsets you need
  display: "swap", // Optional: font-display behavior
});

import Link from "next/link";

export default function Navbar() {
  const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div className={`h-20 flex justify-between bg-black items-center ml-10 fixed top-0 left-0 w-full shadow-md z-50 ${style.div}`}>
        <div className="text-white text-2xl font-extrabold">
          <a href="/">
            Port<span className="text-gray-400">folio.</span>
          </a>
        </div>
        <div  onClick={toggleMenu} className=" cursor-pointer w-14 h-14 rounded-full border! border-white! bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black duration-100 ease-in">
          <MdOutlineMenu className="text-[1.5rem]" />
        </div>
      </div>

      {isMenuOpen && (
        <div className={style.overlay}>
          <div className={style.overlaymenu}>
            {menuLinks.map((link) => (
              <div className={style.menuitem} key={link.path} onClick={toggleMenu}>
                <p className={fjallaOne.className}>
                  <Link href={link.path}>{link.label}</Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
