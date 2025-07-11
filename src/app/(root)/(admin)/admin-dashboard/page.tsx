"use client"

import Sidebar from "@/app/components/sidebars/admin-sidebar"
import { createClient } from "@/utils/supabase/client"
import { Users, IdCard, BriefcaseMedical, Inbox } from "lucide-react"
import { useEffect, useState } from "react"
import { UserRoleDistributionChart } from "@/app/components/ui/users-pie-chart"
import { ActivityAreaChart } from "@/app/components/ui/activity-area-chart"

const supabase = createClient()

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [studentCount, setStudentCount] = useState<number | null>(null)
  const [clinicStaffCount, setClinicStaffCount] = useState<number | null>(null)
  const [roleData, setRoleData] = useState<
    { role: string; count: number; fill: string }[]
  >([])
  const [activityData, setActivityData] = useState<
    { date: string; count: number }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      const clinicStaffRoles = [
        "Doctor",
        "Nurse",
        "Secretary",
      ]
  
      const [
        { count: total, error: totalError },
        { count: students, error: studentError },
        { count: staff, error: staffError },
        { data: rolesData, error: roleError },
        { data: activityRows, error: activityError },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).neq("role", "Admin"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "Student"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", clinicStaffRoles),
        supabase.from("profiles").select("role").neq("role", "Admin"),
        supabase.rpc("get_activity_counts_last_7_days"),
      ])
  
      if (!totalError) setTotalUsers(total)
      if (!studentError) setStudentCount(students)
      if (!staffError) setClinicStaffCount(staff)
  
      if (!roleError && rolesData) {
        const roleCounts: Record<string, number> = {}
        rolesData.forEach((user) => {
          const role = user.role || "Unknown"
          roleCounts[role] = (roleCounts[role] || 0) + 1
        })
  
        const colorMap = {
          Student: "#b2f0e8",
          Doctor: "#117c6f",
          Nurse: "#2fc4b2",
          "Secretary": "#289c8e",
          Unknown: "#ccc",
        }
  
        const formattedData = Object.entries(roleCounts).map(([role, count]) => ({
          role,
          count,
          fill: colorMap[role as keyof typeof colorMap] || "#ccc",
        }))
  
        setRoleData(formattedData)
      }
  
      if (!activityError && activityRows) {
        setActivityData(activityRows)
      }
    }
  
    fetchData()
  }, [])

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div>
            <h1 className="text-xl font-bold pt-4">Dashboard</h1>
          </div>

          {/* Top row widgets */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  {totalUsers !== null ? totalUsers : "Loading..."}
                </div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <Users className="w-10 h-10 text-[#009da2]" />
            </div>

            <div className="bg-white border shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  {studentCount !== null ? studentCount : "Loading..."}
                </div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <IdCard className="w-10 h-10 text-[#8cdbed]" />
            </div>

            <div className="bg-white border shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-xl text-gray-800 font-bold">
                  {clinicStaffCount !== null ? clinicStaffCount : "Loading..."}
                </div>
                <div className="text-sm text-gray-500">Clinic Staff</div>
              </div>
              <BriefcaseMedical className="w-10 h-10 text-[#addbda]" />
            </div>
          </div>

          {/* Middle row widgets */}
          <div className="mt-6 grid md:grid-cols-3 sm:grid-cols-1 gap-4">
            <div className="bg-white border shadow rounded-md p-4 col-span-1">
              <div className="font-semibold mb-2">User Role Distribution</div>
              <div className="text-sm text-gray-500">
                Based on all registered users in the system
              </div>
              {roleData.length > 0 ? (
                <UserRoleDistributionChart roleData={roleData} />
              ) : (
                <div className="text-gray-500 text-sm">Loading chart...</div>
              )}
            </div>
            <div className="bg-white border shadow rounded-md p-4 col-span-2">
              <div className="font-semibold mb-2">System Usage</div>
              <div className="text-sm text-gray-500">
                Based on system activity for the last 7 days
              </div>
              {activityData.length > 0 ? (
                <ActivityAreaChart data={activityData} />
              ) : (
                <div className="text-gray-500 text-sm">Loading chart...</div>
              )}
            </div>
          </div>

          {/* Bottom row 
          <div className="mt-6 bg-white border shadow rounded-md p-4">
            <div className="font-semibold mb-2">Medical Consultations</div>
          </div> */}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
