"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import LoginButton from "@/components/ui/LoginLogoutButton";

export default function Navbar() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      
      const count = 0;

      setNotificationCount(count);
    };

    fetchNotifications();
  }, []);

  return (
    <nav className="flex items-center justify-between bg-white px-4 sm:px-6 md:px-8 lg:px-12 py-3 border-b border-b-gray-200 fixed top-0 left-0 right-0 z-10">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.svg"
          alt="WLC Cares Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <h1 className="text-xl font-bold text-[#009da2] hidden sm:inline cursor-default select-none">
          WLC<span className="text-teal-400">CARES</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] sm:max-w-sm hidden sm:flex items-center">
        <Search className="absolute left-3 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#009da2]"
        />
      </div>

      {/* Search Icon Only on Small Screens */}
      <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
        <Search className="text-gray-600 w-6 h-6" />
      </div>

      {/* Icons + Login */}
      <div className="flex items-center space-x-4">
        <Link href="/notifications" className="relative">
          <Bell className="w-6 h-6 text-gray-600 hover:text-[#009da2] transition" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {notificationCount}
            </span>
          )}
        </Link>
        <LoginButton />
      </div>
    </nav>
  );
}
