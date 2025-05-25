"use client";
import Footer from "../components/footer";
import React, { useState, useEffect } from "react";
import style from "../css/about.module.css";
import axios from "axios";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Head from "next/head"; // Still useful for other meta tags
// Import the font function from next/font/google
import { Fjalla_One } from "next/font/google";
import { useGSAP } from "@gsap/react";
// Initialize the font
const fjallaOne = Fjalla_One({
  weight: "400", // Fajalla One only has '400' weight
  subsets: ["latin"], // Specify subsets you need
  display: "swap", // Optional: font-display behavior
});
gsap.registerPlugin(ScrollTrigger);
export default function page() {
  const [skills, setskills] = useState([]);
  async function skillscalling() {
    const res = await axios.get("/api/skills");
    setskills(res.data.skills);
  }
  useEffect(() => {
    skillscalling();
  }, []);

  
  interface Experience {
    name: string;
    timeperiod: string;
    organisation: string;
  }
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [experience, setexperience] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchUrl = async () => {
      const res = await fetch("/api/resume/latest");
      const data = await res.json();
      setFileUrl(data.fileUrl);
    };
    fetchUrl();
  }, []);

  useEffect(() => {
    const fetchExperience = async () => {
      const res = await fetch("/api/experience");
      const data = await res.json();

      setexperience(data.data);
    };
    fetchExperience();
  }, []);
console.log(experience);
    useGSAP(() => {
    gsap.from(".head", {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.5,
    });
    gsap.from(".sectionpart", {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.7,
    });
    gsap.from(".abouttext", {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 0.9,
    });
    gsap.from(".btn", {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 1.2,
    });
    gsap.from(".education", {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      scrollTrigger: {
        trigger: ".edudiv",
        scroller: "body",
      },
    });
    gsap.from(".box1", {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 1,
      stagger: 0.5,
      scrollTrigger: {
        trigger: ".edudiv",
        scroller: "body",
      },
    });
    
 

  });



  return (
    <>
      <div className={`${style.outer} outer`}>
        <div className={style.div}>
          <div className={`${style.head} head`}>About Me</div>

          <div className={style.section}>
            <p
              className={`${style.sectionpart} sectionpart gap-0  text-white font-bold!  mt-2! lg:text-base/21 mr-10! bg-amber-300!.  `}
            >
              <span>I</span>
              <span>n</span>
              <span>n</span>
              <span>o</span>
              <span>v</span>
              <span>a</span>
              <span>t</span>
              <span>i</span>
              <span>v</span>
              <span className="mr-3!">e</span>
              <span> </span>
              <span>D</span>
              <span>e</span>
              <span>v</span>
              <span>e</span>
              <span>l</span>
              <span>o</span>
              <span>p</span>
              <span>e</span>
              <span className="mr-3!">r</span>
              <span> </span>
              <span>f</span>
              <span>o</span>
              <span className="mr-3!">r</span>
              <span> </span>
              <span className="mr-3!">a</span>
              <span> </span>
              <span>D</span>
              <span>i</span>
              <span>g</span>
              <span>i</span>
              <span>t</span>
              <span>a</span>
              <span className="mr-3!">l</span>
              <span> </span>
              <span className="text-gray-500 font-bold!">
                <span>F</span>
                <span>i</span>
                <span>r</span>
                <span>s</span>
                <span className="mr-3!">t</span>
                <span> </span>
                <span>W</span>
                <span>o</span>
                <span>r</span>
                <span>l</span>
                <span>d</span>
              </span>
            </p>

            <div className={style.mainsub}>
              <div className={`${style.abouttext} abouttext`}>
                I'm a passionate developer who loves turning ideas into
                interactive, user-friendly digital experiences using modern web
                technologies.
              </div>
              <a className={`btn`} href="/contact">
                <button
                  className={`${style.btn}  bg-white! text-black! rounded-full! w-70!    text-[1.5rem]!  transition  font-bold! hover:bg-gray-300!  `}
                >
                  Let’s Talk →
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className={` lg:mt-20! ${style.scroll}`}>
          <div className={style.scrollContent}>
            {[...skills, ...skills].map((e, index) => (
              <span key={index}>{e}</span>
            ))}
          </div>
        </div>

        <div className={`${style.edudiv} edudiv`}>
          <p
            className={`${style.education} ${style.edu} education gap-0 mb-4! text-white font-bold!  mt-2! lg:text-base/21 .  `}
          >
            <span>E</span>
            <span>d</span>
            <span>u</span>
            <span>c</span>
            <span>t</span>
            <span>i</span>
            <span>o</span>
            <span>n</span>
          </p>

          <div className={style.box}>
            <div className={`${style.box1} box1 ${style.edu}`}>
              <p className={style.eduname}>
                <span className={style.name}>
                  Maharaja Agrasen Institute of Technology
                </span>
                <br></br>
                <span className={style.span}>B.tech (CSE)</span>
              </p>
              <p className={style.eduyear}>2024-2028</p>
            </div>

            <div className={`${style.box1} box1  ${style.edu}`}>
              <p className={style.eduname}>
                <span className={style.name}>Lovely Public sr.sec school</span>
                <br></br>
                <span className={style.span}>12th PCM</span>
              </p>
              <p className={style.eduyear}>2024</p>
            </div>
            {/* <hr className={style.hr}></hr> */}
            <div className={`${style.box1} box1 ${style.edu}`}>
              <p className={style.eduname}>
                <span className={style.name}>St. John's sr.sec school</span>
                <br></br>
                <span className={style.span}>10th</span>
              </p>
              <p className={style.eduyear}>2022</p>
            </div>
          </div>
        </div>

        {experience.length != 0 && (
          <div className={`${style.edudiv} exper`}>
            <p
              className={`${style.education} experience ${style.edu} gap-0 mb-4! text-white font-bold!  mt-2! lg:text-base/21 .  `}
            >
              <span>E</span>
              <span>x</span>
              <span>p</span>
              <span>e</span>
              <span>r</span>
              <span>i</span>
              <span>e</span>
              <span>n</span>
              <span>c</span>
              <span>e</span>
            </p>

            {experience.map((e, key) => (
              <div className={style.box} key={key}>
                <div className={`${style.box1} box2 ${style.edu}`}>
                  <p className={style.eduname}>
                    <span className={style.name}>{e.name}</span>
                    <br></br>
                    <span className={style.span}>{e.organisation}</span>
                  </p>
                  <p className={style.eduyear}>{e.timeperiod}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`${style.cv} cv`}>
          <div className={`${style.resume} resume`}>
            <button
              onClick={() => fileUrl && window.open(fileUrl, "_blank")}
              className={`  rounded-full!    transition px-[54px]! py-[24px]! font-bold!  text-[1.3rem]! ${style.resumebutton}`}
            >
              Resume
            </button>
          </div>

          <Footer></Footer>
        </div>
      </div>
    </>
  );
}
