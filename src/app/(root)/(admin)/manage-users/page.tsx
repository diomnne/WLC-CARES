"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/app/components/sidebars/admin-sidebar"
import { createClient } from "@/utils/supabase/client"
import { UserTable, User } from "@/app/components/ui/users-table"
import { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [rowCount, setRowCount] = useState(0);

  const supabase = createClient();

  const fetchUsers = async (currentPage: number, pageSize: number) => {
    setLoading(true);
    console.log(`Fetching users for page: ${currentPage}, pageSize: ${pageSize}`);
    const from = currentPage * pageSize;
    const to = from + pageSize - 1;
    console.log(`Supabase range: from ${from} to ${to}`);

    const { data, error, count } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, role, created_at", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(from, to);

    console.log("Supabase response:", { data, error, count });

    if (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setRowCount(0);
    } else {
      console.log("Raw data from Supabase:", data);
      console.log("Total count from Supabase:", count);
      const transformedData = (data || []).map((user) => ({
        ...user,
        user_id: user.id,
      }));
      console.log("Transformed data:", transformedData);
      setUsers(transformedData as User[]);
      setRowCount(count || 0);
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
  }, []);

  useEffect(() => {
    fetchUsers(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleUpdateRole = async (profileId: string, newRole: string) => {
    console.log(`handleUpdateRole called with profileId: ${profileId}, newRole: ${newRole}`);

    const { data: updateData, error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId)
      .select();

    console.log("Supabase update response:", { updateData, error });

    if (error) {
      console.error("Error updating role:", error);
      toast.error(`Failed to update role: ${error.message}`);
    } else {
      console.log("Role updated successfully in Supabase. Updated data:", updateData);
      toast.success("User role updated.");
      fetchUsers(pagination.pageIndex, pagination.pageSize);
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
              currentUserId={currentUserId}
              rowCount={rowCount}
              pagination={pagination}
              onPaginationChange={setPagination}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default ManageUsers