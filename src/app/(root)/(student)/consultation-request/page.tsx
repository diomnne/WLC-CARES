"use client";

import Sidebar from "@/app/components/ui/student-sidebar";

const ConsultationRequest = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold">Request a medical consultation</h1>
        </main>
      </div>
    </div>
  );
};

export default ConsultationRequest;
