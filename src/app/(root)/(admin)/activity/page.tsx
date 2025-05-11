"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebars/admin-sidebar";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivityLogWithRole {
  id: string;
  userId: string;
  email: string;
  role: string;
  action: string;
  timestamp: string;
}

const supabase = createClient();

const Activity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityLogs, setActivityLogs] = useState<ActivityLogWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogsFromView = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching logs from view:", error.message);
      } else {
        setActivityLogs(data as ActivityLogWithRole[]);
      }

      setLoading(false);
    };

    fetchLogsFromView();
  }, []);

  const filteredLogs = activityLogs.filter((log) =>
    log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.timestamp?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivities = filteredLogs.length;

  const columnWidths = {
    user: "w-1/6",
    role: "w-1/6",
    action: "w-1/8",
    timestamp: "w-1/7",
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 flex flex-col overflow-hidden">
          <h1 className="text-xl font-bold pt-4 mb-6">User Activity</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-sm pl-10 pr-4 py-1.5 w-full"
                placeholder="Search Logs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden rounded-md border border-gray-200">
            {/* Fixed header */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/6 sticky top-0 z-10">User</TableHead>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/6 sticky top-0 z-10">Role</TableHead>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/8 sticky top-0 z-10">Action</TableHead>
                    <TableHead className="bg-gray-100 text-gray-800 w-1/7 sticky top-0 z-10">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto h-[calc(100vh-300px)]">
              <Table>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className={columnWidths.user}>{log.email}</TableCell>
                      <TableCell className={columnWidths.role}>{log.role}</TableCell>
                      <TableCell className={columnWidths.action}>{log.action}</TableCell>
                      <TableCell className={columnWidths.timestamp}>{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Row count footer inside table */}
            <div className="sticky bottom-0 bg-white border-t py-2 px-4 flex justify-end text-sm text-gray-700">
              <span>Rows returned: {totalActivities}</span>
            </div>
          </div>

          {/* Description outside table */}
          <div className="text-sm text-gray-700 mt-2 px-1">
            List of recent user activities in the system.
          </div>
        </main>
      </div>
    </div>
  );
};

export default Activity;
