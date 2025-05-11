"use client";

import Sidebar from "@/app/components/ui/doctor-sidebar";

const HealthRecordForm = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold pt-4 mb-6">Student Health Record Form</h1>
        </main>
      </div>
    </div>
  );
};

export default HealthRecordForm;