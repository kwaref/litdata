import DatePickerField from '@/components/ui/Form/DatePickerField'
import {useReportFilters} from '@/components/utils/use-filters'
import {memo, useEffect, useState} from 'react'
import {useSurveyDataContext} from '../survey-data-context'
import {useTranslations} from 'next-intl'
import FiltersHeader from './filters-header'

// interface DateFilterProps {}

function DateFilter({header}: {header: string}) {
  const {handleDate, dateFilter} = useSurveyDataContext()
  const {path, setPath} = useReportFilters()
  const [fromDate, setFromDate] = useState<string | Date>(
    dateFilter?.startDate && path?.includes('edit') ? dateFilter.startDate : new Date(),
  )
  const [toDate, setToDate] = useState<string | Date | undefined>(
    dateFilter?.endDate && path?.includes('edit') ? dateFilter.endDate : '',
  )
  const commonT = useTranslations('Common')

  const onChangeFrom = (dates: Date[]) => {
    setFromDate(dates?.[0]?.toISOString())
  }

  const onChangeTo = (dates: Date[]) => {
    setToDate(dates?.[0]?.toISOString())
  }

  const handleCreate = () => {
    handleDate(fromDate, toDate)
    setPath('list')
    setFromDate('')
    setToDate('')
  }

  return (
    <>
      <FiltersHeader routeBack="add" onCreate={handleCreate} header={header} disabled={!fromDate} />
      <form className="pt-3 px-4 md:px-8">
        <div className="flex flex-col gap-4">
          <DatePickerField
            onChange={onChangeFrom}
            defaultDate={
              dateFilter?.startDate && path?.includes('edit') ? dateFilter.startDate : new Date()
            }
            // onReady={onChangeFrom}
            label={commonT('date-from')}
            align="right"
            required
            maxDate={toDate ?? new Date()}
          />
          <DatePickerField
            onChange={onChangeTo}
            defaultDate={
              dateFilter?.endDate && path?.includes('edit') ? dateFilter.endDate : undefined
            }
            // onReady={onChangeTo}
            label={commonT('date-to')}
            align="right"
            minDate={fromDate}
          />
        </div>
      </form>
    </>
  )
}

export default memo(DateFilter)
