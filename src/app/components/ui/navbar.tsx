"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Search, X } from "lucide-react";
import LoginButton from "@/components/ui/LoginLogoutButton";

// Mock notification type
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export default function Navbar() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Mock data - replace with actual API call
    const fetchNotifications = async () => {
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Appointment Reminder",
          message: "Your consultation with Dr. Smith is tomorrow at 10:00 AM",
          time: "2 hours ago",
          read: false,
        },
        {
          id: "2",
          title: "Test Results",
          message: "Your recent lab tests are now available",
          time: "1 day ago",
          read: true,
        },
      ];

      setNotifications(mockNotifications);
      setNotificationCount(mockNotifications.filter(n => !n.read).length);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setNotificationCount(notifications.filter(n => !n.read).length - 1);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  return (
    <nav className="flex items-center justify-between bg-white px-4 sm:px-6 md:px-8 lg:px-12 py-3 border-b border-b-gray-200 fixed top-0 left-0 right-0 z-10">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
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
        </Link>
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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-1 rounded-full hover:bg-gray-100"
          >
            <Bell className="cursor-pointer w-6 h-6 text-gray-600 hover:text-[#009da2] transition" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
              <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={markAllAsRead}
                    className="cursor-pointer text-xs text-[#009da2] hover:underline"
                  >
                    Mark all as read
                  </button>
                  <button 
                    onClick={() => setShowDropdown(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                <Link
                  href="/notifications"
                  className="text-sm text-[#009da2] hover:underline"
                  onClick={() => setShowDropdown(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        <LoginButton />
      </div>
    </nav>
  );
}