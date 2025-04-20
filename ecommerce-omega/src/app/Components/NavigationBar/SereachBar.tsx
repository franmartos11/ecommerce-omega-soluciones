'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const param = searchParams.get('busqueda') || '';
    setInputValue(param);
  }, [searchParams]);

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (inputValue.trim()) {
      params.set('busqueda', inputValue.trim());
    } else {
      params.delete('busqueda');
    }

    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center border border-green-400 rounded-md overflow-hidden shadow-md focus-within:ring-2 ring-green-300 transition w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos..."
        className="w-full px-4 py-2 text-sm outline-none text-black"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-3 py-2 transition-all duration-300 ease-in-out 
                   hover:bg-green-600 hover:shadow-lg hover:scale-110 active:scale-95 rounded-l-none"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}
