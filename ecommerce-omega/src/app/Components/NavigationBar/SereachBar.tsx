"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  // Leer el valor de búsqueda desde la URL
  useEffect(() => {
    const param = searchParams.get("busqueda") || "";
    setSearch(param);
  }, [searchParams]);

  // Actualizar URL al escribir
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("busqueda", value);
    } else {
      params.delete("busqueda");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full flex text-black justify-center ">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          handleSearch(value);
        }}
        placeholder="Buscar productos..."
        className="w-full max-w-md border px-4 py-2 rounded-lg shadow-sm text-sm"
      />
    </div>
  );
};

export default SearchBar;
