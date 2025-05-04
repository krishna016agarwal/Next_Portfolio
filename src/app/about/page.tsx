"use client"
import React,{useState,useEffect} from 'react'
import style from "../css/about.module.css"
import axios from 'axios'
import styled,{keyframes,css} from 'styled-components'
export default function page() {
  const [skills,setskills]=useState([])
  async function skillscalling(){
    const res=await axios.get("/api/skills");
    setskills(res.data.skills)


  }
useEffect(()=>{
  skillscalling()
},[])
console.log(skills);
  return (
      <>
      <div className={style.outer}>
       <div className={style.div}>
        <div className={style.head}>About Me</div>
        <div className={style.section}>
        <p className={`${style.sectionpart} text-[6vw]! gap-0  text-white font-bold!  mt-2! lg:text-base/21 .  `}>
        <span>I</span><span>n</span><span>n</span><span>o</span><span>v</span><span>a</span><span>t</span><span>i</span><span>v</span><span>e</span> <br></br>
<span>D</span><span>e</span><span>v</span><span>e</span><span>l</span><span>o</span><span>p</span><span>e</span><span>r</span> 
<span>f</span><span>o</span><span>r</span> 
<span>a</span> 
<span>D</span><span>i</span><span>g</span><span>i</span><span>t</span><span>a</span><span>l</span><span> </span>


        <span className="text-gray-500 font-bold!">
        <span>F</span><span>i</span><span>r</span><span>s</span><span>t</span> 
        <span>W</span><span>o</span><span>r</span><span>l</span><span>d</span>
        </span>
        
      </p>
            
           
           
            <div className={style.mainsub}>
                <div className={style.abouttext}>
                I'm a passionate developer who loves turning ideas into interactive, user-friendly digital experiences using modern web technologies.
                </div>
                <div className={style.contact}>
                <button className="bg-white! text-black! rounded-full! font-semibold   hover:bg-gray-200 transition px-[54px]! py-[24px]! font-bold! hover:bg-gray-300! text-[1.3vw]!">
          Let’s Talk →
        </button>
                </div>
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

       </div>
      </>
    )
}

