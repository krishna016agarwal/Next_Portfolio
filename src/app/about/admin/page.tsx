'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

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

  return (
    <div className="min-h-screen! flex! flex-col! items-center! justify-center! bg-gray-50! gap-4! p-6!">
      <h1 className="text-2xl! font-semibold! text-black!">Admin Panel</h1>
      <input type="file" className=" text-black!"onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        className="bg-blue-600! text-white! py-2! px-4! rounded! hover:bg-blue-700!"
      >
        Upload File
      </button>
      <p className='text-green-300!'>{message}</p>
    </div>
  );
}
