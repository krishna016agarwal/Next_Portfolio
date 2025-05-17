"use client";
import React, { useState, useEffect } from "react";
import style from "../css/about.module.css";
import axios from "axios";

export default function page() {
  const [skills, setskills] = useState([]);
  async function skillscalling() {
    const res = await axios.get("/api/skills");
    setskills(res.data.skills);
  }
  useEffect(() => {
    skillscalling();
  }, []);
  console.log(skills);






  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const res = await fetch('/api/resume/latest');
      const data = await res.json();
      setFileUrl(data.fileUrl);
    };
    fetchUrl();
  }, []);


  return (
    <>
      <div className={style.outer}>
        <div className={style.div}>
          <div className={style.head}>About Me</div>
          <div className={style.section}>
            <p
              className={`${style.sectionpart}  gap-0  text-white font-bold!  mt-2! lg:text-base/21 mr-10! bg-amber-300!.  `}
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
              <div className={style.abouttext}>
                I'm a passionate developer who loves turning ideas into
                interactive, user-friendly digital experiences using modern web
                technologies.
              </div>

              <button
                className={`${style.btn} bg-white! text-black! rounded-full! w-70!     transition  font-bold! hover:bg-gray-300!  `}
              >
                Let’s Talk →
              </button>
            </div>
          </div>
        </div>

        <div className={style.scroll}>
          <div className={style.scrollContent}>
            {[...skills, ...skills].map((e, index) => (
              <span key={index}>{e}</span>
            ))}
          </div>
        </div>
        <div className={style.edudiv}>
          <p
            className={`${style.education} ${style.edu} gap-0 mb-4! text-white font-bold!  mt-2! lg:text-base/21 .  `}
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
            <div className={`${style.box1} ${style.edu}`}>
              <p className={style.eduname}>
                <p className={style.name}>
                  Maharaja Agrasen Institute of Technology
                </p>
                <br></br>
                <span className={style.span}>B.tech (CSE)</span>
              </p>
              <p className={style.eduyear}>2024-2028</p>
            </div>

            <div className={`${style.box1} ${style.edu}`}>
              <p className={style.eduname}>
                Lovely Public sr.sec school
                <br></br>
                <span className={style.span}>12th PCM</span>
              </p>
              <p className={style.eduyear}>2024</p>
            </div>
            {/* <hr className={style.hr}></hr> */}
            <div className={`${style.box1} ${style.edu}`}>
              <p className={style.eduname}>
                St.John's s
                {`$r.sec school
 ${style.edu}`}{" "}
                <br></br>
                <span className={style.span}>10th</span>
              </p>
              <p className={style.eduyear}>2022</p>
            </div>
          </div>
        </div>
        <div className={style.cv}>
          <div className={style.resume}>
            <button
                onClick={() => fileUrl && window.open(fileUrl, '_blank')}
              className={`  rounded-full!    transition px-[54px]! py-[24px]! font-bold!  text-[1.3rem]! ${style.resumebutton}`}
            >
              Resume
            </button>
          </div>

          <div className={style.infoLinks}>
            <div>
              <span>SOCIALS</span>
              <div className={style.links}>
                <a href="https://www.linkedin.com/feed/" target="_blank">
                  LINKEDIN
                </a>
                <a
                  href="https://www.instagram.com/krishnaagarwal016/?next=%2F"
                  target="_blank"
                >
                  INSTAGRAM
                </a>
                <a href="https://github.com/krishna016agarwal" target="_blank">
                  GITHUB
                </a>
              </div>
            </div>
            <div>
              <span>WORK</span>
              <div className={style.links}>
                {" "}
                <a href="/projects">ALL PROJECTS</a>
              </div>
            </div>
            <div>
              <span>LET'S TALK</span>
              <div className={style.links}>
                <a href="krishna016agrawal@gmail.com">EMAIL</a>
                <a href="tel:+9897481144">PHONE</a>
              </div>
            </div>
            <div>
              <span>ABOUT</span>
              <div className={style.links}>
                <a href="/about">ABOUT US</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
