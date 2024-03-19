'use client'

import Dropdown, {type MenuProps} from '@/components/ui/Dropdown'
import {useReportFilters} from '@/components/utils/use-filters'
import {fixedFilters} from '@/utils/fixed-filters'
import {ChevronRightIcon, EllipsisHorizontalIcon} from '@heroicons/react/20/solid'
import {format} from 'date-fns'
import {useTranslations} from 'next-intl'
import {useEffect} from 'react'
import {useSurveyDataContext} from '../survey-data-context'
import DateFilter from './date-filter'
import FixedFilters from './fixed-filters'
import {CONFIRM_DELETE_FILTER_DIALOG} from '../ConfirmDeleteFilterDialog'
import {useDialog} from '@/components/utils/use-dialog'
import QuestionsFilter from './questions-filter'
import {AnyPtrRecord} from 'dns'
import {cn} from '@/components/utils/tailwindMerge'

const renderFilter = (
  key: string,
  label: string | undefined = '',
  type: string | undefined = '',
) => {
  switch (key) {
    case 'questions':
      return <QuestionsFilter header={label} />
    case 'date':
      return <DateFilter header={label} />
    default:
      return <FixedFilters header={label} type={type} />
  }
}

// interface FiltersProps {}
function Filters({canEdit}: {canEdit: boolean}) {
  const {path, setPath, resetPath} = useReportFilters()
  const {
    filterOptions,
    filters,
    resetFilters,
    dateFilter,
    handleDate,
    handleDeleteSingleFilter,
    editMode,
  } = useSurveyDataContext()
  const t = useTranslations('Report.Filters')

  const filterTypes: Array<{label: string; value: string}> = [
    {label: t('filter-by-questions'), value: 'questions'},
    {label: t('filter-by-date'), value: 'date'},
    {label: t('filter-by-age'), value: 'age'},
    {label: t('filter-by-gender'), value: 'gender'},
    {label: t('filter-by-income'), value: 'income'},
    {label: t('filter-by-under-18'), value: 'under-18'},
    {label: t('filter-by-marital-status'), value: 'marital-status'},
    {label: t('filter-by-location'), value: 'location'},
    {
      label: t('filter-by-political-affiliation'),
      value: 'political-affiliation',
    },
    {label: t('filter-by-region'), value: 'region'},
    {
      label: t('filter-by-government-assistance'),
      value: 'government-assistance',
    },
  ]

  useEffect(() => {
    return () => resetPath()
  }, [])

  const onDeleteFilter = () => {
    resetFilters()
  }

  const onDeleteSingleFilter = (filter: any) => {
    handleDeleteSingleFilter(filter.question_id)
  }

  return (
    <div className="text-primary-500 flex flex-col">
      {path === 'list' && (
        <ul className="px-4 md:px-8">
          <li
            className="mb-3 text-xs"
            // todo enable for edit filter view
            // onClick={() => setPath('edit')}
          >
            <p className="text-primary-200 font-medium">{t('span-title')}</p>{' '}
            {/* <TrashIcon className="h-5 w-5 cursor-pointer" onClick={() => onDeleteFilter()} /> */}
            {filters?.length === 0 && !dateFilter?.startDate && !dateFilter?.endDate && (
              <small className="font-semibold text-primary-500">{t('description')}</small>
            )}
          </li>

          {filters?.map(filter => {
            const fixedData = fixedFilters.find((el: any) => el?.questionId === filter.question_id)
            const questionData = filterOptions.find(
              // @ts-ignore
              el => (fixedData?.questionId || filter.question_id) === el.value,
            )
            return (
              <li
                key={filter.question_id}
                className="w-full justify-between flex items-center gap-4 border-b border-border py-2.5"
              >
                <span className="text-primary-500 line-clamp-2 text-sm">
                  {fixedData
                    ? questionData?.choices
                        ?.filter((choice: any) => filter?.choice_ids?.includes(choice?.value))
                        ?.map((c: any) => c.label)
                        ?.join(', ')
                    : questionData?.label}
                </span>
                {canEdit && (
                  <Menu
                    // @ts-ignore
                    filter={fixedData ? fixedData?.by : 'questions'}
                    data={filter.question_id}
                    handleDelete={() => onDeleteSingleFilter(filter)}
                  />
                )}
              </li>
            )
          })}
          {(dateFilter?.startDate || dateFilter?.endDate) && (
            <li
              key={'date-filter'}
              className="w-full flex flex-row gap-4 justify-between border-b border-border py-2.5"
            >
              <span className="text-primary-500 text-sm">
                {`${format(new Date(dateFilter.startDate), 'P')} - ${
                  dateFilter.endDate ? format(new Date(dateFilter.endDate), 'P') : 'Today'
                }`}
              </span>
              {canEdit && <Menu filter="date" handleDelete={handleDate} />}
            </li>
          )}
        </ul>
      )}
      {path === 'add' && (
        <ul className="px-4 md:px-8">
          {filterTypes.map(({label, value}) => {
            // @ts-ignore
            const fixedQuestion = fixedFilters.find(el => el.by === value)
            let question = null

            let questionsFilters = []
            if (filterOptions?.length > 0) {
              // @ts-ignore
              question = filterOptions.find(el => el.value === fixedQuestion?.questionId)

              questionsFilters = filterOptions?.map(q => {
                const {choices, ...question} = q
                return question
              })
              // @ts-ignore
              const exceptions = fixedFilters.map(el => el.questionId)
              questionsFilters = questionsFilters.filter(el => !exceptions.includes(el.value))
            }

            const active =
              (value === 'questions' ? questionsFilters?.length > 0 : !!question) ||
              (value === 'date' && filterOptions?.length > 0)
            return (
              <li
                key={value}
                className={cn(
                  'flex items-center justify-between gap-1 rounded-md p-2.5 text-primary-200 cursor-not-allowed',
                  {
                    'cursor-pointer hover:bg-primary-25 text-primary-500': active,
                  },
                )}
                onClick={() => active && setPath(`create/${value}`)}
              >
                <span className="text-sm">{label}</span>
                <div className="inline-flex w-5 items-center justify-end">
                  <ChevronRightIcon className="h-5 w-5" />
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {(path?.includes('create') || path?.includes('edit')) &&
        renderFilter(
          path?.split('/')?.[1],
          filterTypes.find(f => f.value === path?.split('/')?.[1])?.label,
          filterTypes.find(f => f.value === path?.split('/')?.[1])?.value,
        )}
    </div>
  )
}

function Menu({
  filter,
  handleDelete,
  data,
}: {
  data?: any
  filter: string
  handleDelete?: () => void
}) {
  const t = useTranslations('Report.Filters')
  const {setPath, setQuestion} = useReportFilters()
  const {openDialog: openDeleteDialog} = useDialog(CONFIRM_DELETE_FILTER_DIALOG)

  const onClick = () => {
    setPath(`edit/${filter}`)
    setQuestion(data)
  }

  const menu: MenuProps[] = [
    {label: t('edit'), onClick},
    {label: t('delete'), onClick: () => openDeleteDialog({handleDelete})},
  ]

  return (
    <Dropdown
      disabled={false}
      menu={menu}
      classNames={{
        trigger:
          'bg-transparent p-0 hover:text-primary-500 text-primary-500 hover:bg-transparent shadow-none',
        panel: 'right-0 left-auto !w-[160px]',
      }}
    >
      <EllipsisHorizontalIcon className="h-5 w-5" />
    </Dropdown>
  )
}

export default Filters
