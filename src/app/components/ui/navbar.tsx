"use client";
import Image from "next/image";
import { Bell } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
            src="/logo.svg" 
            alt="WLC Cares Logo"
            width={20} 
            height={20}
            className="w-10 h-10"
        />
        <h1 className="text-xl font-bold text-[#009da2]">WLC<span className="text-teal-400">CARES</span></h1>
      </div>

      {/* Search Bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-md px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#009da2]"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
      <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
      </div>
    </nav>
  );
}
