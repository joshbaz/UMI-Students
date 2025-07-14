import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const MyProfileProgressProposalTable = ({ proposals = [], isLoading }) => {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <span className="text-sm font-[Inter-Regular] text-gray-900">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const proposal = info.row.original;
        return (
          <span
            style={{
              color: proposal.statusColor || "#6B7280",
              backgroundColor: `${proposal.statusColor || "#6B7280"}18` || "#F3F4F6",
              border: `1px solid ${proposal.statusColor || "#6B7280"}`,
            }}
            className="inline-flex px-2 py-0.5 rounded-[4px] text-xs font-[Inter-Regular] capitalize"
          >
            {proposal.status || "Pending"}
          </span>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Submitted Date",
      cell: (info) => (
        <span className="text-sm font-[Inter-Regular] text-gray-900">
          {info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "Not available"}
        </span>
      ),
    }),
    columnHelper.accessor("mainSupervisor", {
      header: "Main Supervisor",
      cell: (info) => {
        const proposal = info.row.original;
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {proposal.mainSupervisor 
              ? `${proposal.mainSupervisor.firstName} ${proposal.mainSupervisor.lastName}` 
              : "Not assigned"}
          </span>
        );
      },
    }),
    columnHelper.accessor("coSupervisor", {
      header: "Co-Supervisor",
      cell: (info) => {
        const proposal = info.row.original;
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {proposal.coSupervisor 
              ? `${proposal.coSupervisor.firstName} ${proposal.coSupervisor.lastName}` 
              : "Not assigned"}
          </span>
        );
      },
    }),
    columnHelper.accessor("defenses", {
      header: "Defenses",
      cell: (info) => {
        const proposal = info.row.original;
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {proposal.defenses?.length || 0} defense(s)
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: proposals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left py-3 px-3 text-sm font-[Inter-Medium] text-gray-500 border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-2 px-3 text-sm font-[Inter-Regular] text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyProfileProgressProposalTable;