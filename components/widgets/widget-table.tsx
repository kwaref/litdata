import {memo} from 'react'
import {cn} from '../utils/tailwindMerge'
import {type TableProps} from './types'

const Table = ({
  columns,
  rows,
  containerClass,
  tableClass,
  tableRowBodyProps,
  tableHeaderProps,
  tbodyClass,
}: TableProps) => (
  <div className={cn('w-full overflow-auto', containerClass)}>
    <table className={cn('w-full table-auto', tableClass)}>
      <thead className="">
        <tr {...tableHeaderProps} className={cn('h-6', tableHeaderProps?.className)}>
          {columns?.map(col => (
            <th
              key={col.headerName}
              {...col.headerCellProps}
              style={{
                width: `${col?.width}rem`,
                maxWidth: `${col?.width}rem`,
                minWidth: `${col?.width}rem`,
              }}
              className={cn(
                'text-primary-300 bg-[#E6E6EC] px-4 text-center first:text-left text-[10px] font-medium',
                col.headerCellProps?.className,
              )}
            >
              {col.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={cn(tbodyClass)}>
        {rows?.map((row, idx) => (
          <tr
            key={`tr-${idx}`}
            {...tableRowBodyProps}
            className={cn(
              'h-7 border-b border-border last:border-b-0',
              tableRowBodyProps?.className,
            )}
            onClick={() => tableRowBodyProps?.onClick(row)}
          >
            {columns?.map(col => (
              <td
                key={`td-${col.headerName as string}`}
                {...col.cellProps}
                style={{
                  width: `${col?.width}rem`,
                  maxWidth: `${col?.width}rem`,
                  minWidth: `${col?.width}rem`,
                }}
                className={cn(
                  'text-primary-900 px-1 text-center text-xs leading-[18px]',
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
    </table>
  </div>
)

export default memo(Table)
