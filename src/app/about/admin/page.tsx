'use client';

import { useState } from 'react';
import axios from "axios";
export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
 const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/resume', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessage(data.success ? 'File uploaded successfully' : 'Upload failed');
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
    <div className="min-h-screen! flex! flex-col! items-center! justify-center! bg-gray-50! gap-4! p-6!">
      <h1 className="text-2xl! font-semibold! text-black!">Admin Panel</h1>
      <input type="file" className=" text-black!"onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        className="bg-blue-600! text-white! py-2! px-4! rounded! hover:bg-blue-700!"
      >
        Upload Resume
      </button>
      <p className='text-green-300!'>{message}</p>
    </div>
  );
}
