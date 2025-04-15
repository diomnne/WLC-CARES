"use client";

import Sidebar from "@/app/components/ui/student-sidebar";

const StudentRecord = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold">My History</h1>
        </main>
      </div>
    </div>
  );
};

export default StudentRecord;
