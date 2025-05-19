"use client";
import { MdOutlineMenu } from "react-icons/md";
import style from "../css/navbar.module.css";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
export default function Navbar() {
  const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];
  const container = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    // <div
    //   className={`h-20 flex justify-between bg-black items-center ml-10 fixed top-0 left-0 w-full  shadow-md z-50!    ${style.div}`}
    // >
    //   <div className="text-white text-2xl  font-extrabold ">
    //     <a href="/">
    //       Port<span className="text-gray-400">folio.</span>
    //     </a>
    //   </div>
    //   <div className=" w-14 h-14 rounded-full border-1! border-white bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black duration-100 ease-in">
    //     <MdOutlineMenu className="text-[1.5rem]!" />
    //   </div>
    // </div>
    <div className={style.menucontainer} ref={container}>
      <div className={style.menubar}>
        <div className={style.menulogo}>
          <Link href="/">Codegrid</Link>
        </div>
        <div className={style.menuopen} onClick={toggleMenu}>
          <p>Menu</p>
        </div>
      </div>
      <div className={style.overlay}>
        <div className={style.menuoverlay}>
          <div className={style.menulogo}>
            <Link href="/">Codegrid</Link>
          </div>
          <div className={style.menuclose} onClick={toggleMenu}>
            <p>Close</p>
          </div>
        </div>

        <div className={style.menucloseicon}>
          <p>&#x2715;</p>
        </div>
        <div className={style.menucopy}>
          <div className={style.menulinks}>
            {menuLinks.map((link, index) => (
              <div className={style.menulinkitem} key={index}>
                <div className={style.menulinkitemholder} onClick={toggleMenu}>
                  <Link href={link.path} className={style.menulink}>
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className={style.menuinfo}>
            <div className={style.menuinfocol}>
              <a>X</a>
              <a>X</a>
              <a>X</a>
              <a>X</a>
              <a>X</a>
            </div>
            <div className={style.menuinfocol}>
              <p>456456</p>
              <p>456456</p>
            </div>
          </div>
        </div>
        <div className={style.menupreview}>
          <p>View Showreel</p>
        </div>
      </div>
    </div>
  );
}
