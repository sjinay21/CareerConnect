"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname == "/onboarding") return null;

  return (
    <footer className="w-full bg-gray-200 flex flex-col items-center justify-center py-6 mt-auto">
      <Link href="/" className="flex gap-1 items-center cursor-pointer mb-2">
        <h3 className="text-blue-800 font-bold text-2xl">Linked</h3>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10"
          alt="Linkedlogo"
          className="w-6 h-6"
        />
      </Link>
      <p className="text-gray-600 text-sm">@Copyright 2026</p>
    </footer>
  );
}
