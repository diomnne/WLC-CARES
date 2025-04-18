"use client";
import { JSX, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { Menu, LayoutGrid, Activity, Users, Calendar, Clipboard, Pill } from "lucide-react";

function SidebarItem({ icon, text, isOpen, route }: { icon: JSX.Element; text: string; isOpen: boolean; route: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === route;

  return (
    <button
      onClick={() => router.push(route)}
      className={`flex items-center w-full p-3 rounded-md cursor-pointer transition-all
        ${isOpen ? "justify-start space-x-4" : "justify-center"}
        ${
          isActive
            ? "bg-white text-[#009da2]"
            : "text-gray-800 hover:bg-white hover:text-[#009da2]"
        }`}
    >
      <span className="text-[20px]">{icon}</span>
      {isOpen && <span className="whitespace-nowrap">{text}</span>}
    </button>
  );
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-open");
    setIsOpen(savedState === null ? true : savedState === "true");
  }, []);
  
  useEffect(() => {
    if (isOpen !== null) {
      localStorage.setItem("sidebar-open", isOpen.toString());
    }
  }, [isOpen]);

  if (isOpen === null) {
    return null; 
  }

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
          className="mb-6 text-gray-600 focus:outline-none cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Menu size={28} />
        </button>

        {/* Sidebar Items */}
        <nav className="space-y-6">
          <SidebarItem icon={<LayoutGrid />} text="Dashboard" isOpen={isOpen} route="/admin-dashboard" />
          <SidebarItem icon={<Activity />} text="Activity" isOpen={isOpen} route="/activity" />
          <SidebarItem icon={<Users />} text="Manage Users" isOpen={isOpen} route="/manage-users" />
          <SidebarItem icon={<Calendar />} text="Schedule" isOpen={isOpen} route="/consultation-schedules" />
          <SidebarItem icon={<Clipboard />} text="Medical Records" isOpen={isOpen} route="/medical-records" />
          <SidebarItem icon={<Pill />} text="Medicine Inventory" isOpen={isOpen} route="/medicine-inventory" />
        </nav>
      </div>
 
      <div className={`flex-1 p-6 transition-all ${isOpen ? "ml-50" : "ml-2"}`}>
      </div>
    </div>
  );
}

