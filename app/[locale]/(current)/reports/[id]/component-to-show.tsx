import ReportQuestion from './pdf/export-to-pdf/report-question'
import {getTotal, reportStore} from '@/components/utils/use-reports'
import {useTranslations} from 'next-intl'
import {
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import {SelectField} from '@/components/ui/Form'
import Button, {LoadingIcon} from '@/components/ui/ButtonCVA'
import {useSupabase} from '@/app/supabase-provider'
import useUserDetails from '@/utils/useUserDetails'
import toastAlert from '@/utils/toastAlert'
import {getAppliedFilters} from '@/utils/widgets-filters'
import {fixedFilters} from '@/utils/fixed-filters'
import {useSurveyDataContext} from './survey-data-context'
import {handleTrend} from '@/utils/trends/handleTrends'
import {useEffect, useLayoutEffect, useState} from 'react'
import {filtrarDatos} from '@/components/widgets/chart-options'
import WidgetLimitDialog, {WIDGET_LIMIT_DIALOG} from './widget-limit-notification'
import {useDialog} from '@/components/utils/use-dialog'
import InfiniteScroll from 'react-infinite-scroll-component'
import {InfiniteScroller} from 'better-react-infinite-scroll'
import {filtersStore} from '@/components/utils/use-filters'
import {cn} from '@/components/utils/tailwindMerge'
import {faker} from '@faker-js/faker'

const trendList = [
  {label: 'No trends', value: 1},
  {label: 'Daily', value: 2},
  {label: 'Weekly', value: 3},
  {label: 'Bi-weekly', value: 4},
  {label: 'Monthly', value: 5},
  {label: 'Quaterly', value: 6},
  {label: 'Yearly', value: 7},
]

function ComponentToShow() {
  const [items, setItems] = useState<any[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const data = reportStore(state => state.exportData)
  const setExportTrend = reportStore(state => state.setExportTrendData)
  const trendData = reportStore(state => state.exportTrendData)
  const t = useTranslations('Report.Filters')
  const {supabase} = useSupabase()
  const {userDetails} = useUserDetails()
  const {filters, filterOptions, dateFilter, trend, setTrend, widgetsCount, setWidgetsCount} =
    useSurveyDataContext()
  const {openDialog} = useDialog(WIDGET_LIMIT_DIALOG)

  useEffect(() => {
    setItems(data?.slice(0, 5))
  }, [data, trend])

  useEffect(() => {
    let response = {}
    if (trend > 1 && trendData?.length > 0) {
      data.forEach(({id}: any) => {
        response = {
          ...response,
          [id]: trendData?.map((el: any) => ({
            ...el,
            questions: el?.questions
              ?.filter((q: any) => q?.id === id)
              ?.map(({answers, type, maxAnswers, ...quest}: any) => {
                return {
                  ...quest,
                  type,
                  maxAnswers,
                  answers: {
                    ...answers,
                    choices: answers?.choices?.map((choice: any, idx: number) => ({
                      ...choice,
                      color: colors[idx] ?? faker.color.rgb({format: 'css'}),
                      percent: Math.floor(
                        (type === 'single_choice' ? choice?.count * 100 : getTotal({answers})) /
                          maxAnswers,
                      ),
                    })),
                  },
                }
              }),
          })),
        }
        // @ts-ignore
      })
      setExportTrend(response)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, trendData, trend])

  useEffect(() => {
    if (items?.length >= data?.length) {
      setHasMore(false)
    }
  }, [items, data])

  const fetchMoreData = () => {
    setItems(prev => [...prev, ...data?.slice(prev?.length, prev?.length + 5)])
  }

  const handleAddToDashboard = async (widget: any) => {
    if (widgetsCount > 5) {
      openDialog()
    } else {
      const data =
        trend === 1
          ? {
              description: widget?.description,
              filters: widget?.filters,
              type: trendList[trend - 1]?.label,
              answers: widget?.answers,
            }
          : {
              description: widget?.description,
              filters: widget?.filters,
              type: trendList[trend - 1]?.label,
              answers: filtrarDatos(trendData[widget?.questionId]),
            }

      let error = null
      const {error: errorResponse} = await supabase.from('widgets').insert({
        associated_user: userDetails?.id,
        widget_data: data,
      })
      error = errorResponse
      if (error) {
        toastAlert({message: error.message, type: 'error'})
      } else {
        toastAlert({
          message: 'Question successfully added to dashboard as a widget',
          type: 'success',
        })
        setWidgetsCount(widgetsCount + 1)
      }
    }
  }

  return (
    <>
      {data?.length > 0 && (
        <InfiniteScroller
          fetchNextPage={fetchMoreData}
          hasNextPage={hasMore}
          loadingMessage={
            <div className="w-full flex justify-center items-center">
              <LoadingIcon classNames={{icon: 'w-8 h-8 mt-5'}} />
            </div>
          }
          endingMessage={null}
        >
          <div className="relative flex flex-col w-full gap-5 text-primary-500">
            <div className="inline-flex justify-end w-full">
              <WidgetLimitDialog />
              <SelectField
                className="xs:max-w-[250px] "
                classNames={{
                  input: 'bg-white',
                  option: 'not-last-child:border-b border-border',
                }}
                variant="outlined"
                label="Trend by ..."
                items={trendList}
                value={trend}
                onChange={setTrend}
              />
            </div>
            {items?.map(
              (
                {
                  id,
                  description,
                  answered,
                  skipped,
                  maxAnswers,
                  answers,
                  type,
                  stats,
                  ...rest
                }: any,
                i: number,
              ) => (
                <div
                  key={id}
                  style={{borderColor: borderColors[i]}}
                  className="flex flex-col w-full gap-2 px-6 py-8 border-t-4 bg-background"
                >
                  <div className="flex items-start justify-between w-full gap-3 mb-4">
                    <h2
                      className="text-primary-500 text-xl leading-7 md:leading-[30px] md:text-[26px] font-degular tracking-normal font-semibold"
                      dangerouslySetInnerHTML={{__html: description}}
                    />
                    <div className="flex items-center gap-3 align-middle">
                      <Button
                        className="max-md:p-1.5 max-md:w-7 h-[30px] truncate md:h-[38px] md:px-4"
                        variant="outlined"
                        color="inherit"
                        startIcon={<PlusIcon className="size-4 md:hidden" />}
                        disabled={!userDetails?.id}
                        onClick={() => {
                          handleAddToDashboard({
                            questionId: id,
                            type,
                            answers,
                            description,
                            filters: getAppliedFilters(
                              filters,
                              fixedFilters,
                              filterOptions,
                              dateFilter,
                            ),
                          })
                        }}
                      >
                        <span className="hidden text-primary-400 md:block">
                          {t('add-to-dashboard')}
                        </span>
                      </Button>
                      <span className="text-xs font-bold text-primary-500">Q{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex w-full gap-4 pb-5 max-md:border-b border-border mb-9">
                    <div className="flex items-center gap-2 pr-4 border-r border-border">
                      <ChatBubbleLeftEllipsisIcon className="size-4" />
                      <p className="text-xs">
                        {t('answered')}{' '}
                        <span className="font-bold text-primary-500">
                          {answered ? (answered > maxAnswers ? maxAnswers : answered) : 0}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChatBubbleLeftIcon className="size-4" />
                      <p className="text-xs">
                        {t('skipped')}{' '}
                        <span className="font-bold text-primary-500">
                          {' '}
                          {skipped && skipped > 0 ? skipped : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ReportQuestion data={{answers, total: answered, id, type, ...rest}} />
                </div>
              ),
            )}
          </div>
        </InfiniteScroller>
      )}
    </>
  )
}

export default ComponentToShow

export const colors = [
  '#898BF3',
  '#90DDFF',
  '#6EEDBF',
  '#BD87DE',
  '#F8929E',
  '#ECC253',
  '#F0A35D',
  '#6593EB',
  '#9CDC9E',
  '#ED6E6E',
  '#EEA8EB',
  '#5BB8BE',
  '#A56DA4',
  '#7970C2',
  '#A83D64',
  '#814759',
  '#FFBFC6',
  '#E6BE99',
  '#CBA74D',
  '#3E9BD0',
  '#5871A2',
  '#7FB25F',
  '#129191',
  '#5B735B',
  '#D4564D',
  '#B2AFDE',
  '#9DB8C5',
  '#6BA990',
  '#947CA1',
  '#A97278',
  '#B09D6B',
  '#90663F',
  '#50658D',
  '#667B67',
  '#937D7D',
  '#B2A2B2',
  '#90AAAC',
  '#D8C4D8',
  '#D4D2E8',
  '#EBD6D8',
  '#F9E6B5',
  '#A2DDFF',
  '#C4DFB4',
  '#A5E2E2',
  '#9EAF9F',
]

export const borderColors = [
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
  '#898bf3',
  '#6eedbf',
  '#f8929e',
  '#ecc253',
]
