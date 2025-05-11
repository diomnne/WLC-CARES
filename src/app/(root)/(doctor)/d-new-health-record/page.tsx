"use client";

import Sidebar from "@/app/components/sidebars/doctor-sidebar";
import HealthRecordForm from "@/app/components/forms/health-record-form/page";

const NewHealthRecord = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-xl font-bold pt-4">Student Health Record Form</h1>

          {/* Personal Information Section */}
          <section className="bg-white rounded-xl p-6 mb-8">
            <HealthRecordForm />
          </section>

          {/* You can add more sections below (e.g., Immunization, Medical History, etc.) */}
        </main>
      </div>
    </div>
  );
};

export default NewHealthRecord;
