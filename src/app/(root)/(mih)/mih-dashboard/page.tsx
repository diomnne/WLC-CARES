"use client";
import Sidebar from "@/app/components/ui/student-sidebar";

const MIHDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold">Medicine Inventory Handler Dashboard</h1>
        </main>
      </div>
    </div>
  );
};

export default MIHDashboard;
