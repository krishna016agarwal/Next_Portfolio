import React from "react";
import Card from "../components/card";
import style from "../css/about.module.css";
import style2 from "../css/project.module.css";
import Footer from "../components/footer";
export default function page() {
  return (
    <>
     
      <div className="flex flex-col  ">
        {/* <div
          className="mt-30! text-[11vw]! mx-auto!"
          style={{
            fontFamily: "Fjalla One",
            fontWeight: "normal",
            color: "#b6dd9d",
          }}
        >
          PROJECTS
        </div> */}
        <div className={style2.div}>
          <div className={`${style2.head} text-3xl!`}>My Works</div>
          <div className={style2.section}>
            <p
              className={`${style2.sectionpart}  gap-0  text-white font-bold!  mt-2! lg:text-base/21 mr-10! bg-amber-300!.  `}
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
