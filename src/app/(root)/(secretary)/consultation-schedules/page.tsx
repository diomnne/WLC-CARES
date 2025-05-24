"use client";

import Sidebar from "@/app/components/sidebars/secretary-sidebar";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

const supabase = createClient();

type Consultation = {
  consultation_id: string;
  student_id: string;
  preferred_date: string;
  reason: string;
  additional_notes: string | null;
  status: string;
  created_at: string;
  name: string;
};

const ConsultationSchedules = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  const fetchAllConsultations = async (currentPage: number, pageSize: number) => {
    setLoading(true);
    const from = currentPage * pageSize;
    const to = from + pageSize - 1;

    console.log(`Fetching consultations: page ${currentPage}, size ${pageSize}, range ${from}-${to}`);

    const { data, error, count } = await supabase
      .from("consultation_details_view")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
      setRowCount(0);
    } else {
      setConsultations((data ?? []) as Consultation[]);
      setRowCount(count ?? 0);
      if (!data || data.length === 0) {
        console.warn("Fetch for consultations was successful but returned 0 records for this page.");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllConsultations(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns: ColumnDef<Consultation>[] = [
    {
      accessorKey: "name",
      header: "Student Name",
    },
    {
      accessorKey: "preferred_date",
      header: "Preferred Date",
      cell: ({ row }) => new Date(row.original.preferred_date).toLocaleDateString(),
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "additional_notes",
      header: "Additional Notes",
      cell: ({ row }) => row.original.additional_notes || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`font-semibold ${
          row.original.status === 'Pending' ? 'text-yellow-600' :
          row.original.status === 'Approved' ? 'text-green-600' :
          row.original.status === 'Completed' ? 'text-blue-600' :
          row.original.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'
        }`}>{row.original.status}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Requested At",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
  ];

  const table = useReactTable({
    data: consultations,
    columns,
    rowCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 flex flex-col overflow-hidden">
          <h1 className="text-xl pt-4 font-bold text-gray-800 mb-6 shrink-0">Consultation Schedules</h1>

          <div className="rounded-md border overflow-auto flex-grow">
            <Table>
              <TableHeader className="bg-gray-100 sticky top-0 z-10">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24">
                      Loading schedules...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="whitespace-normal break-words">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24">
                      No consultation schedules found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4 shrink-0">
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
        </main>
      </div>
    </div>
  );
};

export default ConsultationSchedules;
