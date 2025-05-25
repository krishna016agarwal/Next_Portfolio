"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../css/certificate.module.css"; // Make sure this path is correct

interface Certificate {
  _id: string;
  name: string;
  image: string;
  instituteName: string;
  createdAt: string;
}

export default function Certificate_card() {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get<{ data: Certificate[] }>("/api/certificates");
      setCertificates(response.data.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="flex! justify-center! items-center! min-h-screen! text-2xl!  md:text-6xl!">
        Loading...
      </div>
    );
  }

  return (
    <div className={`${style.certificateGridContainer} p-8 min-h-screen mt-32!`}>
      {certificates.map((certificate) => (
        <div
          key={certificate._id}
          className={style.card}
          style={{ fontFamily: "Fjalla One", fontWeight: "normal" }}
        >
          <div className={style.imageContainer}>
            <img
              src={certificate.image}
              alt={certificate.name}
              className={style.image}
            />
          </div>

          <div className={style.details}>
            <p className="uppercase text-xl">{certificate.name}</p>
          </div>

          <div className={style.detailshover}>
            <p className="uppercase text-xl">{certificate.name}</p>
            <p>{certificate.instituteName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
