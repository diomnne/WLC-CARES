"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { logActivity } from "@/utils/supabase/logger";
import React from "react";
import { ChevronDown } from "lucide-react";

const supabase = createClient();

const USER_ROLES = ["Admin", "Student", "Staff", "User"];

export type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
  user_id: string;
};

interface UserTableProps {
  data: User[];
  onUpdateRole: (profileId: string, newRole: string) => Promise<void>;
  onToggleStatus: (profileId: string, currentIsActive: boolean, authUserId: string) => Promise<void>;
  currentUserId: string | null;
}

export function UserTable({ data, onUpdateRole, onToggleStatus, currentUserId }: UserTableProps) {
  const handleRoleChange = async (profileId: string, newRole: string) => {
    if (!currentUserId) {
      toast.error("Admin user ID not found. Cannot log activity.");
      return;
    }
    try {
      await onUpdateRole(profileId, newRole);
      toast.success(`User role updated to ${newRole}.`);
      await logActivity({ userId: currentUserId, action: `Changed role of user ${profileId} to ${newRole}` });
    } catch (error) {
      toast.error("Failed to update role.");
      console.error("Role update error:", error);
    }
  };

  const handleStatusToggle = async (profileId: string, isActive: boolean, authUserId: string) => {
    if (!currentUserId) {
      toast.error("Admin user ID not found. Cannot log activity.");
      return;
    }
    try {
      await onToggleStatus(profileId, isActive, authUserId);
      toast.success(`User account ${isActive ? "deactivated" : "activated"}.`);
      await logActivity({ userId: currentUserId, action: `User ${profileId} account ${isActive ? "deactivated" : "activated"}` });
    } catch (error) {
      toast.error("Failed to update account status.");
      console.error("Status toggle error:", error);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "avatar_url",
      header: "",
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.avatar_url || ""}
            alt={row.original.full_name}
          />
          <AvatarFallback>
            {row.original.full_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "full_name",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-[120px] justify-between"
            >
              {row.original.role}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[120px]">
            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {USER_ROLES.map((role) => (
              <DropdownMenuItem
                key={role}
                onSelect={() => handleRoleChange(row.original.id, role)}
                disabled={role === row.original.role} 
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (row.original.is_active ? "Active" : "Inactive"),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant={row.original.is_active ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleStatusToggle(row.original.id, row.original.is_active, row.original.user_id)}
        >
          {row.original.is_active ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100 text-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-normal break-words">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
