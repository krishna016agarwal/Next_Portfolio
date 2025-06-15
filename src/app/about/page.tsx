// src/app/about/page.tsx
"use client";
import Footer from "../components/footer"; // Assuming this is src/app/components/footer
import React, { useState, useEffect } from "react";
import style from "../css/about.module.css"; // Assuming this is src/app/css/about.module.css
import axios from "axios";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";


import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Helper function to get an error message string
function getClientErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return "An unexpected error occurred."; // Generic fallback
}


export default function Page() {
  // Your original state declarations
  const [skills, setskills] = useState([]);
  async function skillscalling() {
    // Not modifying this fetch logic, assuming it works for you
    // but a try/catch here would also benefit from typed errors
    try {
        const res = await axios.get("/api/skills");
        setskills(res.data.skills);
    } catch (error: unknown) { // Typed error
        console.error("Error fetching skills:", getClientErrorMessage(error));
        // Decide how to handle skills error, e.g., setskills([]) or show an error
    }
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
  const [isLoadingUrl, setIsLoadingUrl] = useState(true); 
  const [fetchError, setFetchError] = useState<string | null>(null); 
  const [experience, setexperience] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchUrl = async () => {
      setIsLoadingUrl(true);
      setFetchError(null);
      try {
        const res = await fetch("/api/resume/latest");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: `Failed to fetch resume URL. Status: ${res.status}` }));
          // Throw an error object for consistent handling in catch
          throw new Error(errorData.message || `Failed to fetch resume URL. Status: ${res.status}`);
        }
        const data = await res.json();
        if (data.fileUrl) {
          setFileUrl(data.fileUrl);
        } else {
          console.warn("Resume URL not found in API response:", data);
          setFetchError(data.message || "Resume URL not found.");
          setFileUrl(null); 
        }
      } catch (error: unknown) { // MODIFIED: error type to unknown
        // This is where the Line 41 error for this file would occur if it's this catch block
        const clientMessage = getClientErrorMessage(error);
        console.error("Network or other error fetching resume URL:", clientMessage, error); // Log original error too
        setFetchError(clientMessage); 
        setFileUrl(null); 
      } finally {
        setIsLoadingUrl(false);
      }
    };
    fetchUrl();
  }, []); 

  useEffect(() => {
    const fetchExperience = async () => {
      try { // Added try/catch for fetchExperience
        const res = await fetch("/api/experience");
         if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: `Failed to fetch experience. Status: ${res.status}` }));
          throw new Error(errorData.message || `Failed to fetch experience. Status: ${res.status}`);
        }
        const data = await res.json();
        setexperience(data.data);
      } catch (error: unknown) { // Typed error
        console.error("Error fetching experience:", getClientErrorMessage(error), error);
        // Decide how to handle experience error, e.g., setexperience([]) or show an error
      }
    };
    fetchExperience();
  }, []);

  // Your original useGSAP
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


  // Your original return JSX
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
                I&apos;m a passionate developer who loves turning ideas into
                interactive, user-friendly digital experiences using modern web
                technologies.
              </div>
              <Link className={`btn`} href="/contact">
                <button
                  className={`${style.btn}  bg-white! text-black! rounded-full! w-70!    text-[1.5rem]!  transition  font-bold! hover:bg-gray-300!  `}
                >
                  Let&apos;s Talk →
                </button>
              </Link>
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
                <span className={style.span}>B.tech (CSE)-8.92</span>
              </p>
              <p className={style.eduyear}>2028</p>
            </div>

            <div className={`${style.box1} box1  ${style.edu}`}>
              <p className={style.eduname}>
                <span className={style.name}>Lovely Public sr.sec school</span>
                <br></br>
                <span className={style.span}>12th PCM (94.6%)</span>
              </p>
              <p className={style.eduyear}>2024</p>
            </div>
            {/* <hr className={style.hr}></hr> */}
            <div className={`${style.box1} box1 ${style.edu}`}>
              <p className={style.eduname}>
                <span className={style.name}>St. John&apos;s sr.sec school</span>
                <br></br>
                <span className={style.span}>10th (93.6%)</span>
              </p>
              <p className={style.eduyear}>2022</p>
            </div>
          </div>
        </div>

        {experience.length !== 0 && ( // Maintained original condition
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
          {isLoadingUrl && <p className="text-white">Loading resume link...</p>}
          {!isLoadingUrl && fetchError && <p className="text-red-500">{fetchError}</p>} {/* Added fetchError display */}
          {!isLoadingUrl && !fetchError && fileUrl && (
            <button
              onClick={() => fileUrl && window.open(fileUrl, "_blank")}
              disabled={!fileUrl} 
              className={`rounded-full! transition px-[54px]! py-[24px]! font-bold! text-[1.3rem]! ${style.resumebutton} ${!fileUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Resume
            </button>
          )}
          {!isLoadingUrl && !fetchError && !fileUrl && (
             <p className="text-gray-400">No resume available at the moment.</p>
          )}
        </div>

          <Footer></Footer>
        </div>
      </div>
    </>
  );
}
