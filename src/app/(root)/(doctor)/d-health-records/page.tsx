"use client";
import Sidebar from "@/app/components/sidebars/doctor-sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MedicalRecords = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold pt-4 mb-6">Student Health Records Directory</h1>
          <div>
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => router.push("/d-new-health-record")}>
              Add New Health Record
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalRecords;
