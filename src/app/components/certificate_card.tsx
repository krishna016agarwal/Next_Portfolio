"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../css/certificate.module.css"; // Make sure this path is correct

// Define an interface for the certificate data for better type safety
interface Certificate {
  _id: string; // Assuming your data has a unique ID like _id for keys
  name: string;
  image: string;
  instituteName:string;
  createdAt: string;
}

export default function Certificate_card() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const fetchCertificates = async () => {
    try {
      // Assuming your API returns data in a structure like { data: Certificate[] }
      const response = await axios.get<{ data: Certificate[] }>("/api/certificates");
      setCertificates(response.data.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    // Grid container: uses CSS module for grid layout.
    // Tailwind classes for padding and min-height are kept for flexibility.
    <div className={`${style.certificateGridContainer} p-8 min-h-screen mt-32!`}>
      {certificates.map((certificate) => (
        <div
          key={certificate._id} // Use a unique ID from your data for the key
          className={style.card} // Base card styles from the CSS module
          style={{ fontFamily: "Fjalla One", fontWeight: "normal" }} // Inline font style from original
        >
          {/* Image Section */}
          <div className={style.imageContainer}>
            <img
              src={certificate.image}
              alt={certificate.name}
              className={style.image}
            />
          </div>

          {/* Text Sections: .details and .detailshover are direct children for absolute positioning */}
          
          {/* Default Details (Visible initially) */}
          <div className={style.details}>
            <p className="uppercase text-xl">{certificate.name}</p> {/* Kept text-xl, removed conflicting text-md */}
          </div>

          {/* Hover Details (Visible on hover) */}
          <div className={style.detailshover}>
            <p className="uppercase text-xl">{certificate.name}</p> {/* Kept text-xl */}
            <p>{certificate.instituteName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}