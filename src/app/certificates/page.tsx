"use client";
import React from "react";

import style2 from "../css/project.module.css";
import Certificate_card from "../components/certificate_card";
import Footer from "../components/footer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
export default function Page() {
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
      <div className="flex flex-col items-center ">
        <div className={style2.div}>
          <div className={`${style2.head} head text-3xl!`}>My Certificates</div>
          <div className={style2.section}>
            <p
              className={`${style2.sectionpart} sectionpart gap-0  text-white font-bold!  mt-2! lg:text-base/21 mr-10! bg-amber-300!.  `}
            >
              <span>M</span>
              <span>a</span>
              <span>r</span>
              <span>k</span>
              <span>i</span>
              <span>n</span>
              <span>g</span>
              <span> </span>
              <span>m</span>
              <span>i</span>
              <span>l</span>
              <span>e</span>
              <span>s</span>
              <span>t</span>
              <span>o</span>
              <span>n</span>
              <span>e</span>
              <span>s</span>
              <span> </span>
              <span>o</span>
              <span>f</span>
              <span> </span>
              <span>g</span>
              <span>r</span>
              <span>o</span>
              <span>w</span>
              <span>t</span>
              <span>h</span>
              <span> </span>
              <span className="text-gray-500 font-bold!">
              <span>a</span>
              <span>n</span>
              <span>d</span>
              <span> </span>
              <span>e</span>
              <span>x</span>
              <span>c</span>
              <span>e</span>
              <span>l</span>
              <span>l</span>
              <span>e</span>
              <span>n</span>
              <span>c</span>
              <span>e</span>
              </span>
            </p>
          </div>
        </div>

        <Certificate_card ></Certificate_card>

        <Footer></Footer>
      </div>
    </>
  );
}
