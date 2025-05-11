"use client";
import Sidebar from "@/app/components/sidebars/student-sidebar";

const StudentDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold pt-4">Student Dashboard</h1>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
