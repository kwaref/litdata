import {memo, useState, useEffect, type ReactNode} from 'react'
import {pdfStore} from '@/components/ui/PrintPDF'
import ExcelJS from 'exceljs'
import {barChart} from './charts/bar'
import {stripHtml} from 'string-strip-html'
import {useSurveyDataContext} from '../survey-data-context'
import {fixedFilters} from '@/utils/fixed-filters'
import format from 'date-fns/format'

interface ExportToExcelJSProps {
  data: Array<Record<string, any>>
  children: (handleExport: () => void) => ReactNode
}

const celsLetter = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']

function ExportToExcelJS({data, children}: ExportToExcelJSProps) {
  const documentTitle = pdfStore(state => state.documentTitle)
  const [_data, setData] = useState<Array<Record<string, any>>>([])
  const {filterOptions, filters, dateFilter} = useSurveyDataContext()

  useEffect(() => {
    setData(
      data?.map((question: Record<string, any>) => ({
        ...question,
        image: barChart(question)?.image,
      })),
    )
  }, [data])

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook()
    workbook.created = new Date()
    workbook.calcProperties.fullCalcOnLoad = true
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 0,
        visibility: 'visible',
      },
    ]
    let promise

    _data.forEach(({answers, description, image, answered, type, choices}, idx) => {
      const worksheet = workbook.addWorksheet(`Question ${idx + 1}`, {
        pageSetup: {fitToPage: true, fitToHeight: 5, fitToWidth: 7},
      })

      worksheet.mergeCells('A1', 'I1')
      worksheet.getCell('A1').value = stripHtml(description ?? '').result
      worksheet.getCell('A1').font = {bold: true, size: 18}
      worksheet.getRow(3).values = [`Answered: ${answered ?? 0}`, `Skipped: ${0}`]
      worksheet.getRow(5).values =
        type === 'matrix'
          ? [
              '',
              ...choices?.map(({description}: any) => description.toUpperCase()),
              'TOTAL',
              'WEIGHTED AVERAGE',
            ]
          : ['Answer Choises', 'Responses', 'No.']

      const headerFill: ExcelJS.Fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 0,
        stops: [
          {position: 0, color: {argb: 'D1D1D1'}},
          {position: 0.5, color: {argb: 'D1D1D1'}},
          {position: 1, color: {argb: 'D1D1D1'}},
        ],
      }

      worksheet.getCell('A5').fill = headerFill
      if (type === 'matrix') {
        answers?.[0]?.weights.forEach((_: any, idx: number) => {
          worksheet.getCell(`${celsLetter[idx]}5`).fill = headerFill
        })
        worksheet.getCell(`${celsLetter[answers?.[0]?.weights?.length]}5`).fill = headerFill
        worksheet.getCell(`${celsLetter[answers?.[0]?.weights?.length + 1]}5`).fill = headerFill
      } else {
        worksheet.getCell('B5').fill = headerFill
        worksheet.getCell('C5').fill = headerFill
      }

      worksheet.columns =
        type === 'matrix'
          ? [
              {
                header: '',
                width: 32,
              },
              ...choices?.map(({description}: any) => ({
                header: description.toUpperCase(),
                width: 14,
              })),
              {
                header: 'TOTAL',
                width: 14,
              },
              {
                header: 'WEIGHTED AVERAGE',
                width: 14,
              },
              {
                header: stripHtml(description ?? '').result,
                font: {bold: true, size: 18},
              },
            ]
          : [
              {
                header: 'Answer Choises',
                key: 'description',
                width: 32,
              },
              {
                header: 'Responses',
                key: 'percent',
                width: 14,
              },
              {
                header: 'No.',
                key: 'count',
                width: 10,
              },
              {
                header: stripHtml(description ?? '').result,
                font: {bold: true, size: 18},
              },
            ]

      if (dateFilter?.startDate || dateFilter?.endDate) {
        const date = `${format(new Date(dateFilter.startDate), 'P')} - ${
          dateFilter.endDate ? format(new Date(dateFilter.endDate), 'P') : 'Today'
        }`
        worksheet.getCell('E3').value = 'Filters:'
        worksheet.getCell('E4').value = date
      }

      filters?.forEach((filter, idx) => {
        const fixedData = fixedFilters.find((el: any) => el?.questionId === filter?.question_id)
        const questionData = filterOptions.find(
          // @ts-ignore
          (el: any) => (fixedData?.questionId || filter.question_id) === el.value,
        )

        const displayFilter = fixedData
          ? questionData?.choices
              ?.filter((choice: any) => filter?.choice_ids?.includes(choice?.value))
              ?.map((c: any) => c.label)
              ?.join(', ')
          : questionData?.label
        worksheet.getCell(`E${idx + 5}`).value = displayFilter
      })

      // worksheet.mergeCells(
      //   type === 'matrix' ? `${celsLetter[answers?.[0]?.weights?.length + 4]}3` : 'F3',
      //   `Z${answers?.length + 25}`,
      // )

      // const imageId2 = workbook.addImage({
      //   base64: image,
      //   extension: 'png',
      // })

      // worksheet.addImage(
      //   imageId2,
      //   type === 'matrix'
      //     ? `${celsLetter[answers?.[0]?.weights?.length + 4]}3:Z${answers?.length + 25}`
      //     : `F3:Z${answers?.length + 25}`,
      // )

      let initRowData = 6
      promise =
        type === 'matrix'
          ? Promise.all(
              answers?.map(({id, description, weights, total, average}: any, index: number) => {
                const rowValues = []
                rowValues[1] = description
                rowValues[weights?.length + 2] = total
                rowValues[weights?.length + 3] = average

                weights.forEach(({percent}: any, idx: number) => {
                  rowValues[idx + 2] = `${percent}%`
                })
                worksheet.insertRow(initRowData, rowValues)

                rowValues[1] = description
                rowValues[weights?.length + 2] = ''
                rowValues[weights?.length + 3] = ''

                weights.forEach(({count}: any, idx: number) => {
                  rowValues[idx + 2] = count
                })
                worksheet.insertRow(initRowData + 1, rowValues)
                initRowData += 2
              }),
            )
          : Promise.all(
              answers?.map(async ({description, percent, count}: any, index: number) => {
                const rowValues = []
                rowValues[1] = description
                rowValues[2] = `${percent}%`
                rowValues[3] = count
                worksheet.insertRow(6 + index, rowValues)
                // worksheet.addRow({
                //   description,
                //   percent: `${percent}%`,
                //   // percent,
                //   count,
                // })
                // worksheet.getCell(`B${index + 21}`).numFmt = '0.00%'
              }),
            )

      if (type !== 'matrix') {
        const rowValues = []
        rowValues[1] = ''
        rowValues[2] = 'Total'
        rowValues[3] = answered
        worksheet.insertRow(answers?.length + 6, rowValues)
      }
      // worksheet.addRow({
      //   description: '',
      //   percent: 'Total',
      //   count: answered,
      // }).font = {bold: true}
    })

    // @ts-ignore
    promise?.then(() => {
      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${documentTitle}.xlsx`
        anchor.click()
        window.URL.revokeObjectURL(url)
      })
    })
  }

  return (
    <>
      {children(exportExcelFile)}
      <div id="export-wraper" style={{visibility: 'hidden'}} className="absolute bg-background">
        <canvas id="export-to-excel-js" className="bg-background"></canvas>
      </div>
    </>
  )
}

export default memo(ExportToExcelJS)
