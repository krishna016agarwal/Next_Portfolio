"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [certData, setCertData] = useState({
    name: "",
    instituteName: "",
    image: null as File | null,
  });

  const [certificates, setCertificates] = useState< { _id: string; name: string; instituteName: string; image: string }[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    instituteName: "",
    image: null as File | null,
  });

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("/api/certificates");
      setCertificates(res.data.data);
    } catch (err) {
      alert("Failed to fetch certificates");
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/admin", {
        password: passwordInput,
      });
      if (res.data.success) {
        setAuthenticated(true);
        fetchCertificates();
      } else {
        alert("Incorrect password. Access denied.");
      }
    } catch (err) {
      alert("Error validating password");
      console.error(err);
    }
    setPasswordInput("");
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const { name, value, files } = e.target;
    if (isEdit) {
      setEditData((prev) => ({
        ...prev,
        [name]: name === "image" && files ? files[0] : value,
      }));
    } else {
      setCertData((prev) => ({
        ...prev,
        [name]: name === "image" && files ? files[0] : value,
      }));
    }
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", certData.name);
    formData.append("instituteName", certData.instituteName);
    if (certData.image) formData.append("image", certData.image);

    try {
      await axios.post("/api/certificates", formData);
      setCertData({ name: "", instituteName: "", image: null });
      fetchCertificates();
    } catch (err) {
      alert("Failed to add certificate");
      console.error(err);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete("/api/certificates", { data: { _id } });
      fetchCertificates();
    } catch (err) {
      alert("Failed to delete certificate");
      console.error(err);
    }
  };

  const openEditModal = (cert: {
    _id: string;
    name: string;
    instituteName: string;
  }) => {
    setEditData({
      _id: cert._id,
      name: cert.name,
      instituteName: cert.instituteName,
      image: null,
    });
    setShowEditModal(true);
  };

  const handleUpdateCertificate = async () => {
    const formData = new FormData();
    formData.append("_id", editData._id);
    formData.append("name", editData.name);
    formData.append("instituteName", editData.instituteName);
    if (editData.image) formData.append("image", editData.image);

    try {
      await axios.patch("/api/certificates", formData);
      setShowEditModal(false);
      fetchCertificates();
    } catch (err) {
      alert("Failed to update certificate");
      console.error(err);
    }
  };

  if (!authenticated) {
    return (
      <div className="!fixed !inset-0 !bg-black !bg-opacity-80 !flex !items-center !justify-center !z-50">
        <form
          onSubmit={handlePasswordSubmit}
          className="!bg-gray-900 !p-6 !rounded-lg !max-w-sm !w-full !space-y-4 !text-white"
        >
          <h2 className="!text-xl !font-bold !mb-4 !text-yellow-400 !text-center">
            ONLY ADMIN CAN ACCESS
          </h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="!w-full !p-3 !rounded !bg-gray-700 !text-white"
            required
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="!w-full !bg-yellow-400 !text-black !font-bold !py-3 !rounded !hover:bg-yellow-500"
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="!min-h-screen !bg-black !text-white !p-8 mt-20!">
      <form
        onSubmit={handleAddCertificate}
        className="!bg-gray-900 !p-6 !rounded-xl !max-w-md !mx-auto !space-y-4"
      >
        <h2 className="!text-2xl !font-bold !text-yellow-400">
          Add Certificate
        </h2>
        <input
          type="text"
          name="name"
          value={certData.name}
          onChange={handleInputChange}
          placeholder="Certificate Name"
          className="!w-full !p-3 !rounded !bg-gray-700"
          required
        />
        <input
          type="text"
          name="instituteName"
          value={certData.instituteName}
          onChange={handleInputChange}
          placeholder="Institute Name"
          className="!w-full !p-3 !rounded !bg-gray-700"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          className="!w-full !file:bg-yellow-500 !file:text-white !file:p-2 !file:rounded !bg-gray-700"
          required
        />
        <button
          type="submit"
          className="!w-full !bg-yellow-400 !text-black !font-bold !py-3 !rounded !hover:bg-yellow-500"
        >
          Submit
        </button>
      </form>

      <div className="!mt-10 !max-w-3xl !mx-auto !space-y-6">
        <h3 className="!text-xl !font-semibold">Certificates</h3>
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="!bg-gray-800 !p-4 !rounded-lg !flex !justify-between !items-center"
          >
            <div>
              <p className="!font-medium">{cert.name}</p>
              <p className="!font-medium">{cert.instituteName}</p>
              <Image width={150} height={100}
                src={cert.image}
                alt={cert.name}
                className="!h-24 !mt-2 !rounded-lg"
              />
            </div>
            <div className="!space-x-2">
              <button
                onClick={() => handleDelete(cert._id)}
                className="!bg-red-600 !px-3 !py-1 !rounded !text-sm !hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => openEditModal(cert)}
                className="!bg-blue-600 !px-3 !py-1 !rounded !text-sm !hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="!fixed !inset-0 !bg-black !bg-opacity-50 !flex !items-center !justify-center !z-50">
          <div className="!bg-white !p-6 !rounded-lg !max-w-md !w-full !text-black !space-y-4">
            <h2 className="!text-xl !font-semibold">Update Certificate</h2>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={(e) => handleInputChange(e, true)}
              className="!w-full !p-2 !border !rounded"
              placeholder="Certificate Name"
            />
            <input
              type="text"
              name="instituteName"
              value={editData.instituteName}
              onChange={(e) => handleInputChange(e, true)}
              className="!w-full !p-2 !border !rounded"
              placeholder="Institute Name"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => handleInputChange(e, true)}
              className="!w-full !p-2 !border !rounded"
            />
            <div className="!flex !justify-end !space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="!bg-gray-400 !px-4 !py-2 !rounded !hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCertificate}
                className="!bg-yellow-400 !px-4 !py-2 !rounded !hover:bg-yellow-500"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
