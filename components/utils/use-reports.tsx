import {type Answers, type Question, type Survey} from '@/types_db'
import {create} from 'zustand'

type ExportData = Question & {
  answered: number
  answers: Answers & {percent: number}
}

interface ReportStore {
  surveyData: Survey | null
  exportData: ExportData[]
  exportTrendData: any
  isDirty: boolean
  setSurveyData: (surveyData: Survey) => void
  setExportData: (exportData: any) => void
  setExportTrendData: (exportTrendData: any) => void
  setIsDirty: (isDirty: boolean) => void
}

export const reportStore = create<ReportStore>()(set => ({
  surveyData: null,
  exportData: [],
  exportTrendData: {},
  isDirty: false,
  setSurveyData: (surveyData: Survey) => set({surveyData}),
  setExportData: (exportData: ExportData[]) => set({exportData}),
  setExportTrendData: (exportTrendData: any[]) => set({exportTrendData}),
  setIsDirty: (isDirty: boolean) => set({isDirty}),
}))

interface ReportListStore {
  surveyData: any[]
  setSurveyData: (surveyData: any[]) => void
}

export const reportListStore = create<ReportListStore>()(set => ({
  surveyData: [],
  setSurveyData: (surveyData: any[]) => set({surveyData}),
}))

export const getTotal = (question: Record<string, any>) =>
  question?.answers?.choices.reduce((acc: any, curr: any) => (acc += curr.count), 0)
