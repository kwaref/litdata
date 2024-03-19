'use client'
import {cn} from '@/components/utils/tailwindMerge'
import {reportStore} from '@/components/utils/use-reports'
import {type Question} from '@/types_db'
import {format} from 'date-fns'
import React, {memo, useEffect, useState} from 'react'
import {useSurveyDataContext} from '../survey-data-context'
import './cruces-table.css'
import {CalendarIcon} from '@heroicons/react/24/outline'
import {useTranslations} from 'next-intl'

// interface CrucesTableProps {}

export const colorsY = [
  '0, 191, 111',
  '80, 124, 182',
  '249, 190, 0',
  '107, 200, 205',
  '255, 139, 79',
  '125, 94, 144',
  '210, 95, 144',
  '0, 255, 0',
  '0, 0, 255',
  '255, 0, 255',
  '205, 92, 92',
  '255, 140, 0',
  '255, 215, 0',
  '255, 105, 180',
  '154, 205, 50',
  '148, 0, 211',
  '218, 165, 32',
  '143, 188, 143',
  '34, 139, 34',
  '255, 0, 175',
]
const colorsX = [
  '#CD5C5C',
  '#FF8C00',
  '#FFD700',
  '#FF69B4',
  '#9ACD32',
  '#9400D3',
  '#DAA520',
  '#8FBC8F',
  '#228B22',
  '#FF00AF',
  '#00bf6f',
  '#507cb6',
  '#f9be00',
  '#6bc8cd',
  '#ff8b4f',
  '#7d5e90',
  '#d25f90',
  '#00FF00',
  '#0000FF',
  '#FF00FF',
  '#FFFF00',
  '#00FFFF',
]

