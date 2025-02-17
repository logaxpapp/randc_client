// src/components/ui/DataTable.tsx

import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import clsx from 'clsx';

// 1. Define and export the Column interface
export interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: number; // Width of each column in pixels
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowHeight?: number; // Height of each row in pixels
  height?: number;    // Height of the table in pixels
  width?: number;    // Width of the table in pixels
  
}

function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  rowHeight = 50,
  height = 500,
}: DataTableProps<T>) {
  // 2. Define the Row component for react-window
  const Row = ({ index, style }: ListChildComponentProps) => {
    const row = data[index];
    return (
      <div
        style={style}
        className={clsx(
          'flex border-b',
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        )}
      >
        {columns.map((col) => (
          <div
            key={String(col.accessor)}
            className="flex-1 px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {col.render ? col.render(row) : String(row[col.accessor])}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {/* 3. Table Header */}
      <div className="flex bg-gray-200">
        {columns.map((col) => (
          <div
            key={String(col.accessor)}
            className={clsx(
              'flex-1 px-4 py-2 font-semibold text-left cursor-pointer select-none',
              col.sortable ? 'hover:bg-gray-300' : ''
            )}
          >
            {col.header}
            {col.sortable && <span className="ml-2 text-gray-500">🔽</span>}
          </div>
        ))}
      </div>

      {/* 4. Virtualized Rows */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}

export default DataTable;
