"use client";
import { useState } from "react";
import Sidebar from "@/app/components/ui/admin-sidebar";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface ActivityLog {
  id: string;
  userId: string;
  role: string;
  action: string;
  description: string;
  timestamp: string;
}

const Activity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const activityLogs: ActivityLog[] = [
    { id: "1", userId: "johndoe@example.com", role: "Student", action: "Login", description: "User johndoe@example.com logged in", timestamp: "02 Apr 25 04:07pm" },
    { id: "2", userId: "johndoe@example.com", role: "Student", action: "Login", description: "User johndoe@example.com logged in", timestamp: "02 Apr 25 02:28pm" },
    { id: "3", userId: "johndoe@example.com", role: "Student", action: "Register", description: "User johndoe@example.com registered", timestamp: "02 Apr 25 02:27pm" },
    { id: "4", userId: "johndoe@example.com", role: "Medicine Inventory Handler", action: "Login", description: "User johndoe@example.com logged in", timestamp: "02 Apr 25 10:34am" },
    { id: "5", userId: "johndoe@example.com", role: "Doctor", action: "Login", description: "User johndoe@example.com logged in", timestamp: "02 Apr 25 10:11am" },
    { id: "6", userId: "johndoe@example.com", role: "Nurse", action: "Request medic...", description: "User johndoe@example.com requested medicine", timestamp: "02 Apr 25 08:45am" },
    { id: "7", userId: "johndoe@example.com", role: "Medical Records Officer", action: "Login", description: "User johndoe@example.com logged in", timestamp: "02 Apr 25 06:23am" },
    { id: "8", userId: "johndoe@example.com", role: "Admin", action: "Login", description: "User johndoe@example.com logged in", timestamp: "01 Apr 25 09:03am" },
    { id: "9", userId: "janedoe@example.com", role: "Student", action: "Update Profile", description: "User janedoe@example.com updated profile", timestamp: "01 Apr 25 08:14am" },
    { id: "10", userId: "marksmith@example.com", role: "Doctor", action: "Create Record", description: "User marksmith@example.com created medical record", timestamp: "01 Apr 25 07:45am" },
    { id: "11", userId: "sarahlee@example.com", role: "Nurse", action: "Dispense Med", description: "User sarahlee@example.com dispensed medication", timestamp: "01 Apr 25 07:22am" },
    { id: "12", userId: "robertjones@example.com", role: "Admin", action: "Add User", description: "User robertjones@example.com added new user", timestamp: "01 Apr 25 06:55am" },
    { id: "13", userId: "emilywong@example.com", role: "Medical Records Officer", action: "Update Record", description: "User emilywong@example.com updated medical record", timestamp: "01 Apr 25 06:30am" },
    { id: "14", userId: "davidkim@example.com", role: "Student", action: "Logout", description: "User davidkim@example.com logged out", timestamp: "01 Apr 25 05:48am" },
    { id: "15", userId: "lisapark@example.com", role: "Medicine Inventory Handler", action: "Add Medicine", description: "User lisapark@example.com added medicine to inventory", timestamp: "01 Apr 25 05:21am" },
    { id: "16", userId: "michaelbrown@example.com", role: "Doctor", action: "Video Call", description: "User michaelbrown@example.com started video consultation", timestamp: "01 Apr 25 04:59am" },
    { id: "17", userId: "jennifertaylor@example.com", role: "Nurse", action: "View Report", description: "User jennifertaylor@example.com viewed patient report", timestamp: "01 Apr 25 04:34am" },
    { id: "18", userId: "williamclark@example.com", role: "Admin", action: "Reset Password", description: "User williamclark@example.com reset user password", timestamp: "01 Apr 25 04:07am" },
    { id: "19", userId: "oliviamartin@example.com", role: "Student", action: "Submit Form", description: "User oliviamartin@example.com submitted health form", timestamp: "01 Apr 25 03:45am" },
    { id: "20", userId: "jamesharris@example.com", role: "Medicine Inventory Handler", action: "Update Stock", description: "User jamesharris@example.com updated medicine stock", timestamp: "01 Apr 25 03:22am" },
  ];

  const filteredLogs = activityLogs.filter(log => 
    log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivities = filteredLogs.length;

  const columnWidths = {
    role: "w-1/5",
    action: "w-1/6",
    description: "w-1/3",
    timestamp: "w-1/7"
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 flex flex-col">
          <h1 className="text-xl font-bold mb-6">Log Trail</h1>
          
          {/* Search + Filter Row */}
          <div className="flex items-center gap-3 mb-6">
  {/* Search Bar */}
  <div className="relative w-full max-w-md">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      className="bg-white border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 w-full"
      placeholder="Search Logs"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Filter Button */}
  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
</div>

          
          {/* Table Container with fixed height and scroll */}
          <div className="flex-1 overflow-hidden">
            {/* Separate header */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-teal-500 text-white w-1/5">Role</TableHead>
                    <TableHead className="bg-teal-500 text-white w-1/6">Action</TableHead>
                    <TableHead className="bg-teal-500 text-white w-1/3">Description</TableHead>
                    <TableHead className="bg-teal-500 text-white w-1/7">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto h-[calc(100vh-350px)]">
              <Table>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className={columnWidths.role}>{log.role}</TableCell>
                      <TableCell className={columnWidths.action}>{log.action}</TableCell>
                      <TableCell className={columnWidths.description}>{log.description}</TableCell>
                      <TableCell className={columnWidths.timestamp}>{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="bg-white border-t py-2">
                  List of recent user activities in the system.
                </TableCaption>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="bg-gray-50">Total Activities</TableCell>
                    <TableCell className="bg-gray-50">{totalActivities}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Activity;