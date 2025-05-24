"use client";


import Sidebar from "@/app/components/sidebars/secretary-sidebar";

const ConsultationSchedules = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl pt-4 font-bold text-gray-800">This is the consultation schedules page</h1>
        </main>
      </div>
    </div>
  );
};

export default ConsultationSchedules;
