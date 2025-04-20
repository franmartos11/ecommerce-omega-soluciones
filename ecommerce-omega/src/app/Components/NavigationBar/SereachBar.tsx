'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const param = searchParams.get('busqueda') || '';
    setSearch(param);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set('busqueda', value) : params.delete('busqueda');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center border border-green-300 rounded-md overflow-hidden shadow-sm">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search for items..."
        className="w-full px-4 py-2 text-sm outline-none text-black"
      />
      <div className="bg-white px-3">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
}
