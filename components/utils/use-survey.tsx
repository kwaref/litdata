'use client'
import {create} from 'zustand'

type SurveyData = {
  id: string | null
  questions: any[] | null
  date: string | null
  answers: any[] | null
} | null

interface UserSurveyProps {
  loading: boolean | null
  surveyData: SurveyData | null
  saveLoading: (loading: boolean | null) => void
  saveSurveyData: (surveyData: SurveyData) => void
}

export const surveyStore = create<UserSurveyProps>()(set => ({
  loading: false,
  surveyData: null,
  saveLoading: (loading: boolean | null) => set({loading}),
  saveSurveyData: (surveyData: any) => set({surveyData}),
}))
