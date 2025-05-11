"use client";

import Sidebar from "@/app/components/sidebars/admin-sidebar";

const MedicalRecords = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold pt-4 mb-6">Student Health Records (view-only accesss)</h1>
        </main>
      </div>
    </div>
  );
};

export default MedicalRecords;
