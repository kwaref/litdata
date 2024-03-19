/* eslint-disable tailwindcss/enforces-shorthand */
import {memo, useEffect, useState} from 'react'

import {type ColumnsProps} from '@/components/ui/Table'
import dynamic from 'next/dynamic'
import {useTranslations} from 'next-intl'
import TrendingBars from '../charts/trending-bars'
import {useSurveyDataContext} from '../../survey-data-context'
import {handleTrend} from '@/utils/trends/handleTrends'
// import {colors} from '../../component-to-show'
import {faker} from '@faker-js/faker'
import {reportStore} from '@/components/utils/use-reports'

const HorizontalBars = dynamic(async () => await import('../charts/horizontal-bars'), {ssr: false})
const Table = dynamic(async () => await import('@/components/ui/Table'), {
  ssr: false,
})

interface ReportQuestionProps {
  data: {
    id: string
    answers: any
    total: number
    choices?: any
    type: string
    matrixMap?: any
  }
  isExport?: boolean
}

const questionsIds = [
  '172714168',
  '172717559',
  '172725984',
  '175291989',
  '175292133',
  '175292982',
  '175293201',
  '178893466',
  '178893731',
  '178893883',
  '178893908',
  '180500087',
  '178894706',
  '178894464',
  '175293838',
  '175299292',
  '175299944',
  '178116054',
  '175301612',
  '178888647',
  '178895149',
  '178895865',
  '175303221',
  '175303238',
  '175303473',
  '175303578',
  '180500088',
  '180500090',
  '180500089',
  '180500091',
  '180500092',
  '180500093',
  '180500096',
  '180500094',
  '180500095',
  '180500097',
  '180500098',
  '180500099',
  '175817615',
  '175818512',
  '175819498',
  '175819665',
  '176313655',
  '176318819',
  '176324241',
  '176368005',
  '176368292',
  '176368754',
  '176098456',
  '176098647',
  '176373063',
  '176374894',
  '176376542',
  '177836676',
  '177837810',
  '177838240',
  '177839253',
  '176377223',
  '176377610',
  '176378156',
  '178124084',
  '178124529',
  '178124538',
  '176378338',
  '178128518',
  '178128672',
  '176501247',
  '176501975',
  '178138779',
  '177148550',
  '176502822',
  '178129578',
  '176712641',
  '178130541',
  '176713283',
  '176716155',
  '176718387',
  '176719690',
  '178139906',
  '176905790',
  '178150226',
  '178118827',
  '178141958',
  '178142100',
  '178151326',
  '178151351',
  '178152681',
  '178152685',
  '178153208',
  '178153320',
  '178153595',
  '178153613',
  '178153886',
  '178153895',
  '178154226',
  '178154248',
  '178154532',
  '178154539',
  '178154839',
  '178154868',
  '178151378',
  '178151396',
  '178156977',
  '178157126',
  '178157546',
  '177749970',
  '177750047',
  '177750142',
  '177750410',
  '177750531',
  '178964727',
  '178964890',
  '178157746',
  '178383771',
  '178391910',
  '178484751',
  '178485302',
  '178489732',
  '178490799',
  '178495009',
  '178497596',
  '178498616',
  '178499165',
  '178500421',
  '178501910',
  '178505499',
  '178656396',
  '178503585',
  '178504286',
  '178656844',
  '178506699',
  '178506786',
  '178506963',
  '178507619',
  '178507703',
  '178507921',
  '180474664',
  '180474705',
  '180474435',
  '172732577',
  '172733331',
  '172734347',
  '172734981',
  '172736527',
  '172737784',
  '175288397',
  '175821366',
]

