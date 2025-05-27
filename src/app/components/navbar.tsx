"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Fjalla_One } from "next/font/google";
import style from "../css/navbar.module.css";

const fjallaOne = Fjalla_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type MenuLink = {
  path: string;
  label: string;
};

// Option 1: Change JSX.Element to React.ReactNode (Recommended Workaround)
export default function Navbar(): React.ReactNode {
// Alternative Option 2: (if defining as a const)
// const Navbar: React.FC = () => {
// Alternative Option 3: (Least recommended)
// export default function Navbar(): any {
// Alternative Option 4: (Let TypeScript infer)
// export default function Navbar() {

  const menuLinks: MenuLink[] = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Works" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  // YOUR ORIGINAL GSAP LOGIC:
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .from(".menuoverlay", { // Reverted to your .from
          y: "-100%",
          duration: 0.8,
          ease: "power2.inOut",
        })
        .from(
          ".menulink",
          {
            y: 50,
            opacity: 0,
            duration: 0.3,
            ease: "power1.out",
            stagger: 0.07,
          },
          "-=0.3"
        );
    },
    { scope: container }
  );

  useEffect(() => {
    if (tl.current) {
      if (isMenuOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (): void => {
    // Your original logic for handleLinkClick
    // if (isMenuOpen) { // This check is good to prevent unnecessary reverse
       setIsMenuOpen(false);
    // }
  };

  return (
    <div ref={container}>
      <div
        className={`h-20 flex justify-between bg-black items-center ml-10 fixed top-0 left-0 w-full shadow-md z-50 ${style.div || ''}`} // Added fallback for style.div
      >
        <div className="text-white text-2xl font-extrabold">
          <Link href="/">
            Port<span className="text-gray-400">folio.</span>
          </Link>
        </div>
        <div
          onClick={toggleMenu}
          className="cursor-pointer w-14 h-14 rounded-full border! border-white! bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black duration-100 ease-in mr-5"
        >
          <MdOutlineMenu className="text-[1.5rem]" />
        </div>
      </div>

      <div
        className={`${style.menuoverlay || ''} menuoverlay ${ // Added fallback for style.menuoverlay
          isMenuOpen ? (style.menuVisible || '') : (style.menuHidden || '') // Added fallbacks
        }`}
      >
        <div className={style.menucopy || ''}> {/* Added fallback */}
          <div className={style.menulinks || ''}></div> {/* Added fallback */}
          {menuLinks.map((link) => (
            <div className={style.menulinkitem || ''} key={link.path}> {/* Added fallback */}
              <div
                className={`${fjallaOne.className} ${style.menulinkitemholder || ''} menulinkitemholder`} 
              >
                <Link
                  href={link.path}
                  className={`${style.menulink || ''} menulink`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
