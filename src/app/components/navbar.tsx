"use client";
import { MdOutlineMenu } from "react-icons/md";
import style from "../css/navbar.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Fjalla_One } from "next/font/google";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // Import useSearchParams and usePathname

const fjallaOne = Fjalla_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Navbar() {
  const container = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // To read query parameters
  const pathname = usePathname(); // To get current path for router.replace

  const openCloseMenuTl = useRef<gsap.core.Timeline | null>(null);
  // New timeline for "screen go down" animation after navigation
  const postNavExitTl = useRef<gsap.core.Timeline | null>(null);


  const menuLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];

  useGSAP(() => {
    // --- Setup for standard menu open/close ---
    gsap.set(menuOverlayRef.current, {
      y: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(`.${style.menulinkitemholder}`, { y: 75, opacity: 0 });

    openCloseMenuTl.current = gsap.timeline({
      paused: true,
      onReverseComplete: () => { // When closed via hamburger
        gsap.set(menuOverlayRef.current, {
          y: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        });
        gsap.set(`.${style.menulinkitemholder}`, { y: 75, opacity: 0 });
      }
    })
      .to(menuOverlayRef.current, {
        duration: 0.8,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power3.inOut",
      })
      .to(`.${style.menulinkitemholder}`, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      }, "-=0.5");

    // --- Setup for "screen go down" animation after navigation ---
    // This animation assumes the menu items are already invisible or irrelevant,
    // and the overlay is fully covering the screen (from a previous open state).
    postNavExitTl.current = gsap.timeline({
        paused: true,
        onComplete: () => {
            // After this animation, ensure overlay is fully reset for next open
            gsap.set(menuOverlayRef.current, {
                y: 0,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
            });
            // Also reset menu items if they were part of this, though typically not
            gsap.set(`.${style.menulinkitemholder}`, { y: 75, opacity: 0 });
        }
    })
    .to(menuOverlayRef.current, { // Target the overlay directly
        y: "100vh", // "whole screen again go down"
        duration: 0.8,
        ease: "power3.in",
    });


  }, { scope: container });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Effect for standard menu open/close via hamburger
  useEffect(() => {
    if (!openCloseMenuTl.current) return;
    if (isMenuOpen) {
      // Reset for opening, in case a postNavExit animation just finished
      gsap.set(menuOverlayRef.current, {
        y: 0,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      });
      gsap.set(`.${style.menulinkitemholder}`, { y: 75, opacity: 0 });
      openCloseMenuTl.current.play();
    } else {
      // Only reverse if it was actually played (not closed by link click logic)
      if (openCloseMenuTl.current.progress() > 0 || openCloseMenuTl.current.isActive()) {
          openCloseMenuTl.current.reverse();
      }
    }
  }, [isMenuOpen]);


  // Effect to handle query parameters for post-navigation animation
  useEffect(() => {
    const menuAction = searchParams.get('menuAction');

    if (menuAction === 'closeAfterNav' && menuOverlayRef.current && postNavExitTl.current) {
      // Menu should appear as if it was open (full clipPath, y:0)
      // This state should ideally be set by the previous page's open state before navigation
      // or we ensure it here before playing the exit.
      gsap.set(menuOverlayRef.current, {
          y: 0, // Start from top
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" // Fully visible
      });
      // Hide menu items immediately as they are not part of this specific exit animation
      gsap.set(`.${style.menulinkitemholder}`, { opacity: 0, y: 75 });


      postNavExitTl.current.play().then(() => {
        // Animation complete, clean up URL
        const newPath = pathname; // Get current path without query params
        router.replace(newPath, { scroll: false }); // Replace URL, don't scroll
      });
    }
  }, [searchParams, router, pathname]); // Rerun when searchParams change


  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault(); // Prevent default link behavior

    // 1. Navigate to the new page with a query parameter
    router.push(`${path}?menuAction=closeAfterNav`);

    // 2. Immediately set menu to closed on the *current* page.
    // This will trigger the standard openCloseMenuTl.reverse() via useEffect.
    // The visual effect is the menu closing as the page starts to change.
    setIsMenuOpen(false);

    // The "screen go down" animation will be handled by the new page's useEffect
    // based on the 'menuAction=closeAfterNav' query parameter.
  };

  return (
    <>
      <div ref={container}>
        <div
          className={`h-20 flex justify-between bg-black items-center fixed top-0 left-0 w-full shadow-md z-50 ${style.div}`}
        >
          <div className="text-white text-2xl font-extrabold ml-4 md:ml-10">
            <a href="/">
              Port<span className="text-gray-400">folio.</span>
            </a>
          </div>
          <div
            onClick={toggleMenu}
            className="mr-4 md:mr-10 cursor-pointer w-14 h-14 rounded-full border border-white bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black duration-100 ease-in"
          >
            <MdOutlineMenu className="text-[1.5rem]" />
          </div>
        </div>

        <div
          ref={menuOverlayRef}
          className={style.menuoverlay}
        >
          <div className={style.menucopy}>
            {menuLinks.map((link) => (
              <div
                className={style.menulinkitem}
                key={link.path}
              >
                <div
                  className={`${fjallaOne.className} ${style.menulinkitemholder}`}
                  // No onClick on itemholder itself for this logic
                >
                  <Link
                    href={link.path} // href is still important for SEO and right-click
                    className={style.menulink}
                    onClick={(e) => handleLinkClick(e, link.path)}
                  >
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}