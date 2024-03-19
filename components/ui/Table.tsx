import {memo} from 'react'

import {cn} from '../utils/tailwindMerge'

export type ColumnsProps = {
  id?: string
  accessor: string | ((row: any, idx: number, rows: any[]) => void)
  width?: number
  headerName?: string
  cellProps?: Record<string, any>
  headerCellProps?: Record<string, any>
}

type TableProps = {
  columns: ColumnsProps[]
  rows: any[]
  containerClass?: string
  tbodyClass?: string
  tableClass?: string
  tableRowBodyProps?: any
  tableHeaderProps?: any
  scrollReveal?: boolean
  footer?: any
}

const Table = ({
  columns,
  rows,
  containerClass,
  tableClass,
  tableRowBodyProps,
  tableHeaderProps,
  tbodyClass,
  footer,
}: TableProps) => (
  <div className={cn('w-full overflow-auto', containerClass)}>
    <table className={cn('mb-4 w-full table-auto', tableClass)}>
      <thead className="py-3">
        <tr {...tableHeaderProps} className={cn('', tableHeaderProps?.className)}>
          {columns.map(col => (
            <th
              key={col.headerName}
              {...col.headerCellProps}
              style={{
                width: `${col?.width}rem`,
                maxWidth: `${col?.width}rem`,
                minWidth: `${col?.width}rem`,
              }}
              className={cn(
                'text-primary-300 bg-[#EAEAEC] px-3 py-1.5 text-left text-[10px] font-medium',
                col.headerCellProps?.className,
              )}
            >
              {col.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={cn(tbodyClass)}>
        {rows.map((row, idx) => (
          <tr
            key={`tr-${idx}`}
            {...tableRowBodyProps}
            className={cn('', tableRowBodyProps?.className)}
            onClick={() => tableRowBodyProps?.onClick(row)}
          >
            {columns.map(col => (
              <td
                key={`td-${col.headerName as string}`}
                {...col.cellProps}
                style={{
                  width: `${col?.width}rem`,
                  maxWidth: `${col?.width}rem`,
                  minWidth: `${col?.width}rem`,
                }}
                className={cn(
                  'text-primary-400 border-b border-border px-3 py-4 text-left text-sm',
                  col.cellProps?.className,
                )}
              >
                {typeof col.accessor === 'function'
                  ? col.accessor(row, idx, rows)
                  : row?.[col?.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>{footer}</tr>
      </tfoot>
    </table>
  </div>
)

export default memo(Table)
