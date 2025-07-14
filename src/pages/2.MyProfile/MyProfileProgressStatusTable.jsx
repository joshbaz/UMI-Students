import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const MyProfileProgressStatusTable = ({ statuses = [], isLoading }) => {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("definition.name", {
      header: "Status",
      cell: (info) => {
        const status = info.row.original;
        return (
          <span
            style={{
              color: status.definition?.color || "#6B7280",
              backgroundColor: `${status.definition?.color}18` || "#F3F4F6",
              border: `1px solid ${status.definition?.color || "#6B7280"}`,
            }}
            className="inline-flex px-2 py-0.5 rounded-[4px] text-xs font-[Inter-Regular] capitalize"
          >
            {status.definition?.name || "Unknown"}
          </span>
        );
      },
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      cell: (info) => {
        const startDate = new Date(info.getValue());
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {startDate.toLocaleDateString()}
          </span>
        );
      },
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: (info) => {
        const status = info.row.original;
        const statusIndex = statuses.findIndex(s => s.id === status.id);
        const endDate = statusIndex < statuses.length - 1
          ? new Date(statuses[statusIndex + 1].startDate)
          : new Date();
        
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {statusIndex < statuses.length - 1
              ? endDate.toLocaleDateString()
              : "Present"}
          </span>
        );
      },
    }),
    columnHelper.accessor("duration", {
      header: "Duration",
      cell: (info) => {
        const status = info.row.original;
        const statusIndex = statuses.findIndex(s => s.id === status.id);
        const startDate = new Date(status.startDate);
        const endDate = statusIndex < statuses.length - 1
          ? new Date(statuses[statusIndex + 1].startDate)
          : new Date();
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {duration} days
          </span>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.row.original;
        const statusIndex = statuses.findIndex(s => s.id === status.id);
        const startDate = new Date(status.startDate);
        const endDate = statusIndex < statuses.length - 1
          ? new Date(statuses[statusIndex + 1].startDate)
          : new Date();
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const isOverdue = status.definition?.expectedDuration && duration > status.definition.expectedDuration;
        
        return (
          <span className={`text-sm font-[Inter-Regular] ${isOverdue ? 'text-red-500' : 'text-green-500'}`}>
            {isOverdue 
              ? `Overdue by ${duration - status.definition.expectedDuration} days`
              : "On track"
            }
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: statuses,
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

export default MyProfileProgressStatusTable; 