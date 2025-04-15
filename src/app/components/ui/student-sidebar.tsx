"use client";
import { JSX, useState } from "react";
import { useRouter } from "next/navigation"; 
import { Menu, LayoutGrid, Clipboard, Clock1, Stethoscope } from "lucide-react";

// sidebar buttons
function SidebarItem({ icon, text, isOpen, route }: { icon: JSX.Element; text: string; isOpen: boolean; route: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(route)}
      className={`flex items-center w-full p-3 text-gray-800 hover:bg-white hover:text-[#009da2] rounded-md cursor-pointer transition-all ${
        isOpen ? "justify-start space-x-4" : "justify-center"
      }`}
    >
      <span className="text-[20px]">{icon}</span>
      {isOpen && <span className="whitespace-nowrap">{text}</span>}
    </button>
  );
}


export default function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-16 bg-[#ffebea] p-5 transition-all duration-300 ${
          isOpen ? "w-64 p-5" : "w-16 p-3"
        } h-[calc(100vh-4rem)]`}
      >
        {/* Menu Button */}
        <button
          className="mb-6 text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={28} />
        </button>

        {/* Sidebar Items */}
        <nav className="space-y-6">
          <SidebarItem icon={<LayoutGrid />} text="Dashboard" isOpen={isOpen} route="/student-dashboard" />
          <SidebarItem icon={<Clipboard />} text="My Medical Record" isOpen={isOpen} route="/student-record" />
          <SidebarItem icon={<Stethoscope />} text="Medical Consultation" isOpen={isOpen} route="/consultation-request" />
          <SidebarItem icon={<Clock1 />} text="History" isOpen={isOpen} route="/student-history" />
        </nav>
      </div>

      {/* Content */}  
      <div className={`flex-1 p-6 transition-all ${isOpen ? "ml-50" : "ml-2"}`}>
      </div>
    </div>
  );
}
