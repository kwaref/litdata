import {memo, useState, useEffect, type ReactNode} from 'react'
import {pdfStore} from '@/components/ui/PrintPDF'
import ExcelJS from 'exceljs'
import {getTotal} from '@/components/utils/use-reports'
import {stripHtml} from 'string-strip-html'

interface ExportToCsvProps {
  data: Array<Record<string, any>>
  children: (handleExport: () => void) => ReactNode
}

function ExportToCsv({data, children}: ExportToCsvProps) {
  const documentTitle = pdfStore(state => state.documentTitle)

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

    const worksheet = workbook.addWorksheet('documentTitle', {
      pageSetup: {fitToPage: true, fitToHeight: 5, fitToWidth: 7},
    })

    data.forEach(({answers, description: questionDescription, answered, type}, questionIdx) => {
      if (type !== 'matrix') {
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
        worksheet.getCell('B1').fill = headerFill
        worksheet.getCell('C1').fill = headerFill
        worksheet.getCell('E1').fill = headerFill

        worksheet.columns = [
          {header: '', key: 'question', font: {bold: true, size: 18}},
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
        ]

        if (questionIdx > 0)
          worksheet.addRow({
            question: '',
            description: '',
            percent: '',
            count: '',
          })

        promise = Promise.all(
          answers?.map(async ({description, percent, count}: any, answerIdx: number) => {
            worksheet.addRow({
              question:
                answerIdx === 0
                  ? `Q${questionIdx} ${stripHtml(questionDescription ?? '').result}`
                  : '',
              description: stripHtml(description ?? '').result,
              percent: `${percent}%`,
              count,
            })
            // worksheet.getCell(`B${index + 21}`).numFmt = '0.00%'
          }),
        )
        worksheet.addRow({
          description: '',
          percent: 'Total',
          count: answered,
        }).font = {bold: true}
      }
    })

    // @ts-ignore
    promise.then(() => {
      workbook.csv.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${documentTitle}.csv`
        anchor.click()
        window.URL.revokeObjectURL(url)
      })
    })
  }

  return (
    <>
      {children(exportExcelFile)}
      <div style={{width: '600px', visibility: 'hidden'}} className="absolute">
        <canvas id={`export-to-csv`}></canvas>
      </div>
    </>
  )
}

export default memo(ExportToCsv)
