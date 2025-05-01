"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../css/card.module.css";

export default function Card() {
  const [data, setData] = useState([]);

  const submit = async () => {
    try {
      const response = await axios.get("/api/projects");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    submit();
  }, []);

  interface Project {
    name: string;
    image: string;
    createdAt: Date;
    github: string;
    projectLink: string;
    technologiesUsed: Array<string>;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 p-8 min-h-screen sl:w-130">
      {data.map((e: Project, key) => (
        <div
          key={key}
          className={`relative w-100 h-160 rounded-2xl overflow-hidden flex flex-col  ${style.card}`}
          style={{ fontFamily: "Fjalla One", fontWeight: "normal" }}
        >
          {/* Image Section */}
          <div className="relative w-full h-[500px]   flex items-center justify-center overflow-hidden rounded-lg">
  {/* Main Image */}
  <img
    src={e.image}
    alt={e.name}
    className="max-h-full h-full! w-full object-cover"
  />

 
</div>


          {/* Text Sections */}
          <div className=" ">
            {/* Default Details */}
            <div className={style.details}>
              <p className="text-md uppercase text-2xl">{e.name}</p>
              <div className={`flex flex-wrap ${style.techbox}`}>
                {e.technologiesUsed.map((i, index) => (
                  <span key={index} className={style.tech}>
                    {i}
                  </span>
                ))}
              </div>
            </div>

            {/* Hover Details */}
            <div className={style.detailshover}>
              <p className="text-md uppercase text-2xl">{e.name}</p>
              <div className={style.buttons}>
                <a href={e.github} target="_blank" rel="noopener noreferrer"  className="w-0">
                  <button className={`rounded-full ${style.button}`}>
                    Github
                  </button>
                </a>
                <a href={e.projectLink} target="_blank" rel="noopener noreferrer" className="w-0">
                  <button className={`rounded-full ${style.button}`}>
                    Website
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
