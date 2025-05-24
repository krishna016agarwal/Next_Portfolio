"use client";
import React from "react";
import Card from "../components/card";
import style from "../css/about.module.css";
import style2 from "../css/project.module.css";
import Footer from "../components/footer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
export default function page() {
  useGSAP(() => {
    gsap.from(".head", {
      opacity: 0,
      y: 100,
      duration: 1,
       delay: 0.5,
    });
    gsap.from(".sectionpart ", {
      y: 100,
      opacity: 0,
       duration: 1,
      delay: 0.7,
      
    });
  });
  return (
    <>
      <div className="flex flex-col  ">
        <div className={style2.div}>
          <div className={`${style2.head} head text-3xl!`}>My Works</div>
          <div className={style2.section}>
            <p
              className={`${style2.sectionpart} sectionpart  gap-0  text-white font-bold!  mt-2! lg:text-base/21 mr-10! bg-amber-300!.  `}
            >
              <span>C</span>
              <span>r</span>
              <span>e</span>
              <span>a</span>
              <span>t</span>
              <span>i</span>
              <span>n</span>
              <span>g</span>
              <span> </span>
              <span>u</span>
              <span>n</span>
              <span>f</span>
              <span>o</span>
              <span>r</span>
              <span>g</span>
              <span>e</span>
              <span>t</span>
              <span>t</span>
              <span>a</span>
              <span>b</span>
              <span>l</span>
              <span>e</span>
              <span> </span>
              <span className="text-gray-500 font-bold!">
                <span>d</span>
                <span>i</span>
                <span>g</span>
                <span>i</span>
                <span>t</span>
                <span>a</span>
                <span>l</span>
                <span> </span>
                <span>i</span>
                <span>m</span>
                <span>p</span>
                <span>r</span>
                <span>e</span>
                <span>s</span>
                <span>s</span>
                <span>i</span>
                <span>o</span>
                <span>n</span>
                <span>s</span>
              </span>
            </p>
          </div>
        </div>
        <div className="flex! flex-col! md:mt-20!  items-center! ">
          <Card></Card>

          <div className="mt-[70px]!">
            <Footer></Footer>
          </div>
        </div>
      </div>
    </>
  );
}
