"use client";
import Sidebar from "@/app/components/ui/admin-sidebar";
import { createClient } from "@/utils/supabase/client";
import { Activity, Users, UserPlus, Inbox } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";

const supabase = createClient();

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching user count:", error.message);
      } else {
        setTotalUsers(count);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div>
            <h1 className="text-xl font-bold">This is the dashboard</h1>
          </div>

          {/* top row widgets */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#4bbdb9] border-1 border-b-[#4bbdb9] shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-white font-bold">
                  3
                </div>
                <div className="text-sm text-white">Active Users</div>
              </div>
              <Activity className="w-10 h-10 text-white" />
            </div>

            <div className="bg-white border-1 border-b-gray-100 shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  {totalUsers !== null ? totalUsers : "Loading..."}
                </div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <Users className="w-10 h-10 text-gray-400" />
            </div>

            <div className="bg-white border-1 border-b-gray-100 shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  5
                </div>
                <div className="text-sm text-gray-500">New Users</div>
              </div>
              <UserPlus className="w-10 h-10 text-gray-400" />
            </div>

            <div className="bg-white border-1 border-b-gray-100 shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  15
                </div>
                <div className="text-sm text-gray-500">Pending Requests</div>
              </div>
              <Inbox className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          {/* middle row widgets */}
          <div className="mt-6 grid md:grid-cols-3 sm:grid-cols-1 gap-4">
            <div className="bg-white border-1 border-b-gray-100 shadow rounded-md p-4 col-span-1">
              <div className="font-semibold mb-2">User Role Distribution</div>
              {/* pie chart */}

            </div>
            <div className="bg-white border-1 border-b-gray-100 shadow rounded-md p-4 col-span-2">
              {/* usage metrics */}
              <div className="font-semibold mb-2">System Usage</div>
            </div>
          </div>

          {/* bottom row (schedule preview) */}
          <div className="mt-6 bg-white border-1 border-b-gray-100 shadow rounded-md p-4">
            <div className="font-semibold mb-2">Medical Consultations</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;