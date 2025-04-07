"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

import Sidebar from "@/app/components/ui/admin-sidebar";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      
      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold">This is the dashboard page</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
