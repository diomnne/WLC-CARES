"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
  OnChangeFn,
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

const USER_ROLES = ["Admin", "Student", "Doctor", "Nurse", "Secretary"];

export type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  user_id: string;
};

interface UserTableProps {
  data: User[];
  onUpdateRole: (profileId: string, newRole: string) => Promise<void>;
  currentUserId: string | null;
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export function UserTable({ 
  data, 
  onUpdateRole, 
  currentUserId, 
  rowCount, 
  pagination, 
  onPaginationChange 
}: UserTableProps) {
  const handleRoleChange = async (profileId: string, newRole: string) => {
    if (!currentUserId) {
      toast.error("Admin user ID not found. Cannot log activity.");
      return;
    }
    try {
      await onUpdateRole(profileId, newRole);
      toast.success(`User role updated to ${newRole}.`);
      await logActivity({ userId: currentUserId, action: `Changed user role` });
    } catch (error) {
      toast.error("Failed to update role.");
      console.error("Role update error:", error);
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
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount,
    state: {
      pagination,
    },
    onPaginationChange,
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
