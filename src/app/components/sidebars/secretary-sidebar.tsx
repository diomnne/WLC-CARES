"use client";
import { JSX } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, LayoutGrid, Calendar, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { signout } from "@/lib/auth-actions";

function SidebarItem({ icon, text, route }: { icon: JSX.Element; text: string; route: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <button
      onClick={() => router.push(route)}
      className={`flex items-center w-full p-3 rounded-md cursor-pointer transition-all
        justify-start space-x-4
        ${
          isActive
            ? "bg-white text-[#009da2]"
            : "text-gray-800 hover:bg-white hover:text-[#009da2]"
        }`}
    >
      <span className="text-[20px]">{icon}</span>
      <span className="whitespace-nowrap">{text}</span>
    </button>
  );
}

function LogOutButton({ icon, text, onClick, isActive = false }: { icon: JSX.Element; text: string; onClick: () => void; isActive?: boolean;}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-md cursor-pointer transition-all
        justify-start space-x-4
        ${
          isActive
            ? "bg-white text-red-500"
            : "text-gray-800 hover:bg-white hover:text-red-500"
        }`}
    >
      <span className="text-[20px]">{icon}</span>
      <span className="whitespace-nowrap">{text}</span>
    </button>
  );
}

export default function SecretarySidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [canShowButton, setCanShowButton] = useState(true); 

  useEffect(() => {
    
    if (!isSidebarOpen) {
      setCanShowButton(false);
      
      const timer = setTimeout(() => {
        setCanShowButton(true);
      }, 300); 

      return () => clearTimeout(timer);
    } else {
      setCanShowButton(true); 
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex relative">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30 transition-opacity duration-300 md:hidden"
        ></div>
      )}

      {/* for small screens */}
      {!isSidebarOpen && canShowButton && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-16 left-4 bg-white p-2 mt-4 rounded-md z-10 md:hidden"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div
        className={`fixed left-0 bg-[#ddf5e7] border-t-1 border-t-gray-200 p-5 w-64 transition-transform duration-300 z-40
          ${
            isSidebarOpen
              ? "translate-x-0 shadow-lg h-screen top-0"
              : "-translate-x-full h-full top-16 md:h-[calc(100vh-4rem)]"
          }
          md:translate-x-0 md:top-16 md:h-[calc(100vh-4rem)] md:block
        `}
      >
        {/* Sidebar Items */}
        <nav className="space-y-2">
          <div className="pt-20 md:pt-0"></div>
          <SidebarItem icon={<LayoutGrid />} text="Dashboard" route="/secretary-dashboard" />
          <SidebarItem icon={<Calendar />} text="Consultations" route="/consultation-schedules" />
          <div className="mt-10"></div>
          <LogOutButton icon={<LogOut />} text="Log Out" onClick={signout} />
        </nav>
      </div>

      <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-0" : "md:ml-53"}`}>
        {/* Main Content Area */}
      </div>
    </div>
  );
}