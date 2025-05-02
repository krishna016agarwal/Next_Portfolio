"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Certificate {
  _id?: string;
  name: string;
  image: string;
}

export default function CertificateManager() {
  const [certData, setCertData] = useState({ name: "", image: null as File | null });
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const fetchCertificates = async () => {
    const res = await axios.get("/api/certificates");
    setCertificates(res.data.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setCertData({ ...certData, image: files[0] });
    } else {
      setCertData({ ...certData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", certData.name);
    if (certData.image) formData.append("image", certData.image);

    try {
      await axios.post("/api/certificates", formData);
      setCertData({ name: "", image: null });
      fetchCertificates();
    } catch (err) {
      alert("Submission failed.");
      console.error(err);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete("/api/certificates", { data: { _id } });
      fetchCertificates();
    } catch (err) {
      alert("Failed to delete.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen! bg-black! text-white! p-8!">
      <form onSubmit={handleSubmit} className="bg-gray-900! p-6! rounded-xl! max-w-md! mx-auto! space-y-4!">
        <h2 className="text-2xl! font-bold! text-yellow-400!">Add Certificate</h2>
        <input
          type="text"
          name="name"
          value={certData.name}
          onChange={handleChange}
          placeholder="Certificate Name"
          className="w-full! p-3! rounded! bg-gray-700! focus:outline-none!"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full! file:bg-yellow-500! file:text-white! file:p-2! file:rounded! bg-gray-700!"
          required
        />
        <button
          type="submit"
          className="w-full! bg-yellow-400! text-black! font-bold! py-3! rounded! hover:bg-yellow-500!"
        >
          Submit
        </button>
      </form>

      <div className="mt-10! max-w-3xl! mx-auto! space-y-6!">
        <h3 className="text-xl! font-semibold!">Certificates</h3>
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="bg-gray-800! p-4! rounded-lg! flex! justify-between! items-center!"
          >
            <div>
              <p className="font-medium!">{cert.name}</p>
              <img src={cert.image} alt={cert.name} className="h-24! mt-2! rounded-lg!" />
            </div>
            <button
              onClick={() => handleDelete(cert._id!)}
              className="bg-red-600! px-3! py-1! rounded! text-sm! hover:bg-red-700!"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
