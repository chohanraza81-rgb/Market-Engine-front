'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LiveStatus() {
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/health`, { timeout: 5000 });
        setIsLive(res.data.status === 'online');
      } catch { setIsLive(false); }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#2dd4bf] animate-pulse' : 'bg-red-500'}`}></span>
      <span className="text-gray-500">{isLive ? 'LIVE' : 'OFFLINE'}</span>
    </div>
  );
}
