import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const MyProfileProgressBookTable = ({ books = [], isLoading }) => {
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
        const book = info.row.original;
        return (
          <span
            style={{
              color: book.statusColor || "#6B7280",
              backgroundColor: `${book.statusColor || "#6B7280"}18` || "#F3F4F6",
              border: `1px solid ${book.statusColor || "#6B7280"}`,
            }}
            className="inline-flex px-2 py-0.5 rounded-[4px] text-xs font-[Inter-Regular] capitalize"
          >
            {book.status || "In Progress"}
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
    columnHelper.accessor("examinerAssignments", {
      header: "Examiners",
      cell: (info) => {
        const book = info.row.original;
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {book.examinerAssignments?.length || 0} examiner(s)
          </span>
        );
      },
    }),
    columnHelper.accessor("vivaHistory", {
      header: "Vivas",
      cell: (info) => {
        const book = info.row.original;
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {book.vivaHistory?.length || 0} viva(s)
          </span>
        );
      },
    }),
    columnHelper.accessor("averageExamMark", {
      header: "Average Mark",
      cell: (info) => {
        const book = info.row.original;
        return (
          <span className="text-sm font-[Inter-Regular] text-gray-900">
            {book.averageExamMark ? `${book.averageExamMark}%` : "Not graded"}
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: books,
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

export default MyProfileProgressBookTable;