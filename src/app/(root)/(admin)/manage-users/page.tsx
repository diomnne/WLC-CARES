"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/app/components/sidebars/admin-sidebar"
import { createClient } from "@/utils/supabase/client"
import { UserTable, User } from "@/app/components/ui/users-table"

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, role, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error)
      } else {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold pt-4 mb-4">Manage Users</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <UserTable data={users} />
          )}
        </main>
      </div>
    </div>
  )
}

export default ManageUsers