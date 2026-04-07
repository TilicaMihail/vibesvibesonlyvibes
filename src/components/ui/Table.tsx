import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
}

const SKELETON_ROWS = 5

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available.',
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-surface-border shadow-sm">
      <table className="min-w-full divide-y divide-surface-border">
        <thead className="bg-surface">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-on-surface-faint sticky top-0 bg-surface"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-surface-border bg-surface-raised">
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
              <tr key={rowIdx} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 rounded bg-surface-border" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-on-surface-faint"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-surface border-b border-surface-border">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-on-surface">
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
