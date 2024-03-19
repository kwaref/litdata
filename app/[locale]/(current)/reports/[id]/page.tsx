'use client'

import {pdfStore} from '@/components/ui/PrintPDF'
import {useEffect, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
import NameDialog from './name-dialog'
import ExportFormatDialog from './export-format-dialog'
import useToggle from '@/components/utils/useToggle'
import {useSurveyDataContext} from './survey-data-context'
import {getTotal, reportStore} from '@/components/utils/use-reports'
import {usePathname, useRouter} from 'next/navigation'
import {useSupabase} from '@/app/supabase-provider'
import {type Question, type Survey} from '@/types_db'
import {useTranslations} from 'next-intl'
import {XMarkIcon} from '@heroicons/react/20/solid'
import {useReportFilters} from '@/components/utils/use-filters'
import CrucesTable from './crosstabs/cruces-table'
import {useUser} from '@/components/utils/use-user'
import toastAlert from '@/utils/toastAlert'
import {colors} from './component-to-show'
import {faker} from '@faker-js/faker'
import {handleTrend} from '@/utils/trends/handleTrends'
import {retrieve} from '@/components/utils/storage'
import {surveyStore} from '@/components/utils/use-survey'

const ExportToPdf = dynamic(async () => await import('./pdf/export-to-pdf'), {
  ssr: false,
})
const ComponentToShow = dynamic(async () => await import('./component-to-show'), {ssr: false})

interface ReportViewProps {
  params: {id: string}
}

function ReportView({params}: ReportViewProps) {
  const componentRef = useRef<any>(null)
  const {userDetails} = useUser()
  const setComponentRef = pdfStore(state => state.setComponentRef)
  const setExportData = reportStore(state => state.setExportData)
  const {isOpen, onClose} = useToggle(userDetails?.show_reports_banner || false)
  const {
    surveyData,
    setCrosses,
    setFilters,
    editMode,
    setEditMode,
    setDateFilter,
    trend,
    setTrend,
    relevantAnswers,
    originalSurveyData,
  } = useSurveyDataContext()
  const [loadedFilters, setLoadedFilters] = useState([])
  const path = usePathname()
  const {supabase} = useSupabase()
  const t = useTranslations('Report')
  const {path: reportPath, resetPath} = useReportFilters()
  const router = useRouter()
  const setExportTrend = reportStore(state => state.setExportTrendData)
  const {loading} = surveyStore()

  useEffect(() => {
    return () => {
      resetPath()
      setFilters([])
      // setCrosses([])
    }
  }, [])

  useEffect(() => {
    if (trend > 1 && !loading && relevantAnswers && originalSurveyData) {
      setExportTrend(handleTrend(trend, relevantAnswers, originalSurveyData))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relevantAnswers, originalSurveyData, trend, loading])

  useEffect(() => {
    // if (params?.id && !['filter', 'crosstab'].includes(params?.id)) {
    //   const newData = createData(surveyData)
    //   setExportData(newData)
    // } else {
    //   const newData = createData(surveyData)
    //   setExportData(newData)
    // }
    const newData = createData(surveyData)
    setExportData(newData)
  }, [params?.id, surveyData])

  useEffect(() => {
    const reportIdStored = retrieve('reportId')
    const reportId = reportIdStored ?? params?.id
    if (reportId && !['filter', 'crosstab'].includes(reportId)) {
      const fetchReportData = async () => {
        const {data} = await supabase.from('reports').select('*').eq('id', reportId).single()

        setTrend(data?.trend)
        if (data?.isFilter) {
          setDateFilter(data?.data?.dateFilter)
          setEditMode({isEdit: true, mode: 'filter'})
          setDateFilter(data?.data?.dateFilter)
          // @ts-ignore
          if (loadedFilters?.length === 0) setLoadedFilters([...data?.data?.filters])
        } else {
          setEditMode({isEdit: true, mode: 'crosstab'})
          setCrosses(data?.data?.crosses)
        }
      }
      fetchReportData()
    } else {
      setEditMode({
        isEdit: false,
        mode: params?.id,
      })
    }
  }, [params?.id])

  useEffect(() => {
    if (loadedFilters?.length > 0) setFilters(loadedFilters)
  }, [loadedFilters])

  useEffect(() => {
    // setDocumentTitle('Reporte de prueba')
    setComponentRef(componentRef)
  }, [componentRef.current, trend])

  const createData = (data: Survey) => {
    return (
      data?.questions?.map((question: Question) => {
        const total = getTotal(question)

        if (question?.type === 'matrix') {
          // @ts-ignore
          const matrixMap = question.answers?.choices.map((choice: any) => {
            return {
              choice_id: choice.id,
              choice_description: choice.description,
              // @ts-ignore
              rows: question.answers?.rows.map((row: any) => ({
                row_id: row.id,
                row_description: row.description,
                count: 0,
              })),
            }
          })

          data?.answers?.forEach((answer: any) => {
            answer.pages.forEach((page: any) => {
              const actualQuestion = page.questions.find((el: any) => el.id === question.id)

              if (actualQuestion) {
                actualQuestion.answers.forEach((el: any) => {
                  const matrixChoice = matrixMap?.find((m: any) => m.choice_id === el.choice_id)
                  const choiceRow = matrixChoice?.rows?.find((r: any) => r.row_id === el.row_id)
                  if (choiceRow) {
                    choiceRow.count = choiceRow.count + 1
                  }
                })
              }
            })
          })

          const totalByRow = {}
          matrixMap?.forEach(({rows}: any) => {
            rows.forEach(({row_id, count}: any) => {
              // @ts-ignore
              totalByRow[row_id] = (totalByRow[row_id] ?? 0) + count
            })
          })

          return {
            ...question,
            answered: total,
            maxAnswers: question?.maxAnswers,
            skipped: total < question?.maxAnswers ? question.maxAnswers - total : 0,
            matrixMap: matrixMap.map((matrix: any) => ({
              ...matrix,
              rows: matrix?.rows?.map((row: any) => ({
                ...row,
                // @ts-ignore
                percent: ((row.count * 100) / totalByRow[row.row_id]).toFixed(2),
              })),
            })),
            // @ts-ignore
            choices: question.answers?.choices,
            // @ts-ignore
            answers: question.answers?.rows?.map(({id, description}: any) => {
              const counts = matrixMap?.map(({rows}: any) => ({
                count: rows?.find(({row_id}: any) => row_id === id)?.count,
              }))
              const total = counts.reduce((acc: number, curr: any) => acc + curr.count, 0)

              const average =
                total /
                // @ts-ignore
                question.answers?.choices?.length

              return {
                id,
                description,
                weights: counts?.map(({count}: any) => ({
                  count,
                  percent: ((count * 100) / total)?.toFixed(2),
                })),
                total,
                average: average.toFixed(2),
              }
            }),
          }
        }
        return {
          ...question,
          answered: total,
          maxAnswers: question?.maxAnswers,
          skipped: total < question?.maxAnswers ? question.maxAnswers - total : 0,
          // @ts-ignore
          answers: question?.answers?.choices?.map((answer: any, idx: number) => ({
            ...answer,
            percent:
              answer.count && getTotal(question)
                ? ((answer.count / getTotal(question)) * 100).toFixed(2)
                : 0,
            color: colors[idx] ?? faker.color.rgb({format: 'css'}),
          })),
        }
      }) || []
    )
  }

  const updateProfile = async () => {
    const {data, error} = await supabase
      .from('users')
      // @ts-ignore
      .update({show_reports_banner: false})
      .eq('id', userDetails?.id)

    if (error) toastAlert({message: error.message, type: 'error'})
    else {
      onClose()
      router.refresh()
    }
  }

  if (surveyData?.questions?.length === 0) return <></>
  return (
    <>
      <NameDialog />
      <ExportFormatDialog />
      {isOpen && (
        <div className="relative flex items-center p-6 mb-5 bg-white border rounded-md shadow-sm border-border">
          <XMarkIcon
            className="text-primary-500 absolute right-2.5 top-3 h-5 w-5 cursor-pointer"
            onClick={updateProfile}
          />
          <div>
            <h1 className="mb-3 text-xl font-semibold leading-7 text-primary-500">
              {t('Banner.title')}
            </h1>
            <p className="text-sm leading-5 text-primary-400">{t('Banner.description')}</p>
          </div>
        </div>
      )}

      {editMode.mode === 'filter' && (
        <div className="relative flex flex-col w-full gap-5 text-primary-500">
          <div style={{visibility: 'hidden'}} className="absolute max-h-screen overflow-y-auto">
            <div ref={componentRef}>{/* <ExportToPdf /> */}</div>
          </div>

          <ComponentToShow />
          {/* <ExportToExcelSpreadsheet data={extendedData} /> */}
        </div>
      )}

      {editMode.mode === 'crosstab' && <CrucesTable />}
    </>
  )
}

export default ReportView