function ReportQuestion({
  data: {answers, total, type, choices, matrixMap, id: questionId},
  isExport = false,
}: ReportQuestionProps) {
  const t = useTranslations('Report.Table')
  const {trend} = useSurveyDataContext()
  const exportTrendData = reportStore(state => {
    // if (process.env.NODE_ENV === 'development' && isExport) {
    //   return state.exportTrendData?.[questionId]?.slice(0, 20)
    // }
    return state.exportTrendData?.[questionId]
  })

  const colors = answers?.map((item: {color: any}) => item?.color)

  const columns: ColumnsProps[] = [
    {
      headerName: t('name'),
      accessor: ({description}, idx) => (
        <div className="w-full inline-flex items-center gap-1.5">
          <div
            style={{backgroundColor: colors?.[idx] ?? faker.color.rgb({format: 'css'})}}
            className="min-w-[0.75rem] w-3 h-3 rounded-full relative"
          >
            <div className="min-w-[0.375rem] w-1.5 h-1.5 bg-white rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " />
          </div>
          <span>{description}</span>
        </div>
      ),
      cellProps: {className: 'py-2'},
      headerCellProps: {
        className: '!relative',
      },
    },
    {
      headerName: t('responses'),
      accessor: ({percent}) => <span>{percent}%</span>,
      cellProps: {className: 'w-[40px] min-w-[40px] max-w-[40px] py-2'},
      headerCellProps: {
        className: ' !relative',
      },
    },
    {
      headerName: t('no'),
      accessor: 'count',
      cellProps: {className: 'w-[40px] min-w-[40px] max-w-[40px] py-2'},
      headerCellProps: {
        className: ' !relative',
      },
    },
  ]

  const headerCellClass =
    'text-primary-300 border-l border-white bg-[#EAEAEC] px-3 py-1.5 text-left text-[10px] font-medium !relative'

  const celClass =
    'text-primary-400 border-b border-border px-3 py-4 text-left text-[10px] text-end'

  return (
    <div className="flex flex-col items-center justify-center w-full gap-10">
      {trend === 1 ? (
        <>
          {questionsIds.includes(questionId) && (
            <HorizontalBars chartData={answers} type={type} matrixMap={matrixMap} />
          )}

          {type === 'matrix' ? (
            <div className="w-full overflow-hidden overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="bg-[#EAEAEC] !relative" />
                    {choices?.map(({id, description}: any) => (
                      <th key={id} className={headerCellClass}>
                        {description?.toUpperCase()}
                      </th>
                    ))}
                    <th className={headerCellClass}>TOTAL</th>
                    <th className={headerCellClass}>WEIGHTED AVERAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {answers?.map(({id, description, weights, total, average}: any) => (
                    <tr key={id} className="border-b border-border">
                      <td className={celClass}>{description}</td>
                      {weights?.map(({count, percent}: any) => (
                        <td key={`${id}-weights`} className={celClass}>
                          <p>{percent}%</p>
                          <p>{count}</p>
                        </td>
                      ))}
                      <td className={celClass}>{total}</td>
                      <td className={celClass}>{average}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Table
              rows={answers || []}
              columns={columns}
              footer={
                <>
                  <td
                    className="border-b border-border px-3 py-1.5 text-left text-sm font-semibold"
                    colSpan={2}
                  >
                    {t('total')}
                  </td>
                  <td className="border-b border-border px-3 py-1.5 text-left text-sm font-semibold">
                    {total}
                  </td>
                </>
              }
            />
          )}
        </>
      ) : (
        <>
          {/* <TrendingBars chartData={exportTrendData} trend={trend} /> */}
          <div className="w-full overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-primary-300 bg-[#EAEAEC] px-2 py-1.5 text-left text-[10px] font-medium w-[190px] min-w-[190px] max-w-[190px] !relative">
                    Answers
                  </th>
                  {exportTrendData?.map(({label}: any) => (
                    <th
                      key={label}
                      className="text-primary-300 bg-[#EAEAEC] px-2 py-1.5 text-left text-[10px] font-medium w-[40px] min-w-[40px] max-w-[40px] !relative"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {answers?.map(({id: choiceId, description}: any, idx: number) => (
                  <tr key={`${choiceId}-${crypto.randomUUID()}`}>
                    <td className="px-2 py-4 text-sm text-left border-b text-primary-900 border-border">
                      <div className="inline-flex gap-1.5 items-center w-[190px] min-w-[190px] max-w-[190px]">
                        <div
                          style={{
                            backgroundColor: colors?.[idx] ?? faker.color.rgb({format: 'css'}),
                          }}
                          className="min-w-[0.75rem] w-3 h-3 rounded-full relative"
                        >
                          <div className="min-w-[0.375rem] w-1.5 h-1.5 bg-white rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " />
                        </div>
                        {description}
                      </div>
                    </td>
                    {exportTrendData?.map(({questions}: any) => (
                      <td
                        key={`${questions?.[0]?.id}-${crypto.randomUUID()}`}
                        className="text-primary-900 border-b border-border px-2 py-4 text-left text-sm w-[40px] min-w-[40px] max-w-[40px]"
                      >
                        {
                          questions?.[0]?.answers?.choices?.find((c: any) => c?.id === choiceId)
                            ?.percent
                        }
                        %
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default memo(ReportQuestion)
