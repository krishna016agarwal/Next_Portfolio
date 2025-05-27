"use client";

import gsap from "gsap";
import style2 from "./css/loader.module.css";
import { useEffect } from "react";
import Footer from "./components/footer";
import Hero from "./components/hero";


export default function Home() {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(".loader h3", {
      x: -40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
    });
    tl.to(".loader h3", {
      opacity: 1,
      x: -10,

      stagger: 0.1,
      duration: 1,
    });
    tl.to(".loader h3", {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 1.5,
    });
    tl.to(".loader", {
      opacity: 0,
    });
    tl.to(".loader", {
      display: "none",
    });
  }, []);

  return (
    <>
      <div className={`${style2.loader} loader`}>
        <h3>Code </h3>
        <h3>Create </h3>
        <h3>Connect.</h3>
      </div>
      <main className="min-h-screen flex flex-col items-center text-white px-6 md:px-20 py-10">
        <Hero />
   
        <Footer />
      </main>
    </>
  );
}
