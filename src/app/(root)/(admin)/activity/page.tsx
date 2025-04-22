"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/ui/admin-sidebar";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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

const supabase = createClient();

const Activity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching logs:", error.message);
      } else {
        setActivityLogs(data as ActivityLog[]);
      }

      setLoading(false);
    };

    fetchLogs();
  }, []);

  const filteredLogs = activityLogs.filter((log) =>
    log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivities = filteredLogs.length;

  const columnWidths = {
    role: "w-1/6",
    action: "w-1/8",
    description: "w-1/3",
    timestamp: "w-1/7",
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 flex flex-col">
          <h1 className="text-xl font-bold mb-6">Log Trail</h1>

          <div className="flex items-center gap-3 mb-6">
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

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H21M7 12H17M10 18H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/6">Role</TableHead>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/8">Action</TableHead>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/3">Description</TableHead>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/7">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

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
                    <TableCell colSpan={3} className="bg-gray-50">
                      Rows returned
                    </TableCell>
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
