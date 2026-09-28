import React from "react";

export type TableColumn<T> = {
  key?: string;
  title: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
  accessor?: keyof T | ((item: T) => React.ReactNode | string | number | null | undefined);
};

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
  loading?: boolean;
  loadingText?: string;
  emptyState?: React.ReactNode;
}

export default function Table<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  rowClassName,
  loading = false,
  loadingText = "Loading...",
  emptyState,
}: TableProps<T>) {
  const renderCell = (row: T, column: TableColumn<T>) => {
    if (column.render) return column.render(row);

    if (column.accessor) {
      const value =
        typeof column.accessor === "function" ? column.accessor(row) : (row as Record<string, unknown>)[column.accessor as string];
      return (value as React.ReactNode) ?? "—";
    }

    if (column.key) {
      const value = (row as Record<string, unknown>)[column.key];
      return (value as React.ReactNode) ?? "—";
    }

    return "—";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
            {columns.map((col) => (
              <th key={col.key ?? col.title} className={col.className ?? "py-3 px-5"}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-400">
                {loadingText}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                {emptyState ?? "No records found."}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = rowKey(row, index);
              const classes = rowClassName ? rowClassName(row) : "transition-colors hover:bg-slate-50";

              return (
                <tr
                  key={String(key)}
                  onClick={() => onRowClick?.(row)}
                  className={`${classes} ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((column) => (
                    <td key={`${String(key)}-${column.key ?? column.title}`} className={column.className ?? "py-3.5 px-5"}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
