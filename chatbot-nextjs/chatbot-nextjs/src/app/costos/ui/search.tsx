"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface SearchProps {
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Search({ placeholder, onChange }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="relative flex items-center w-full">
            <label htmlFor="search" className="sr-only">Buscar</label>
            <input
                id="search"
                type="text"
                value={searchTerm}
                placeholder={placeholder}
                onChange={(e) => {
                    setSearchTerm(e.target.value);  // Actualiza el estado local
                    onChange(e);  // Propaga el evento al padre
                }}
                className="peer block w-full rounded-lg border border-gray-300 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
        </div>
    );
}