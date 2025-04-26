"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

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

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 p-8 min-h-screen bg-black">
      {data.map((e, key) => (
        <div
          key={key}
          className="w-64 h-96 bg-[#9c8dbc] rounded-2xl overflow-hidden shadow-lg transform rotate-6 hover:rotate-3 transition-all duration-300"
          style={{ fontFamily: "Fjalla One", fontWeight: "normal", color: "#b6dd9d" }}
        >
          {/* Image Section */}
          <div className="h-4/5 w-full">
            <img
              src={e.image}
              alt={e.name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Details Section */}
          <div className="h-1/5 flex flex-col justify-center px-4 py-2 bg-[#9c8dbc]">
            <p className="text-md">{e.name}</p>
            <p className="text-xs uppercase">Project</p>
          </div>
        </div>
      ))}
    </div>
  );
}
