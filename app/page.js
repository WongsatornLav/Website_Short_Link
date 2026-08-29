'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, customId }),
    });
    
    const data = await res.json();
    if (res.ok) {
      setShortUrl(`${window.location.origin}${data.shortUrl}`);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">✂️ ย่อลิงก์ของคุณ</h1>
        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ลิงก์ต้นฉบับ (ต้องมี http:// หรือ https://)</label>
            <input 
              type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
              className="w-full border p-2 rounded" placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ตั้งชื่อ Custom (ไม่ใส่ก็ได้)</label>
            <input 
              type="text" value={customId} onChange={(e) => setCustomId(e.target.value)}
              className="w-full border p-2 rounded" placeholder="เช่น my-link"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            ย่อลิงก์เลย!
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded text-center">
            <p className="text-sm mb-2">ลิงก์ของคุณพร้อมแล้ว:</p>
            <a href={shortUrl} target="_blank" className="font-bold underline break-all">{shortUrl}</a>
          </div>
        )}
      </div>
    </div>
  );
}