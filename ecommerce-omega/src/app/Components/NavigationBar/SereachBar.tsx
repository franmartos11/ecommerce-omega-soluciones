"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const param = searchParams.get("busqueda") || "";
    setInputValue(param);
  }, [searchParams]);

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (inputValue.trim()) {
      params.set("busqueda", inputValue.trim());
    } else {
      params.delete("busqueda");
    }

    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center border border-border rounded-md overflow-hidden shadow-md focus-within:ring-2 ring-border2 transition w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos..."
        className="w-full px-4 py-2 text-sm outline-none"
        style={{ color: "var(--color-primary-text)" }}
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="
    cursor-pointer px-3 py-2 rounded-l-none
    transition-all duration-300 ease-in-out
    bg-[var(--color-primary-bg)] text-[var(--color-tertiary-text)]
    hover:bg-[var(--color-secondary-bg)] hover:shadow-lg hover:scale-110
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-bg)]
  "
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}
