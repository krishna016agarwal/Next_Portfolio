// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import axios from "axios";

// MINIMAL ADDITION: Helper function (if not already present or imported)
function getAdminPageErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    // More specific to context if desired
    return "An unexpected admin page error occurred.";
}


export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);


  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    setUploading(true);
    setMessage('Uploading...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });
      // Assuming original error handling for res.ok and data parsing was fine
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`File uploaded successfully! URL: ${data.fileUrl}`);
      } else {
        setMessage(`Upload failed: ${data.message || 'Unknown error'}`);
        console.error('Upload failed response:', data);
      }
    } catch (error: unknown) { // MODIFIED: If this catch was flagged
      const msg = getAdminPageErrorMessage(error);
      setMessage(`Upload failed: ${msg}`);
      console.error('Upload fetch error:', msg, error); // Log original error too
    } finally {
      setUploading(false);
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
      } else {
        alert("Incorrect password. Access denied.");
      }
    } catch (err: unknown) { // MODIFIED: If this catch was flagged
      // The alert here is from your original code.
      // Using the helper for console.error for consistency if desired.
      const errorMsg = getAdminPageErrorMessage(err);
      alert(`Error validating password: ${errorMsg}`); // Show user a message
      console.error('Password validation error:', errorMsg, err); // Log original error too
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
    <div className="min-h-screen! flex! flex-col! items-center! justify-center! bg-gray-100! gap-6! p-6!">
      <h1 className="text-3xl! font-bold! text-gray-800!">Admin Panel - Resume Upload</h1>
      <div className="bg-white! p-8! rounded-lg! shadow-md! w-full! max-w-md!">
        <div className="mb-4">
          <label htmlFor="fileInput" className="block! text-sm! font-medium! text-gray-700! mb-1!">
            Select Resume File
          </label>
          <input
            id="fileInput"
            type="file"
            className="block! w-full! text-sm! text-gray-500! file:mr-4! file:py-2! file:px-4! file:rounded-full! file:border-0! file:text-sm! file:font-semibold! file:bg-blue-50! file:text-blue-700! hover:file:bg-blue-100!"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.doc,.docx"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full! bg-blue-600! text-white! font-bold! py-3! px-4! rounded! hover:bg-blue-700! focus:outline-none! focus:ring-2! focus:ring-blue-500! focus:ring-opacity-50! disabled:opacity-50!"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
        {message && (
          <p className={`mt-4 text-sm ${message.startsWith('Upload failed') || message.startsWith('Please select') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}