import {Fragment, memo} from 'react'
import ReportQuestion from './report-question'
import {type Question} from '@/types_db'
import LitLogo from '@/components/icons/LitLogo'
import {pdfStore} from '@/components/ui/PrintPDF'
import {reportStore} from '@/components/utils/use-reports'
import {useTranslations} from 'next-intl'
import {useSurveyDataContext} from '../../survey-data-context'
import {fixedFilters} from '@/utils/fixed-filters'
import {format} from 'date-fns'

// interface ExportToPdfProps {
//   trend: any
// }

function ExportToPdf() {
  const data = reportStore(state => {
    if (process.env.NODE_ENV === 'development') {
      return state.exportData.slice(0, 20)
    }
    return state.exportData
  })
  const documentTitle = pdfStore(state => state.documentTitle)
  const t = useTranslations('Report.Filters')
  const {filterOptions, filters, dateFilter} = useSurveyDataContext()

  return (
    <>
      {data?.map(({id, description, answered, answers, ...rest}: any, i: number) => (
        <Fragment key={id}>
          <header className="h-14">
            <div className="mt-5 flex h-full items-center justify-between px-6">
              <LitLogo />
              <h1 className="font-medium">{documentTitle}</h1>
              <div />
            </div>
          </header>
          <article className="text-primary-500 mt-12 flex w-full flex-col gap-8 bg-background p-6">
            <h2
              className="text-center text-2xl font-bold"
              dangerouslySetInnerHTML={{
                __html: `Q${i + 1}. ${description}`,
              }}
            />

            <ul className="py-8 mt-4">
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
                const fixedData = fixedFilters.find(
                  (el: any) => el?.questionId === filter.question_id,
                )
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
                </li>
              )}
            </ul>

            <div className="flex w-full justify-center gap-5 ">
              <p className="text-sm">
                {t('answered')} <span className="font-semibold"> {answered ?? 0}</span>
              </p>
              <p className="text-sm">
                {t('skipped')} <span className="font-semibold"> {0}</span>
              </p>
            </div>
            <ReportQuestion data={{answers, total: answered, id, ...rest}} isExport />
          </article>

          {i < data?.length - 1 && <div className="page-break" />}
        </Fragment>
      ))}
    </>
  )
}

export default memo(ExportToPdf)
