import style from "../css/hero.module.css"; // This path seems correct based on your structure
import { Fjalla_One } from "next/font/google";
import gsap from "gsap";

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
const fjallaOne = Fjalla_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface LinePart {
  type: 'text' | 'video' | 'gif';
  content: string;
}

interface HeroLineData {
  id: number;
  parts: LinePart[];
}

const heroLinesData: HeroLineData[] = [
  { id: 1, parts: [{ type: 'text', content: 'I build ideas with' }] },
  {
    id: 2,
    parts: [
      { type: 'text', content: 'MERN' },
      // CORRECTED PATH: Assumes you renamed the video and moved it
      { type: 'video', content: '/videos/male-web-developer-animation.mp4' },
      { type: 'text', content: 'solve challenges' },
    ],
  },
  { id: 3, parts: [{ type: 'text', content: ' with DSA in Java' }] },
  { id: 4, parts: [{ type: 'text', content: 'code that speaks' }] },
  {
    id: 5,
    parts: [
      { type: 'text', content: 'solutions' },
      // CORRECTED PATH: Assumes you moved and potentially renamed the GIF
      { type: 'gif', content: '/gifs/6_Amanda_Di_Genova.gif' },
      { type: 'text', content: 'that endure.' },
    ],
  },
];

export default function Hero() {

  useGSAP(()=>{
    gsap.from(".head span span",{
       y:100,
      opacity:0,
      stagger:0.5,
      duration:3,
      delay:0.5
    })
  })
  return (
    <section className={` ${style.section}  flex justify-items-start flex-col lg:py-[72px]! lg:px-[80px]!  relative   `}>
      <h2 className="text-white text-xl mb-6 text-[1.8rem]! font-bold!">
        Hello! I’m Krishna.
      </h2>

      <p className={`${style.head} md:text-[6.8em]! text-[4.8em]! gap-0  text-white font-bold!  mt-2! text-base/21  `}>
        <span>
          <span>W</span>
          <span>e</span>
          <span>b</span>
        </span>
        <span> </span>
        <span>
          {" "}
          <span>d</span>
          <span>e</span>
          <span>v</span>
          <span>e</span>
          <span>l</span>
          <span>o</span>
          <span>p</span>
          <span>e</span>
          <span>r</span>
        </span>
        <span> </span>
        <span>
          {" "}
          <span>p</span>
          <span>a</span>
          <span>s</span>
          <span>s</span>
          <span>i</span>
          <span>o</span>
          <span>n</span>
          <span>a</span>
          <span>t</span>
          <span>e</span>
        </span>
        <span> </span>
        <span>
          {" "}
          <span>a</span>
          <span>b</span>
          <span>o</span>
          <span>u</span>
          <span>t</span>
        </span>
        <span> </span>
        <span>
          {" "}
          <span>D</span>
          <span>S</span>
          <span>A</span>
        </span>
        <span> </span>
        <span className="text-gray-500 font-bold!">
          <span>
            {" "}
            <span>a</span>
            <span>n</span>
            <span>d</span>
          </span>
          <span> </span>
          <span>
            {" "}
            <span>v</span>
            <span>i</span>
            <span>s</span>
            <span>u</span>
            <span>a</span>
            <span>l</span>
          </span>
          <span> </span>
          <span>
            {" "}
            <span>d</span>
            <span>e</span>
            <span>s</span>
            <span>i</span>
            <span>g</span>
            <span>n</span>
          </span>
        </span>
      </p>

      <div className={`${style.box}  flex justify-between `}>
        <a href="/contact" className={` ${style.linkbutton}`}>
          <button className={` ${style.a} bg-white! text-black! rounded-full! transition px-[54px]! py-[24px]! font-bold! hover:bg-gray-300! text-[1.5rem]!`}>
            Let’s Talk →
          </button>
        </a>
        <p className={`  ${style.text} text-gray-300 mt-10 xl:max-w-xl leading-relaxed `}>
          A tech enthusiast transforming ideas into intuitive, functional web
          applications.
        </p>
      </div>

      <section className={style.heroTextSection}>
        {heroLinesData.map((line) => (
          <div key={line.id} className={`${style.heroLine} ${fjallaOne.className}`}>
            {line.parts.map((part, partIndex) => {
              if (part.type === 'text') {
                return <span key={partIndex}>{part.content}</span>;
              } else if (part.type === 'video') {
                return (
                  <video
                    key={partIndex}
                    src={part.content} // This will now be '/videos/your-video.mp4'
                    className={style.inlineMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden="true"
                  />
                );
              } else if (part.type === 'gif') {
                return (
                  <img
                    key={partIndex}
                    src={part.content} // This will now be '/gifs/your-gif.gif'
                    alt=""
                    className={style.inlineMedia}
                    aria-hidden="true"
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
      </section>

    </section>
  );
}