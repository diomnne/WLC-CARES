"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/app/components/sidebars/admin-sidebar"
import { createClient } from "@/utils/supabase/client"
import { UserTable, User } from "@/app/components/ui/users-table"

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createClient(); // Initialize supabase client once

  const fetchUsers = async () => {
    // Renamed to be callable for re-fetching
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, role, created_at, is_active") // Added is_active
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Ensure users is an empty array on error
    } else {
      const transformedData = (data || []).map((user) => ({
        ...user,
        user_id: user.id, // Map id to user_id from profiles table
        is_active: user.is_active !== null ? user.is_active : true, // Handle potential null from DB
      }));
      setUsers(transformedData as User[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
    fetchUsers(); // Initial fetch
  }, []); // Removed supabase from dependency array as it's stable

  const handleUpdateRole = async (profileId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId);

    if (error) {
      console.error("Error updating role:", error);
      // toast.error("Failed to update role."); // You can add toast notifications here
    } else {
      // toast.success("User role updated.");
      fetchUsers(); // Re-fetch users to reflect changes
    }
  };

  const handleToggleStatus = async (profileId: string, currentIsActive: boolean, authUserId: string) => {
    // Note: authUserId from row.original.user_id is the Supabase Auth UID.
    // Deactivating/activating in Supabase Auth (e.g., auth.admin.updateUserById) typically requires a server-side function.
    // Here, we'll just update the is_active flag in the profiles table.
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !currentIsActive })
      .eq("id", profileId);

    if (error) {
      console.error("Error toggling user status:", error);
      // toast.error("Failed to update status.");
    } else {
      // toast.success("User status updated.");
      fetchUsers(); // Re-fetch users
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold pt-4 mb-4">Manage Users</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <UserTable 
              data={users} 
              onUpdateRole={handleUpdateRole} 
              onToggleStatus={handleToggleStatus} 
              currentUserId={currentUserId}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default ManageUsers