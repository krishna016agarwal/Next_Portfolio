"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../css/certificate.module.css";

export default function Certificate_card() {
  const [data, setData] = useState([]);

  const submit = async () => {
    try {
      const response = await axios.get("/api/certificates");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    submit();
  }, []);

  interface Certificate {
    name: string;
    image: string;
    createdAt: string;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 p-8 min-h-screen sl:w-130">
      {data.map((e: Certificate, key) => (
        <div
          key={key}
          className={`relative w-150! h-[40vh]! sm:h-150! rounded-2xl overflow-hidden flex flex-col ${style.card}`}
          style={{ fontFamily: "Fjalla One", fontWeight: "normal" }}
        >
          {/* Image Section */}
          <div className="relative w-full! h-[25vh]! sm:h-[550px]! flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={e.image}
              alt={e.name}
              className="  w-full! object-contain!"
            />
          </div>

          {/* Text Sections */}
          <div className=" ">
            {/* Default Details */}
            <div className={style.details}>
              <p className="text-md uppercase text-xl">{e.name}</p>
            </div>

            {/* Hover Details */}
            <div className={style.detailshover}>
              <p className="text-md uppercase text-xl">{e.name}</p>
              <p>{new Date(e.createdAt).toLocaleDateString("en-US")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
