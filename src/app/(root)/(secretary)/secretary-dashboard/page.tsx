"use client";
import Sidebar from "@/app/components/sidebars/secretary-sidebar"
import { CalendarClock, Stethoscope} from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button";

const supabase = createClient()

type Consultation = {
  consultation_id: string;
  student_id: string;
  preferred_date: string;
  reason: string;
  additional_notes: string;
  status: string;
  created_at: string;
  name: string;
};

const SecretaryDashboard = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    setConsultations([]); // Reset consultations list

    console.log("Fetching dashboard data using consultation_details_view...");

    // fetch pending and approved consultation details from the VIEW
    const { data: activeConsultationsFromView, error: viewError } = await supabase
      .from("consultation_details_view") 
      .select("*")                         
      .or("status.eq.Pending,status.eq.Approved") 
      .order("created_at", { ascending: false });

    console.log("Step 1 - Active Consultations (from VIEW):", { data: activeConsultationsFromView, error: viewError });

    if (viewError) {
      console.error("Error fetching active consultations from view (Step 1):", viewError);
      setConsultations([]);
    } else {
      setConsultations((activeConsultationsFromView ?? []) as Consultation[]);
      if (!activeConsultationsFromView || activeConsultationsFromView.length === 0) {
        console.warn("Step 1 - Fetch from view was successful but returned 0 active (Pending or Approved) consultations.");
      }
    }

    // fetch counts
    console.log("Step 2 - Fetching counts...");
    const { count: pendingNum, error: pendingCountError } = await supabase
      .from("consultations") // Base table for count is fine
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    const { count: completedNum, error: completedCountError } = await supabase
      .from("consultations")
      .select("*", { count: "exact", head: true })
      .eq("status", "Completed");

    console.log("Step 2 - Counts data:", { pendingNum, pendingCountError, completedNum, completedCountError });

    if (pendingCountError) {
      console.error("Error fetching pending count (Step 2):", pendingCountError);
      setPendingCount(0);
    } else {
      setPendingCount(pendingNum ?? 0);
    }

    if (completedCountError) {
      console.error("Error fetching completed count (Step 2):", completedCountError);
      setCompletedCount(0);
    } else {
      setCompletedCount(completedNum ?? 0);
    }

    setLoading(false);
    console.log("Finished fetching dashboard data. Loading state:", loading);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (consultation_id: string, status: string) => {
    const { error } = await supabase
      .from("consultations")
      .update({ status })
      .eq("consultation_id", consultation_id);

    if (error) {
      console.error("Error updating status:", error);
      
    } else {
     
      fetchDashboardData();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div>
            <h1 className="text-xl font-bold pt-4 text-gray-800">Dashboard</h1>
          </div>

          {/* Top row widgets */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  {loading ? "Loading..." : pendingCount}
                </div>
                <div className="text-sm text-gray-500">Pending Consultations</div>
              </div>
              <CalendarClock className="w-10 h-10 text-[#009da2]" />
            </div>

            <div className="bg-white border shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  {loading ? "Loading..." : completedCount}
                </div>
                <div className="text-sm text-gray-500">Completed Consultations</div>
              </div>
              <Stethoscope className="w-10 h-10 text-[#8cdbed]" />
            </div>
          </div>

          {/* Bottom row container for approving or rejecting consultations */}
          <div className="mt-6">
            {loading && (
              <div className="text-center py-4">Loading consultations...</div>
            )}
            {!loading && consultations.length === 0 && (
              <div className="text-center text-gray-400 py-4">No pending consultations.</div>
            )}
            {!loading && consultations.length > 0 && (
              <div className="max-h-[350px] overflow-y-auto border border-gray-200 rounded-md p-2 space-y-3 bg-gray-50/50 shadow">
                {consultations.map(c => (
                  <div key={c.consultation_id} className="p-4 border border-gray-300 bg-white rounded-md text-sm">
                    <div><b>Student:</b> {c.name}</div>
                    <div><b>Date:</b> {c.preferred_date}</div>
                    <div><b>Reason:</b> {c.reason}</div>
                    <div><b>Notes:</b> {c.additional_notes}</div>
                    <div className="mt-2 flex gap-2">
                      {c.status === "Pending" && (
                        <>
                          <Button
                            onClick={() => handleUpdateStatus(c.consultation_id, "Approved")}
                            className="bg-[#2b9f4e] hover:bg-[#49ba6b] text-white px-3 py-1 rounded"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(c.consultation_id, "Rejected")}
                            className="bg-[#d82e2e] hover:bg-[#e84f4f] text-white px-3 py-1 rounded"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {c.status === "Approved" && (
                        <Button
                          onClick={() => handleUpdateStatus(c.consultation_id, "Completed")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
};

export default SecretaryDashboard;