function CrucesTable() {
  const {crossesData: crosses, filterOptions, loadingCrosses} = useSurveyDataContext()
  const t = useTranslations('Common')
  const empty = useTranslations('Report.Crosstab')

  const [axis1, setAxis1] = useState([])
  const [axis2, setAxis2] = useState([])

  useEffect(() => {
    if (crosses?.length > 0 && filterOptions?.length > 0) {
      // @ts-ignore
      setAxis1(filterOptions.filter(el => crosses?.[0].questionY.includes(el.value)) || [])
      // @ts-ignore
      setAxis2(filterOptions.filter(el => crosses?.[0].questionX.includes(el.value)) || [])
    }
  }, [crosses, filterOptions])

  if (loadingCrosses) return <></>

  if (!(crosses?.length > 0) && !(crosses?.[0]?.data?.length > 0))
    return (
      <div className="sm:max-w-[35.19rem]">
        <h1 className="text-primary-400 text-sm">{empty('empty')}</h1>
      </div>
    )

  return (
    // <div className="text-primary-500 bg-background p-5 border-t-4 border-t-black">
    //   <h1 className="text-2xl font-semibold font-degular">Crosstab </h1>
    //   <div className="flex w-full gap-4 max-md:border-b border-border mb-10 mt-5">
    //     <div className="flex items-center gap-2 border-r border-black pr-4">
    //       <CalendarIcon className="h-4 w-4" />
    //       <p className="text-xs">
    //         {t('from')}{' '}
    //         <span className="text-primary-500 font-bold">
    //           {format(new Date(crosses?.[0].startDate), 'P')}
    //         </span>
    //       </p>
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <CalendarIcon className="h-4 w-4" />
    //       <p className="text-xs">
    //         {t('to')}{' '}
    //         <span className="text-primary-500 font-bold">
    //           {format(new Date(crosses?.[0].endDate), 'P')}
    //         </span>
    //       </p>
    //     </div>
    //   </div>

    <div className="text-primary-500 bg-background py-8 px-6">
      <h1 className="text-3xl font-bold">Crosstab</h1>
      <h2 className="text-lg font-medium">
        {format(new Date(crosses?.[0].startDate), 'PP')} -{' '}
        {crosses?.[0].endDate ? format(new Date(crosses?.[0].endDate), 'PP') : 'Today'}
      </h2>

      <div className="table-scroll !mt-20 w-full rounded shadow-sm !max-h-screen">
        {/* <div className="table-scroll mt-20 w-full"> */}
        <table className="table-auto">
          <thead>
            <tr>
              <th
                // style={{
                //   boxShadow: '0px 12px 10px -1px rgba(0,0,0,0.05)',
                //   WebkitBoxShadow: '0px 12px 10px -1px rgba(0,0,0,0.05)',
                //   MozBoxShadow: '0px 12px 10px -1px rgba(0,0,0,0.05)',
                // }}
                colSpan={2}
                rowSpan={2}
                align="left"
                className="bg-white h-[70px] !py-8 !px-6 max-h-[70px]"
                // className="bg-white h-[70px] !p-6 max-h-[70px] border-r border-border "
              >
                <div className="p-2 text-[10px] border border-border rounded w-fit text-primary-300 leading-3 font-normal uppercase">
                  <p className="mb-1 text-primary-500 font-medium">Key</p>
                  {/* <p className="mb-4">Key</p> */}
                  <p>Count</p>
                  <p>Percent of total</p>
                  <p>Row percentage</p>
                  <p>Column percentage</p>
                </div>
              </th>
              {axis2.map((q2: any, index: any) => (
                <th
                  colSpan={q2?.choices?.length}
                  align="left"
                  style={
                    {
                      // borderColor: colorsY[index],
                    }
                  }
                  // className={cn('bg-white flex-wrap border-t-4 !p-0 h-[70px] max-h-[70px]', {
                  //   'rounded-tl': index === 0,
                  // })}
                  className={cn(
                    'bg-white flex-wrap border-l border-t border-border !py-8 !px-4 h-[105px] max-h-[105px]',
                    // 'bg-white flex-wrap border-l border-border border-t-4 !p-0 h-[70px] max-h-[70px]',
                  )}
                  key={q2.value}
                >
                  <div
                    className="w-full h-full "
                    style={
                      {
                        // backgroundColor: `rgba(${colorsY[index]}, 0.05)`,
                      }
                    }
                  >
                    {/* <p className="text-xs bg-white py-1 px-2 rounded-sm w-fit mb-2">{`Q${
                      axis1?.length + 1 + index
                    }`}</p> */}
                    <p className="text-xs bg-white">{`Q${axis1?.length + 1 + index}`}</p>

                    <p className="text-sm w-fit line-clamp-1">{q2?.label}</p>
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              {axis2.map(
                el =>
                  // @ts-ignore
                  el.choices?.map(answer => (
                    <th
                      // style={{
                      //   boxShadow: '0px 12px 10px -1px rgba(0,0,0,0.05)',
                      //   WebkitBoxShadow: '0px 12px 10px -1px rgba(0,0,0,0.05)',
                      //   MozBoxShadow: '0px 12px 10px -1px rgba(0,0,0,0.05)',
                      // }}
                      key={answer?.value}
                      className="bg-primary-50 border-white !p-3 not-last-child:border-r max-w-[220px] truncate h-[60px] !top-[105px] !z-[2]"
                    >
                      {answer?.label}
                    </th>
                  )),
              )}
            </tr>
          </thead>
          <tbody>
            {axis1?.map(
              (q1: any, index: any) =>
                q1?.choices?.map((answerY: any, i: number) => (
                  <tr key={answerY?.id} className="group">
                    <th
                      align="left"
                      // style={{borderColor: colorsX[index]}}
                      // className={cn(
                      //   'relative min-w-[240px] max-w-[240px] flex-wrap border-border bg-white z-[3]',
                      //   {'border-t-4 rounded-s !p-0': i === 0},
                      // )}
                      className={cn(
                        'relative w-[240px] min-w-[240px] max-w-[240px] flex-wrap border-l border-border z-[3] bg-white',
                        {'border-t !p-0': i === 0},
                      )}
                    >
                      <div
                        className={cn(
                          'absolute left-0 top-0 hidden w-[240px] min-w-[240px] max-w-[240px] !p-5',
                          {block: i === 0},
                        )}
                      >
                        <p className="mb-2 font-bold text-xs py-1 px-2">{`Q${index + 1}`}</p>
                        <p className="text-sm font-normal leading-5">{q1?.label}</p>
                      </div>
                    </th>

                    <th
                      key={i}
                      align="left"
                      // style={{
                      //   borderColor: colorsX[index],
                      //   boxShadow: '14px 0px 10px -1px rgba(0,0,0,0.05)',
                      //   WebkitBoxShadow: '14px 0px 10px -1px rgba(0,0,0,0.05)',
                      //   MozBoxShadow: '14px 0px 10px -1px rgba(0,0,0,0.05)',
                      // }}
                      className={cn(
                        'bg-primary-50 h-24 text-sm w-[180px] min-w-[180px] max-w-[180px] flex-wrap !py-3 !px-4 border-b !border-b-white !left-[240px] z-[3]',
                        {
                          '!border-b-0':
                            index === axis1?.length - 1 && i === q1?.choices?.length - 1,
                          'border-t-4': i === 0,
                        },
                      )}
                    >
                      {answerY?.label}
                    </th>

                    {axis2?.map(
                      q2 =>
                        // @ts-ignore
                        q2?.choices?.map(answerX => (
                          <td
                            key={answerX?.id}
                            align="right"
                            className={cn('px-6 py-4 border-b border-border', {
                              '!border-b-0':
                                index === axis1?.length - 1 || i === q1?.choices?.length - 1,
                            })}
                          >
                            <p className="shrink-0">
                              {`${parseFloat(
                                crosses?.[0]?.data
                                  ?.find((el: any) => el?.id === answerY?.value)
                                  ?.row?.find((el: any) => el?.id === answerX?.value)
                                  ?.rowColumnPercent || 0,
                              ).toFixed(1)}%`}
                            </p>
                            <p className="shrink-0">
                              {`${parseFloat(
                                crosses?.[0]?.data
                                  ?.find((el: any) => el?.id === answerY?.value)
                                  ?.row?.find((el: any) => el?.id === answerX?.value)?.rowPercent ||
                                  0,
                              ).toFixed(1)}%`}
                            </p>
                            <p className="shrink-0">
                              {`${parseFloat(
                                crosses?.[0]?.data
                                  ?.find((el: any) => el?.id === answerY?.value)
                                  ?.row?.find((el: any) => el?.id === answerX?.value)
                                  ?.columnPercent || 0,
                              ).toFixed(1)}%`}
                            </p>
                            <p>
                              {
                                crosses?.[0]?.data
                                  ?.find((el: any) => el?.id === answerY?.value)
                                  ?.row?.find((el: any) => el?.id === answerX?.value)?.count
                              }
                            </p>
                          </td>
                        )),
                    )}
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default memo(CrucesTable)
