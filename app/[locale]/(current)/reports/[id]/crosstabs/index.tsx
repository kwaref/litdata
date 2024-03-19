'use client'

import Button from '@/components/ui/ButtonCVA'
import Dropdown, {type MenuProps} from '@/components/ui/Dropdown'
import {AutocompleteInputField} from '@/components/ui/Form'
import DatePickerField from '@/components/ui/Form/DatePickerField'
import {useDialog} from '@/components/utils/use-dialog'
import {useReportFilters} from '@/components/utils/use-filters'
import {EllipsisHorizontalIcon} from '@heroicons/react/20/solid'
import {TrashIcon} from '@heroicons/react/24/outline'
import {format} from 'date-fns'
import {useTranslations} from 'next-intl'
import {useEffect, useMemo, useState} from 'react'
import {toast} from 'react-toastify'
import {CONFIRM_DELETE_FILTER_DIALOG} from '../ConfirmDeleteFilterDialog'
import CrosstabsHeader from '../filters/filters-header'
import {useSurveyDataContext} from '../survey-data-context'

const allQuestions = {label: 'All questions', value: 'all'}

function Corsstabs({canEdit, editMode = false}: {canEdit: boolean; editMode?: boolean}) {
  const {path, setPath} = useReportFilters()

  const {
    filterOptions,
    setCrosses,
    crossesData: crosses,
    handleDeleteCrosses,
    handleDate,
    loadingCrosses,
  } = useSurveyDataContext()
  const [fromDate, setFromDate] = useState<string | Date>(crosses?.[0]?.startDate ?? new Date())
  const [toDate, setToDate] = useState<string | Date>(crosses?.[0]?.endDate ?? '')
  const [formData, setFormData] = useState<{
    rows: string[]
    columns: string[]
    isAllRows: boolean
    isAllColumns: boolean
  }>({
    rows: [],
    columns: [],
    isAllRows: false,
    isAllColumns: false,
  })
  const t = useTranslations('Report.Crosstab')
  const commonT = useTranslations('Common')

  const isAllRows = useMemo(
    () =>
      crosses?.[0]?.questionY?.length === filterOptions?.length ||
      crosses?.[0]?.questionY?.length === filterOptions?.length - 1,
    [crosses, filterOptions?.length],
  )

  const isAllColumns = useMemo(
    () =>
      crosses?.[0]?.questionX?.length === filterOptions?.length ||
      crosses?.[0]?.questionX?.length === filterOptions?.length - 1,
    [crosses, filterOptions?.length],
  )

  useEffect(() => {
    path === 'edit' &&
      setFormData({
        rows: crosses?.[0]?.questionY || [],
        columns: crosses?.[0]?.questionX || [],
        isAllRows,
        isAllColumns,
      })
  }, [crosses, isAllColumns, isAllRows, path])

  const onChangeFrom = (dates: Date[]) => {
    setFromDate(dates?.[0]?.toUTCString())
  }

  const onChangeTo = (dates: Date[]) => {
    setToDate(dates?.[0]?.toUTCString())
  }

  const handleRows = (value: any) => {
    if (value === 'all') {
      if (!formData.isAllRows) {
        setFormData({
          ...formData,
          rows: ['all'],
          isAllRows: true,
          isAllColumns: false,
          columns: [],
        })
      }
    } else {
      if (formData.isAllRows) {
        setFormData({
          ...formData,
          isAllRows: false,
          isAllColumns: false,
          rows: [value],
          ...(formData?.columns?.length === 1 &&
            !formData?.columns?.includes('all') && {
              columns: formData?.columns?.filter(col => col !== value),
            }),
        })
      } else {
        setFormData({
          ...formData,
          rows: [...formData.rows, value],
        })
      }
    }
  }

  const handleColumns = (value: any) => {
    if (value === 'all') {
      if (!formData.isAllColumns) {
        setFormData({
          ...formData,
          columns: ['all'],
          isAllRows: false,
          isAllColumns: true,
          rows: [],
        })
      }
    } else {
      if (formData.isAllColumns) {
        setFormData({
          ...formData,
          isAllRows: false,
          isAllColumns: false,
          columns: [value],
          ...(formData?.rows?.length === 1 &&
            !formData?.rows?.includes('all') && {
              rows: formData?.rows?.filter(row => row !== value),
            }),
        })
      } else {
        setFormData({
          ...formData,
          columns: [...formData.columns, value],
        })
      }
    }
  }

  const handleMultiRows = (value: any, i: number) => {
    // console.log(`change row item with value -> ${value} and index -> ${i}`)
    const newRows = [...formData.rows]
    newRows[i] = value
    setFormData({
      ...formData,
      rows: newRows,
    })
  }

  const handleMultiColumns = (value: any, i: number) => {
    // console.log(`change column item with value -> ${value} and index -> ${i}`)
    const newColumns = [...formData.columns]
    newColumns[i] = value
    setFormData({
      ...formData,
      columns: newColumns,
    })
  }

  const removeRow = (value: any) => {
    setFormData({
      ...formData,
      rows: formData.rows.filter((row: any) => row !== value),
    })
  }

  const removeColumn = (value: any) => {
    setFormData({
      ...formData,
      columns: formData.columns.filter((col: any) => col !== value),
    })
  }

  // THIS NEEDS TO BE FIXED
  const handleCreate = () => {
    if (!formData.rows[0] || !formData.columns[0]) {
      toast.error(t(`toast-error`))
      return
    }

    // handleDate(fromDate, '')
    setCrosses([
      {
        startDate: fromDate,
        endDate: toDate,
        questionY: formData.isAllRows
          ? filterOptions?.map(f => f.value).filter(el => el !== formData.columns[0])
          : formData.rows,
        questionX: formData.isAllColumns
          ? filterOptions?.map(f => f.value).filter(el => el !== formData.rows[0])
          : formData.columns,
      },
    ])

    setPath('list')
  }

  const onDeleteCrosses = () => {
    handleDeleteCrosses()
    setFormData({
      rows: [],
      columns: [],
      isAllRows: false,
      isAllColumns: false,
    })
  }

  return (
    <div className="flex flex-col text-primary-500 mb-4">
      {path === 'list' && (
        <>
          <ul className="px-4 md:px-8">
            <li
              className="mb-3 text-xs"
              // todo enable for edit filter view
              // onClick={() => setPath('edit')}
            >
              <p className="text-primary-200  font-medium">{t('sidebar-title')}</p>{' '}
              {/* <TrashIcon className="h-5 w-5 cursor-pointer" onClick={() => onDeleteFilter()} /> */}
              {!crosses && (
                <small className="font-semibold text-primary-500">{t('description')}</small>
              )}
            </li>
            {crosses?.length > 0 && (
              <li className="w-full justify-between flex items-center gap-4 border-b border-border py-2.5">
                <span className="truncate">
                  {`${
                    crosses[0]?.startDate ? format(new Date(crosses[0]?.startDate), 'P') : 'Today'
                  } - ${
                    crosses[0]?.endDate &&
                    format(new Date(crosses[0]?.endDate), 'P') !== format(new Date(), 'P')
                      ? format(new Date(crosses[0]?.endDate), 'P')
                      : 'Today'
                  }`}
                </span>

                {canEdit && <Menu handleDelete={onDeleteCrosses} />}
              </li>
            )}
          </ul>
        </>
      )}
      {(path === 'create' || path === 'edit') && (
        <>
          <CrosstabsHeader
            routeBack="list"
            onCreate={handleCreate}
            header={t('span-selectDates')}
            loading={loadingCrosses}
            disabled={loadingCrosses}
          />
          <ul className="px-4 md:px-8">
            <li>
              <div className="flex flex-col gap-4">
                {((path.includes('edit') && crosses?.[0]?.startDate) ||
                  path.includes('create')) && (
                  <DatePickerField
                    onChange={onChangeFrom}
                    defaultDate={crosses?.[0]?.startDate ?? new Date()}
                    // onReady={onChangeFrom}
                    label={commonT('date-from')}
                    required
                    maxDate={toDate ?? new Date()}
                  />
                )}
                {(!editMode ||
                  (path.includes('edit') && crosses?.[0]?.endDate && editMode) ||
                  path.includes('create')) && (
                  <DatePickerField
                    onChange={onChangeTo}
                    defaultDate={crosses?.[0]?.endDate ?? undefined}
                    // onReady={onChangeTo}
                    label={commonT('date-to')}
                    minDate={fromDate ?? new Date()}
                  />
                )}
              </div>
              <hr className="my-5 border-b border-border" />
            </li>
            <li>
              <p className="mb-1 text-xs font-medium text-primary-200">{t('rows')} (MAX. 10)</p>

              <p className="my-3 text-xs">
                Select All questions vs. 1 or select Questions vs. Questions
              </p>

              {/* ROWS */}
              <AutocompleteInputField
                fixed={false}
                name="row"
                disabled={formData?.isAllColumns && formData?.rows?.length === 1}
                onChange={handleRows}
                items={[allQuestions, ...filterOptions].filter(
                  el =>
                    formData.isAllColumns ||
                    formData.isAllRows ||
                    (!formData?.columns?.includes(el.value) && !formData.rows?.includes(el.value)),
                )}
                value={formData.isAllRows ? 'all' : formData.isAllRows ? formData.rows[0] : ''}
                label="Select one question"
                placeholder={commonT('search-select')}
              />
              {formData.isAllRows && (
                <p className="my-3 text-xs">
                  You can not add more questions if you select All questions in the X axis.
                </p>
              )}
              {!formData.isAllRows && formData.rows?.length >= 1 && (
                <ul>
                  {formData.rows?.map((row, i) => (
                    <li key={row} className="mt-2 flex gap-2 items-end">
                      <AutocompleteInputField
                        fixed={false}
                        name="row"
                        onChange={(value: any) => handleMultiRows(value, i)}
                        items={filterOptions.filter(
                          el => isAllColumns || !formData?.columns?.includes(el.value),
                        )}
                        value={row}
                        label="Select one question"
                        placeholder={commonT('search-select')}
                      />
                      <Button
                        color="inherit"
                        className="h-10 bg-transparent hover:bg-transparent border-none p-0 shadow-none"
                        isIconOnly
                        onClick={() => removeRow(row)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <hr className="my-5 border-b border-border" />
            </li>

            {/* COLUMNS */}
            <li>
              <p className="mb-1 text-xs font-medium text-primary-200">{t('columns')} (MAX. 10)</p>
              <AutocompleteInputField
                fixed={false}
                name="column"
                disabled={formData.isAllRows && formData?.columns?.length === 1}
                onChange={handleColumns}
                items={[allQuestions, ...filterOptions].filter(
                  el =>
                    formData.isAllColumns ||
                    formData.isAllRows ||
                    (!formData?.columns?.includes(el.value) && !formData.rows?.includes(el.value)),
                )}
                value={
                  formData.isAllColumns ? 'all' : formData.isAllColumns ? formData.columns[0] : ''
                }
                label="Select one question"
                placeholder={commonT('search-select')}
              />

              {!formData.isAllColumns && formData.columns?.length >= 1 && (
                <ul>
                  {formData.columns?.map((column, i) => (
                    <li key={column} className="mt-2 flex gap-2 items-end">
                      <AutocompleteInputField
                        fixed={false}
                        name="column"
                        onChange={(value: any) => handleMultiColumns(value, i)}
                        value={column}
                        items={filterOptions.filter(
                          el => formData?.isAllRows || !formData.rows?.includes(el.value),
                        )}
                        label="Select one question"
                        placeholder={commonT('search-select')}
                      />
                      <Button
                        color="inherit"
                        className="h-10 bg-transparent hover:bg-transparent border-none p-0 shadow-none"
                        isIconOnly
                        onClick={() => removeColumn(column)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </>
      )}
    </div>
  )
}

function Menu({handleDelete}: {handleDelete?: () => void}) {
  const t = useTranslations('Common')
  const {setPath} = useReportFilters()
  const {openDialog: openDeleteDialog} = useDialog(CONFIRM_DELETE_FILTER_DIALOG)

  const menu: MenuProps[] = [
    {label: t('edit'), onClick: () => setPath('edit')},
    {label: t('delete'), onClick: () => openDeleteDialog({handleDelete})},
  ]

  return (
    <Dropdown
      menu={menu}
      disabled={false}
      classNames={{
        trigger:
          'bg-transparent p-0 hover:text-primary-500 text-primary-500 hover:bg-transparent shadow-none',
        panel: 'right-0 left-auto !w-[160px]',
      }}
    >
      <EllipsisHorizontalIcon className="h-4 w-4" />
    </Dropdown>
  )
}

export default Corsstabs
