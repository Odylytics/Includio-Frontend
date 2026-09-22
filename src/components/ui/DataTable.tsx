import { cn } from '@/lib/utils'

type Column<T> = {
  key: string
  header: string
  className?: string
  render: (row: T) => React.ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  empty?: React.ReactNode
}

export function DataTable<T>({ columns, rows, rowKey, empty }: Props<T>) {
  if (!rows.length && empty) return <>{empty}</>

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
        <thead className="bg-background text-[12.5px] uppercase tracking-wide text-ink-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn('px-4 py-3 font-semibold', c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-border">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-4 py-3.5 align-top', c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
