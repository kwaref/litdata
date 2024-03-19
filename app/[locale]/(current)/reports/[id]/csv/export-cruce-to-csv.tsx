import {memo, useState, useEffect, type ReactNode} from 'react'
import {pdfStore} from '@/components/ui/PrintPDF'
// import {getTotal} from '../page'
// import ExcelJS from 'exceljs'
import {mkConfig, generateCsv, download} from 'export-to-csv'
import {type Question} from '@/types_db'
import {useSurveyDataContext} from '../survey-data-context'
import {stripHtml} from 'string-strip-html'

interface ExportCruceToCsvProps {
  children: (handleExport: () => void) => ReactNode
}

function ExportCruceToCsv({children}: ExportCruceToCsvProps) {
  const documentTitle = pdfStore(state => state.documentTitle)

  const {crossesData: crosses, filterOptions} = useSurveyDataContext()

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

  // type AddRow = {
  //   init: Record<string, any>
  //   initPos: number
  //   axisX?: Record<string, any>
  //   axisY: any[]
  //   type?: any
  //   crosses?: any
  // }

  // const addRow = ({init = {}, initPos, axisX, axisY, type, crosses}: AddRow) => {
  //   let total = 0

  //   axisY.forEach((itemY: any, i: number) => {
  //     if (type === 'count') {
  //       const count =
  //         crosses
  //           ?.find((el: any) => el?.id === itemY?.value)
  //           ?.row?.find((el: any) => el?.id === axisX?.value)?.count || 0

  //       init[`${initPos + i}`] = count

  //       total += count
  //       init[`${axisY.length + 3}`] = total
  //     } else if (type === 'rowColumnPercent') {
  //       init[`${initPos + i}`] = `${parseFloat(
  //         crosses
  //           ?.find((el: any) => el?.id === itemY?.value)
  //           ?.row?.find((el: any) => el?.id === axisX?.value)?.rowColumnPercent || 0,
  //       ).toFixed(1)}%`
  //     } else if (type === 'rowPercent') {
  //       init[`${initPos + i}`] = `${parseFloat(
  //         crosses
  //           ?.find((el: any) => el?.id === itemY?.value)
  //           ?.row?.find((el: any) => el?.id === axisX?.value)?.rowPercent || 0,
  //       ).toFixed(1)}%`
  //     } else if (type === 'columnPercent') {
  //       init[`${initPos + i}`] = `${parseFloat(
  //         crosses
  //           ?.find((el: any) => el?.id === itemY?.value)
  //           ?.row?.find((el: any) => el?.id === axisX?.value)?.columnPercent || 0,
  //       ).toFixed(1)}%`
  //     } else {
  //       init[`${initPos + i}`] = type === 'label' ? itemY.label : ' '
  //     }
  //   })

  //   return init
  // }

  // const [state, setState] = useState<any>(null)
  // useEffect(() => {
  //   if (crosses?.length > 0 && crosses?.[0]?.data?.length > 0 && axis1?.[0] && axis2?.[0]) {
  //     const rows: any[] = []
  //     const type: any = {1: 'count', 2: 'rowColumnPercent', 3: 'rowPercent', 4: 'columnPercent'}
  //     // @ts-ignore
  //     axis2?.[0]?.choices.forEach((axisX: any, idx: number) =>
  //       [1, 2, 3, 4].forEach(number =>
  //         rows.push(
  //           addRow({
  //             init: {
  //               1:
  //                 idx === 0 && number === 1
  //                   ? // @ts-ignore
  //                     stripHtml(`Q1 ${axis1?.[0]?.label ?? ''}`).result
  //                   : ' ',
  //               2: number === 1 ? axisX.label : '',
  //             },
  //             initPos: 3,
  //             // @ts-ignore
  //             axisY: axis1?.[0]?.choices,
  //             axisX,
  //             type: type[number],
  //             crosses: crosses?.[0]?.data,
  //           }),
  //         ),
  //       ),
  //     )

  //     setState({
  //       csvConfig: mkConfig({
  //         filename: documentTitle,
  //         useKeysAsHeaders: false,
  //         columnHeaders: [
  //           {
  //             key: '1',
  //             displayLabel: ' ',
  //           },
  //           {
  //             key: '2',
  //             displayLabel: ' ',
  //           },
  //           {key: '3', displayLabel: 'Q2'},
  //           // @ts-ignore
  //           ...axis2?.[0]?.choices?.slice(1)?.map((_: any, i: number) => ({
  //             key: `${4 + i}`,
  //             displayLabel: ' ',
  //           })),
  //           {
  //             // @ts-ignore
  //             key: `${axis2?.[0]?.choices?.slice(1)?.length + 4}`,
  //             displayLabel: ' ',
  //           },
  //         ],
  //       }),
  //       mockData: [
  //         {
  //           1: ' ',
  //           2: ' ',
  //           // @ts-ignore
  //           3: stripHtml(axis2?.[0]?.label ?? '').result,
  //         },
  //         addRow({
  //           init: {
  //             1: ' ',
  //             2: ' ',
  //             // @ts-ignore
  //             [`${axis2?.[0]?.choices?.slice(1)?.length + 4}`]: 'Total',
  //           },
  //           initPos: 3,
  //           // @ts-ignore
  //           axisY: axis2?.[0]?.choices,
  //           type: 'label',
  //         }),
  //         ...rows,
  //       ],
  //     })
  //   }
  // }, [crosses, axis1, axis2])

  // const csv = state && generateCsv(state.csvConfig)(state.mockData)
  // const exportExcelFile = () => download(state?.csvConfig)(csv)

  // return <>{children(exportExcelFile)}</>

  const columns = [
    [
      '',
      '',
      ...axis2?.map(
        (questionX: any) =>
          questionX?.choices
            ?.map((_: any, i: number) => (i === 0 ? questionX?.label : ''))
            .join(','),
      ),
    ].join(','),
    [
      '',
      '',
      ...axis2?.map(
        (questionX: any) => questionX?.choices?.map((choice: any) => choice?.label).join(','),
      ),
    ].join(','),
  ]

  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const tempRows: any[] = []
    let prevLength = 0

    axis1?.forEach((questionY: any, idxY: number) => {
      questionY?.choices?.forEach((choiceY: any, i: number) => {
        const newRow = [i === 0 ? questionY?.label : '', choiceY?.label]
        const newRowPercent1 = ['', '']
        const newRowPercent2 = ['', '']
        const newRowPercent3 = ['', '']

        tempRows.push(newRow)
        tempRows.push(newRowPercent1)
        tempRows.push(newRowPercent2)
        tempRows.push(newRowPercent3)

        axis2?.forEach(
          (questionX: any, idxX: number) =>
            questionX?.choices?.forEach((choiceX: any) => {
              const count =
                crosses?.[0]?.data
                  ?.find((el: any) => el?.id === choiceY?.value)
                  ?.row?.find((el: any) => el?.id === choiceX?.value)?.count || 0
              const percent1 = `${parseFloat(
                crosses?.[0]?.data
                  ?.find((el: any) => el?.id === choiceY?.value)
                  ?.row?.find((el: any) => el?.id === choiceX?.value)?.rowColumnPercent || 0,
              ).toFixed(1)}%`
              const percent2 = `${parseFloat(
                crosses?.[0]?.data
                  ?.find((el: any) => el?.id === choiceY?.value)
                  ?.row?.find((el: any) => el?.id === choiceX?.value)?.rowPercent || 0,
              ).toFixed(1)}%`
              const percent3 = `${parseFloat(
                crosses?.[0]?.data
                  ?.find((el: any) => el?.id === choiceY?.value)
                  ?.row?.find((el: any) => el?.id === choiceX?.value)?.columnPercent || 0,
              ).toFixed(1)}%`

              tempRows[idxY === 0 ? (i === 0 ? 0 : i * 4) : prevLength + i * 4]?.push(percent1)
              tempRows[idxY === 0 ? (i === 0 ? 1 : i * 4 + 1) : prevLength + i * 4 + 1]?.push(
                percent2,
              )
              tempRows[idxY === 0 ? (i === 0 ? 2 : i * 4 + 2) : prevLength + i * 4 + 2]?.push(
                percent3,
              )
              tempRows[idxY === 0 ? (i === 0 ? 3 : i * 4 + 3) : prevLength + i * 4 + 3]?.push(count)
            }),
        )
      })
      prevLength = tempRows.length
    })
    setRows(tempRows)
  }, [axis1, axis2, crosses])

  const exportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      columns.join('\n') +
      '\n' +
      rows.map(r => r.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', documentTitle)
    document.body.appendChild(link) // Required for FF

    link.click()
    link.remove()
  }

  return <>{children(exportCsv)}</>
}

export default memo(ExportCruceToCsv)
