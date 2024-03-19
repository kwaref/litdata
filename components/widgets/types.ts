export type ColumnsProps = {
  id?: string
  accessor: string | ((row: any, idx: number, rows: any[]) => void)
  width?: number
  headerName?: string
  cellProps?: Record<string, any>
  headerCellProps?: Record<string, any>
}

export type TableProps = {
  columns: ColumnsProps[]
  rows: any[]
  containerClass?: string
  tbodyClass?: string
  tableClass?: string
  tableRowBodyProps?: any
  tableHeaderProps?: any
  scrollReveal?: boolean
}

export interface WidgetQuestionProps {
  data: {
    id: string
    description: string
    answers: any
    type: string
    matrixMap?: any
    filters: string[]
  }
  remove: (id: string | number) => void
}

export interface IWidgetProps {
  id: string
  type: string
  description: string
  filters: string[]
  answers: any[]
}

interface RegularGraphData {
  labels: string[]
  datasets: any[]
}

export interface RegularGraphProps {
  data: RegularGraphData
}

export type Choice = {
  id: string
  count: number
  percent: number
  description: string
  color: string
}

export type Answer = {
  choices: Choice[]
}

export type Question = {
  id: string
  answers: Answer
  description: string
}

export type ChartDataEntry = {
  label: string
  questions: Question[]
}
