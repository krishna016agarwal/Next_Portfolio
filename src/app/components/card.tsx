"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../css/card.module.css"; // Ensure this path is correct

interface Project {
  _id: string; // Essential for unique keys
  name: string;
  image: string;
  // createdAt: Date; // Not currently used in JSX
  github: string;
  projectLink: string;
  technologiesUsed: Array<string>;
}

export default function Card() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const submit = async () => {
    try {
      const response = await axios.get("/api/projects"); // Verify this API endpoint
      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        console.warn("Fetched data is not an array or response structure is unexpected:", response.data);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setData([]);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    submit();
  }, []);
  if (loading) {
    return (
      <div className="flex! justify-center! items-center! min-h-screen! text-2xl!  md:text-6xl!">
        Loading...
      </div>
    );
  }

  return (
    
    <div className={`w-full min-h-screen p-4 sm:p-6 ${style.div2}`}>
      {data.map((e) => (
        <div
          key={e._id}
          
          className={`relative aspect-[2/3] rounded-2xl overflow-hidden ${style.card}`}
          style={{ fontFamily: "Fjalla One", fontWeight: "normal" }}
        >
       
          <div className={`relative w-full! h-[80%]! mb-6!  flex items-center justify-center overflow-hidden rounded-lg ${style.img2}`}>
            <img
              src={e.image}
              alt={e.name}
              className="absolute inset-0 w-full h-full! object-cover"
              onError={(event) => {
                console.warn(`Error loading image for ${e.name}: ${event.currentTarget.src}`);
               
              }}
            />
          </div>

          <div className={style.details}>
            <p className="text-md uppercase text-2xl">{e.name}</p>
            <div className={`flex flex-wrap ${style.techbox}`}>
              {e.technologiesUsed.map((tech, index) => (
                <span key={index} className={style.tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className={style.detailshover}>
            <p className="text-md uppercase text-2xl">{e.name}</p>
            <div className={style.buttons}>
              <a href={e.github} target="_blank" rel="noopener noreferrer">
                <button className={`rounded-full ${style.button}`}>
                  Github
                </button>
              </a>
              <a href={e.projectLink} target="_blank" rel="noopener noreferrer">
                <button className={`rounded-full ${style.button}`}>
                  Website
                </button>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}